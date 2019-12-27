import { socket } from './socket_io.js';
import * as PIXI from 'pixi.js-legacy';
const WIDTH = 1500;
const HEIGHT = 1000;
const NEON = 0x33ff3f;
const PERSPECTIVE_D = 250;
let BACK_BOX_DEPTH;
class Player {
    constructor(pixi_obj) {
        this.pixi_obj = pixi_obj;
        this.nextX = pixi_obj.x;
        this.nextY = pixi_obj.y;
    }
    update() {
        this.pixi_obj.x = this.nextX;
        this.pixi_obj.y = this.nextY;
    }
    destroy() {
        this.pixi_obj.destroy();
    }
}

const PLAYER_SIZE = 200;
const players = {};
let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    resizeTo: window,
});

document.body.appendChild(app.view);

window.addEventListener('resize', resize);

socket.onmessage = event => {
    let rawData = JSON.parse(JSON.parse(event.data).Body);
    for (const key in rawData) {
        const data = rawData[key];
        if (players[key] === undefined) {
            players[key] = new Player(
                makePlayer(
                    data.Xpos,
                    data.Ypos,
                    PLAYER_SIZE,
                    key.substring(0, 5)
                )
            );
            app.stage.addChild(players[key].pixi_obj);
        } else {
            players[key].nextX = data.Xpos;
            players[key].nextY = data.Ypos;
        }
    }
    for (const key in players) {
        if (rawData[key] === undefined) {
            players[key].destroy();

            delete players[key];
        }
    }
};

function makePlayer(x, y, size, username) {
    var name = new PIXI.Text(username, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 'white',
        align: 'right',
    });
    name.anchor.set(0.5, 0.5);
    name.position.set(size / 2, size / 2);
    const rect = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, size, size);

    rect.position.set(x - size / 2, y - size / 2);
    rect.addChild(name);
    return rect;
}

function pointProject(x, y, z) {
    let x_0 = WIDTH / 2;
    let y_0 = HEIGHT / 2;
    let xp = x_0 + ((x - x_0) * PERSPECTIVE_D) / (z + PERSPECTIVE_D);
    let yp = y_0 + ((y - y_0) * PERSPECTIVE_D) / (z + PERSPECTIVE_D);

    return [xp, yp];
}

function emptyBox(depth, color = NEON) {
    let box = new PIXI.Graphics();
    box.lineStyle(2, color, 1);
    box.beginFill(0, 0);
    const [x0, y0] = pointProject(0, 0, depth);
    const [x1, y1] = pointProject(WIDTH, HEIGHT, depth);
    box.drawRect(x0, y0, x1 - x0, y1 - y0);
    box.endFill();
    return box;
}

function getLine(x0, y0, z0, x1, y1, z1) {
    let line = new PIXI.Graphics();
    line.lineStyle(2, NEON);
    const [x0_out, y0_out] = pointProject(x0, y0, z0);
    const [x1_out, y1_out] = pointProject(x1, y1, z1);
    line.moveTo(x0_out, y0_out);
    line.lineTo(x1_out, y1_out);
    return line;
}

let depth_indicator;

function setup() {
    // DEBUG corners for debugging
    let corner = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 10, 10);
    app.stage.addChild(corner);
    let corner2 = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(WIDTH - 10, HEIGHT - 10, 10, 10);
    app.stage.addChild(corner2);

    // add green frames
    const num_boxes = 10;
    for (let i = 0; i < num_boxes; i++) {
        const box = emptyBox(i * 100);
        app.stage.addChild(box);
    }
    BACK_BOX_DEPTH = (num_boxes - 1) * 100;

    // add lines connecting frames
    const line_indices = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ];
    for (const [i, j] of line_indices) {
        let line = getLine(
            i * WIDTH,
            j * HEIGHT,
            0,
            i * WIDTH,
            j * HEIGHT,
            BACK_BOX_DEPTH
        );
        app.stage.addChild(line);
    }

    app.ticker.add(delta => gameLoop(delta));
}

// delta is the fractional lag between frame (0) if not lagging
function gameLoop(delta) {
    for (const key of Object.keys(players)) {
        players[key].update();
    }
}

// Add it to the stage

// Resize function window
function resize() {
    // Resize the renderer

    var ratio = Math.min(
        window.innerWidth / WIDTH,
        window.innerHeight / HEIGHT
    );
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.scale.x = app.stage.scale.y = ratio;

    // TODO Move container to the center
    // app.stage.x = app.screen.width / 5;
    // app.stage.y = app.screen.height / 5;
    // app.stage.pivot.x = app.stage.width / 5;
    // app.stage.pivot.y = app.stage.height / 5;
    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
}

resize();
setup();
if (module.hot) {
    module.hot.accept('./socket_io.js', function() {
        console.log('socket_io.js hot-reloaded');
    });
}
