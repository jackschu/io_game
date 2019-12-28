import { socket } from './socket_io.js';
import * as PIXI from 'pixi.js-legacy';
const WIDTH = 1500;
const HEIGHT = 1000;
const NEON = 0x33ff3f;
const PERSPECTIVE_D = 250;
const BALL_RADIUS = 50;
const PLAYER_SIZE = 200;
let BACK_BOX_DEPTH;
class DepthIndicator {
    constructor(pixi_obj) {
        this.pixi_obj = pixi_obj;
        this.depth = 0;
    }

    update() {
        const [x0, y0, x1, y1] = emptyBoxCoordinates(this.depth);
        this.pixi_obj.x = x0;
        this.pixi_obj.y = y0;
        this.pixi_obj.width = x1 - x0;
        this.pixi_obj.height = y1 - y0;
    }
}

class Ball {
    constructor(depth) {
        this.pixi_obj = new PIXI.Graphics().beginFill(0xff0000);
        const [x0, _] = pointProject(BALL_RADIUS + WIDTH / 2, 0, depth);
        const radius = x0 - WIDTH / 2;
        this.pixi_obj.drawCircle(WIDTH / 2, HEIGHT / 2, radius);
        this.nextX = this.pixi_obj.x;
        this.nextY = this.pixi_obj.y;
        this.nextZ = depth;
        app.stage.addChild(this.pixi_obj);
    }
    update() {
        const [x0, _] = pointProject(BALL_RADIUS + WIDTH / 2, 0, this.nextZ);
        const radius = x0 - WIDTH / 2;
        this.pixi_obj.clear();
        this.pixi_obj.beginFill(0xff0000);
        const [x, y] = pointProject(this.nextX, this.nextY, this.nextZ);
        this.pixi_obj.drawCircle(x, y, radius);
        this.pixi_obj.endFill();
    }
}

class Player {
    constructor(pixi_obj) {
        this.pixi_obj = pixi_obj;
        this.nextX = pixi_obj.x;
        this.nextY = pixi_obj.y;
    }
    update() {
        this.pixi_obj.x = this.nextX - PLAYER_SIZE / 2;
        this.pixi_obj.y = this.nextY - PLAYER_SIZE / 2;
    }
    destroy() {
        this.pixi_obj.destroy();
    }
}

function clip(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

const players = {};
let ball;
let depth_indicator;

let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    resizeTo: window,
});

document.body.appendChild(app.view);

window.addEventListener('resize', resize);

socket.onmessage = event => {
    let ball_and_players = JSON.parse(JSON.parse(event.data).Body);
    let rawPlayerData = JSON.parse(ball_and_players.players);

    for (const key in rawPlayerData) {
        const data = rawPlayerData[key];
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
        if (rawPlayerData[key] === undefined) {
            players[key].destroy();
            delete players[key];
        }
    }

    let ballData = JSON.parse(ball_and_players.ball);
    if (ball === undefined) {
        console.log('new ball');
        ball = new Ball(ballData.Zpos);
    }
    ball.nextX = ballData.Xpos;
    ball.nextY = ballData.Ypos;
    ball.nextZ = ballData.Zpos;
    depth_indicator.depth = ball.nextZ;
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
        .beginFill(0xff0000, 0.3)
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

function emptyBoxCoordinates(depth) {
    let out = pointProject(0, 0, depth);
    out.push.apply(out, pointProject(WIDTH, HEIGHT, depth));
    return out;
}

function emptyBox(depth, color = NEON, width = 2) {
    let box = new PIXI.Graphics();
    // width of lines scale with depth
    box.lineStyle((width * 500) / (depth + 500), color, 1);
    box.beginFill(0, 0);
    const [x0, y0, x1, y1] = emptyBoxCoordinates(depth);
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
function moveHandler(e) {
    const pos = e.data.getLocalPosition(app.stage);
    const out_obj = {
        XPos: clip(pos.x, 0, WIDTH),
        YPos: clip(pos.y, 0, HEIGHT),
    };
    const out = JSON.stringify(out_obj);
    socket.send(out);
}
function setup() {
    app.stage.interactive = true;
    //app.renderer.plugins.interaction.interactionFrequency = 500;
    app.stage.on('pointermove', moveHandler);
    // DEBUG corners for debugging
    let corner = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 10, 10);
    app.stage.addChild(corner);
    let corner2 = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(WIDTH - 10, HEIGHT - 10, 10, 10);
    app.stage.addChild(corner2);

    // add green frames
    const num_boxes = 9;
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
    const indicator_box = emptyBox(0, 0x33fcff, 4);
    app.stage.addChild(indicator_box);
    depth_indicator = new DepthIndicator(indicator_box);

    app.ticker.add(delta => gameLoop(delta));
}

// delta is the fractional lag between frames (1) if not lagging
function gameLoop(delta) {
    if (delta > 1.1) {
        console.log(delta);
    }

    for (const key of Object.keys(players)) {
        players[key].update();
    }

    if (ball) {
        ball.update();
    }

    depth_indicator.update();
}

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
