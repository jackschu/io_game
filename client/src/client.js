import * as PIXI from 'pixi.js-legacy';
import { socket } from './socket_io';
import { addState } from './states';
import { clip } from './utils';
import { DepthIndicator, boxesTunnel, debugCorners } from './box';
import { Player } from './player';
import { Ball } from './ball';
import Constants from '../../Constants';
import updates from './updates_pb';
var jspb = require('google-protobuf');
let players = {};
let ball;
let depthIndicator;
let playerSize;
let lastSendTimestamp;

let app = new PIXI.Application({
    antialias: true,
    transparent: false,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    resizeTo: window,
});

document.body.appendChild(app.view);
window.addEventListener('resize', resize);

socket.onmessage = event => {
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
                    app.stage.addChild(players[key].pixiObj);
                }
                addState(data, timestamp, players[key]);
            }

            for (const key in players) {
                if (!incomingPlayers.has(key)) {
                    players[key].destroy();
                    delete players[key];
                }
            }

            let ballData = pbObject.ball;
            if (ball === undefined) {
                console.log(pbObject.ball);
                ball = new Ball(ballData.zpos);
                app.stage.addChild(ball.pixiObj);
            }
            addState(ballData, timestamp, ball);
            break;
        case updates.AnyMessage.DataCase.START:
            let pbStartMessage = pbMessage.getStart();
            console.log(pbStartMessage);
        default:
            console.log('got invalid message');
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
    app.stage.addChild(depthIndicator.pixiObj);

    app.ticker.add(delta => gameLoop(delta));
}

// delta is the fractional lag between frames (1) if not lagging
function gameLoop(delta) {
    if (delta > 1.1) {
        console.log(delta);
    }

    for (const key of Object.keys(players)) {
        players[key].update(playerSize);
    }

    if (ball) {
        ball.update();
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

resize();
setup();
if (module.hot) {
    module.hot.accept('./socket_io.js', function() {
        console.log('socket_io.js hot-reloaded');
    });
}
