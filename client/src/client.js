import { socket } from './socket_io';
import { addState, generateNextFrame, onServerState } from './states';
import { clip } from './utils';
import { DepthIndicator, boxesTunnel, debugCorners } from './box';
import { Player } from './player';
import { Ball } from './ball';
import Constants from '../../Constants';

let players = {};
let ball;
let serverBall;
let depthIndicator;
let playerSize;
let lastSendTimestamp;
let gameStarted = false;
let yourServerId;
let yourWall;
let playerWalls = {};
let AnyMessage;
let playerUpdate;
let clientMessage;
let latency;

let pbBall;
let dontCommit;

let app = new PIXI.Application({
    antialias: true,
    transparent: false,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    forceCanvas: false,
    resizeTo: window,
});

document.body.appendChild(app.view);
window.addEventListener('resize', resize);

function sendPing() {
    let message = clientMessage.create({
        ping: {
            timestamp: Date.now(),
        },
    });
    console.log('sending ping');
    const out = clientMessage.encode(message).finish();
    socket.send(out);
}

socket.onmessage = event => {
    if (!gameStarted) {
        gameStarted = true;
        resize();
        setup();
        sendPing();
    }
    let pbMessage = AnyMessage.decode(new Uint8Array(event.data));

    switch (pbMessage.data) {
        case 'pong':
            latency = Date.now() - pbMessage.pong.timestamp;
            setTimeout(sendPing, 1000);
            break;
        case 'state':
            let pbState = pbMessage.state;
            let pbObject = AnyMessage.toObject(pbMessage, { defaults: true })
                .state;
            let timestamp = pbObject.timestamp;
            let rawPlayerData = pbObject.players;

            let incomingPlayers = new Set();
            for (const keyI in rawPlayerData) {
                let data = rawPlayerData[keyI];
                let key = String(keyI);
                incomingPlayers.add(key);

                if (players[key] === undefined) {
                    players[key] = new Player(key, playerSize);
                    players[key].pixiObj = toSprite(players[key].pixiObj);
                    app.stage.addChild(players[key].pixiObj);
                }
                addState(data, timestamp, players[key]);
            }

            for (const key in players) {
                if (!incomingPlayers.has(key)) {
                    players[key].destroy();
                    delete playerWalls[key];
                    delete players[key];
                }
            }

            let ballData = pbObject.ball;
            if (ball === undefined) {
                ball = new Ball(ballData);
                serverBall = new Ball(ballData, 0x00ff00);
                ball.pixiObj = toSprite(ball.pixiObj);
                serverBall.pixiObj = toSprite(serverBall.pixiObj);
                console.log('new ball', ballData);
                app.stage.addChild(ball.pixiObj);
                app.stage.addChild(serverBall.pixiObj);
            }
            dontCommit = onServerState(ballData);
            //console.log(dontCommit);
            addState(ballData, timestamp, serverBall);
            break;
        case 'start':
            let pbStartMessage = pbMessage.start;
            yourServerId = pbStartMessage.YourID;
            yourWall = pbStartMessage.wall;
            break;
        case 'join':
            let pbJoinMessage = pbMessage.join;
            let wallsArray = pbJoinMessage.playerWalls;
            for (const id in wallsArray) {
                let wall = wallsArray[id];
                playerWalls[String(id)] = wall;
            }
            break;
        default:
            console.log('got invalid message', pbMessage);
    }
};

function moveHandler(e) {
    let now = Date.now();
    if (
        lastSendTimestamp &&
        now - lastSendTimestamp < 1000 / Constants.SEND_FPS
    ) {
        return;
    }
    lastSendTimestamp = now;

    const pos = e.data.getLocalPosition(app.stage);
    let message = clientMessage.create({
        player: {
            Xpos: clip(pos.x, 0, Constants.WIDTH),
            Ypos: clip(pos.y, 0, Constants.HEIGHT),
        },
    });

    const out = clientMessage.encode(message).finish();
    socket.send(out);
}

function toSprite(graphics) {
    return new PIXI.Sprite(app.renderer.generateTexture(graphics));
}

function setup() {
    let jsonDescriptor = require('./updates.json');

    let root = protobuf.Root.fromJSON(jsonDescriptor);
    AnyMessage = root.lookupType('AnyMessage');
    pbBall = root.lookupType('Ball');
    playerUpdate = root.lookupType('Player');
    clientMessage = root.lookupType('ClientMessage');
    app.stage.interactive = true;
    app.stage.on('pointermove', moveHandler);

    app.stage.addChild(toSprite(debugCorners()));
    app.stage.addChild(toSprite(boxesTunnel()));

    depthIndicator = new DepthIndicator();
    depthIndicator.pixiObj = toSprite(depthIndicator.pixiObj);
    app.stage.addChild(depthIndicator.pixiObj);

    app.ticker.add(delta => gameLoop(delta));
}

// delta is the fractional lag between frames (1) if not lagging
function gameLoop(delta) {
    if (delta > 1.1) {
        console.log(delta);
    }

    for (const key of Object.keys(players)) {
        players[key].update(playerSize, yourWall, playerWalls[key]);
    }

    if (ball) {
        dontCommit = generateNextFrame(dontCommit, players, delta * 16);
        ball.update(yourWall, dontCommit);
        serverBall.update(yourWall, null);
        depthIndicator.update(ball.zPos);
    }
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
        (app.screen.height * Constants.VIRTUAL_PLAYER_SIZE) /
            Constants.HEIGHT /
            ratio,
        (app.screen.width * Constants.VIRTUAL_PLAYER_SIZE) /
            Constants.WIDTH /
            ratio
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

if (module.hot) {
    module.hot.accept('./socket_io.js', function() {
        console.log('socket_io.js hot-reloaded');
    });
}

export { latency };
