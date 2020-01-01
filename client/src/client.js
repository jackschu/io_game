import * as PIXI from 'pixi.js-legacy';
import { socket } from './socket_io';
import { clip, pointProject } from './utils.js';
import { DepthIndicator, boxesTunnel, debugCorners } from './box';
import Constants from '../../Constants';
import updates from './updates_pb';

let players = {};
let ball;
let playerSize;
let depthIndicator;
let lastSendTimestamp;
let serverClientGap;

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
            (curTime - Constants.RENDER_DELAY - curState.timestamp) /
            (nextState.timestamp - curState.timestamp);
        return interpolate(curState, nextState, ratio);
    } else {
        return curState.data;
    }
}

class Ball {
    constructor() {
        this.pixiObj = new PIXI.Graphics();
        this.zPos = 0;
        app.stage.addChild(this.pixiObj);
    }

    update() {
        const curState = generateCurrentState(ballStates);
        if (curState === null) {
            return;
        }
        const [x0, _] = pointProject(Constants.BALL_RADIUS + Constants.WIDTH / 2, 0, curState.zpos);
        const radius = x0 - Constants.WIDTH / 2;
        this.pixiObj.clear();
        this.pixiObj.beginFill(0xff0000);
        const [x, y] = pointProject(
            curState.xpos,
            curState.ypos,
            curState.zpos
        );
        this.pixiObj.drawCircle(x, y, radius);
        this.pixiObj.endFill();
        depthIndicator.depth = curState.zpos;
    }
}

function clientTime() {
    return new Date().getTime() + serverClientGap;
}

function getBaseState(states) {
    let curTime = clientTime();
    for (let i = states.length - 1; i >= 0; i--) {
        if (curTime - states[i].timestamp >= Constants.RENDER_DELAY) {
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
        this.pixiObj = new PIXI.Graphics()
            .beginFill(0xff0000, 0.3)
            .drawRect(0, 0, playerSize, playerSize);
        this.username = String(username);
        const name = new PIXI.Text(String(username), {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'right',
        });
        name.anchor.set(0.5, 0.5);
        name.position.set(playerSize / 2, playerSize / 2);
        this.pixiObj.addChild(name);
        playerStates[username] = [];
        app.stage.addChild(this.pixiObj);
    }

    update() {
        const curState = generateCurrentState(playerStates[this.username]);
        if (curState === null) {
            return;
        }
        this.pixiObj.x = curState.xpos - playerSize / 2;
        this.pixiObj.y = curState.ypos - playerSize / 2;
    }
    destroy() {
        this.pixiObj.destroy();
        delete playerStates[this.username];
    }
}

let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    autoDensity: true,
    resolution: window.devicePixelRatio,
    resizeTo: window,
});

document.body.appendChild(app.view);
window.addEventListener('resize', resize);

socket.onmessage = event => {
    let pbState = updates.GameState.deserializeBinary(event.data);

    let pbObject = pbState.toObject();
    let timestamp = pbObject.timestamp;
    let rawPlayerData = pbObject.playersMap;

    let incomingPlayers = new Set();

    for (const [keyI, data] of rawPlayerData) {
        let key = String(keyI);
        incomingPlayers.add(key);
        if (players[key] === undefined) {
            players[key] = new Player(key);
        }
        addState(data, timestamp, playerStates[key]);
    }

    for (const key in players) {
        if (!incomingPlayers.has(key)) {
            players[key].destroy();
            delete players[key];
        }
    }

    let ballData = pbObject.ball;
    if (ball === undefined) {
        ball = new Ball(ballData.zpos);
    }
    addState(ballData, timestamp, ballStates);
};

function moveHandler(e) {
    let now = new Date().getTime();
    if (lastSendTimestamp && now - lastSendTimestamp < 1000 / Constants.SEND_FPS) {
        return;
    }
    lastSendTimestamp = now;
    const pos = e.data.getLocalPosition(app.stage);
    const outObj = {
        XPos: clip(pos.x, 0, Constants.WIDTH),
        YPos: clip(pos.y, 0, Constants.HEIGHT),
    };
    const out = JSON.stringify(outObj);
    socket.send(out);
}

function setup() {
    app.stage.interactive = true;
    app.stage.on('pointermove', moveHandler);

    app.stage.addChild(debugCorners());
    app.stage.addChild(boxesTunnel());

    depthIndicator = new DepthIndicator();

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

    depthIndicator.update();
}

// Resize function window
function resize() {
    // Resize the renderer
    let ratio = Math.min(
        window.innerWidth / Constants.WIDTH,
        window.innerHeight / Constants.HEIGHT
    );
    
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.scale.x = app.stage.scale.y = ratio;
    
    playerSize = Math.min(
        (app.screen.height * Constants.VIRTUAL_PLAYER_SIZE) / Constants.HEIGHT / ratio,
        (app.screen.width * Constants.VIRTUAL_PLAYER_SIZE) / Constants.WIDTH / ratio
    );

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
