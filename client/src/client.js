import { socket } from './socket_io';
import { addState } from './states';
import { clip } from './utils';
import { DepthIndicator, boxesTunnel, debugCorners } from './box';
import { Player } from './player';
import { Ball } from './ball';
import Constants from '../../Constants';
import updates from './updates_pb';

let players = {};
let ball;
let depthIndicator;
let playerSize;
let lastSendTimestamp;
let gameStarted = false;
let yourServerId;
let yourWall;
let playerWalls = {};

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

socket.onmessage = event => {
    if (!gameStarted) {
        gameStarted = true;
        resize();
        setup();
    }

    let pbMessage = updates.AnyMessage.deserializeBinary(event.data);
    switch (pbMessage.getDataCase()) {
        case updates.AnyMessage.DataCase.STATE:
            let pbState = pbMessage.getState();
            let pbObject = pbState.toObject();
            let timestamp = pbObject.timestamp;
            let rawPlayerData = pbObject.playersMap;

            let incomingPlayers = new Set();

            for (const [keyI, data] of rawPlayerData) {
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
                ball = new Ball(ballData.zpos);
                ball.pixiObj = toSprite(ball.pixiObj);
                console.log('new ball', pbObject.ball.pixiObj);
                app.stage.addChild(ball.pixiObj);
            }
            addState(ballData, timestamp, ball);
            break;
        case updates.AnyMessage.DataCase.START:
            let pbStartMessage = pbMessage.getStart();
            yourServerId = pbStartMessage.getYourid();
            yourWall = pbStartMessage.getWall();
            break;
        case updates.AnyMessage.DataCase.JOIN:
            let pbJoinMessage = pbMessage.getJoin();
            let wallsArray = pbJoinMessage.toObject().playerwallsMap;
            for (const [id, wall] of wallsArray) {
                playerWalls[String(id)] = wall;
            }
            break;
        default:
            console.log('got invalid message', pbMessage);
    }
};

function moveHandler(e) {
    let now = new Date().getTime();
    if (
        lastSendTimestamp &&
        now - lastSendTimestamp < 1000 / Constants.SEND_FPS
    ) {
        return;
    }
    lastSendTimestamp = now;
    let message = new updates.Player();
    const pos = e.data.getLocalPosition(app.stage);
    message.setXpos(clip(pos.x, 0, Constants.WIDTH));
    message.setYpos(clip(pos.y, 0, Constants.HEIGHT));

    const out = message.serializeBinary();
    socket.send(out);
}

function toSprite(graphics) {
    return new PIXI.Sprite(app.renderer.generateTexture(graphics));
}

function setup() {
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
        ball.update(yourWall);
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
