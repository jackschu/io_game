import { socket } from './socket_io.js';
import * as PIXI from 'pixi.js';

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

if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    autoResize: true,
});

document.body.appendChild(app.view);

window.addEventListener('resize', resize);

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

let you;

function setup() {
    /*
    you = new Player(app.screen.width / 2, app.screen.height / 2, 200, 'you');
    app.stage.addChild(you);
    */
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
    app.renderer.resize(window.innerWidth, window.innerHeight);

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
