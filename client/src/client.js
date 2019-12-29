import { socket } from './socket_io.js';
import * as PIXI from 'pixi.js-legacy';
const WIDTH = 1500;
const HEIGHT = 1000;
const NEON = 0x33ff3f;
const PERSPECTIVE_D = 250;
const BALL_RADIUS = 50;
const RENDER_DELAY = 50;

let serverClientGap;

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

const ballStates = [];
const playerStates = {};

function addState(rawState, timestamp, stateArr) {
    serverClientGap = timestamp - new Date().getTime();

    let state = {
        timestamp: timestamp,
        data: rawState,
    };

    stateArr.push(state);
    const base = getBaseState(stateArr);
    if (base > 0) {
        stateArr.splice(0, base);
    }
}

function generateCurrentState(stateArr) {
    let curTime = clientTime();
    let i = getBaseState(stateArr);

    if (i == -1) {
        return null;
    }

    let curState = stateArr[i];
    if (i < stateArr.length - 1) {
        let nextState = stateArr[i + 1];
        let ratio =
            (curTime - RENDER_DELAY - curState.timestamp) /
            (nextState.timestamp - curState.timestamp);
        return interpolate(curState, nextState, ratio);
    } else {
        return curState;
    }
}

class Ball {
    constructor() {
        this.pixi_obj = new PIXI.Graphics();
        app.stage.addChild(this.pixi_obj);
    }

    update() {
        const curState = generateCurrentState(ballStates);
        if (curState === null) {
            return;
        }
        const [x0, _] = pointProject(BALL_RADIUS + WIDTH / 2, 0, curState.Zpos);
        const radius = x0 - WIDTH / 2;
        this.pixi_obj.clear();
        this.pixi_obj.beginFill(0xff0000);
        const [x, y] = pointProject(
            curState.Xpos,
            curState.Ypos,
            curState.Zpos
        );
        this.pixi_obj.drawCircle(x, y, radius);
        this.pixi_obj.endFill();
        depth_indicator.depth = curState.Zpos;
    }
}

function clientTime() {
    return new Date().getTime() + serverClientGap;
}

function getBaseState(states) {
    let curTime = clientTime();
    for (let i = states.length - 1; i >= 0; i--) {
        if (curTime - states[i].timestamp >= RENDER_DELAY) {
            return i;
        }
    }
    return -1;
}

function interpolate(curState, nextState, ratio) {
    let newState = {};
    Object.keys(curState.data).forEach(key => {
        newState[key] =
            curState.data[key] +
            (nextState.data[key] - curState.data[key]) * ratio;
    });
    return newState;
}

class Player {
    constructor(username) {
        this.pixi_obj = new PIXI.Graphics()
            .beginFill(0xff0000)
            .drawRect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
        this.username = username;
        const name = new PIXI.Text(username.substring(0, 5), {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'right',
        });
        name.anchor.set(0.5, 0.5);
        name.position.set(PLAYER_SIZE / 2, PLAYER_SIZE / 2);
        this.pixi_obj.addChild(name);
        playerStates[username] = [];
        app.stage.addChild(this.pixi_obj);
    }

    update() {
        const curState = generateCurrentState(playerStates[this.username]);
        if (curState === null) {
            return;
        }
        this.pixi_obj.x = curState.Xpos;
        this.pixi_obj.y = curState.Ypos;
    }
    destroy() {
        this.pixi_obj.destroy();
        delete playerStates[this.username];
    }
}

const PLAYER_SIZE = 200;
const players = {};
let ball;
let depth_indicator;

let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    autoDensity: true,
    resolution: window.devicePixelRatio,
    resizeTo: window,
});

PIXI.settings.RESOLUTION = window.devicePixelRatio;

document.body.appendChild(app.view);

window.addEventListener('resize', resize);

socket.onmessage = event => {
    let rawData = JSON.parse(event.data);
    let ball_and_players = JSON.parse(rawData.Body);
    let rawPlayerData = JSON.parse(ball_and_players.players);
    let timestamp = JSON.parse(rawData.Timestamp);

    for (const key in rawPlayerData) {
        const data = rawPlayerData[key];
        if (players[key] === undefined) {
            players[key] = new Player(key);
        }
        addState(data, timestamp, playerStates[key]);
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
    addState(ballData, timestamp, ballStates);
};

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

function setup() {
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
