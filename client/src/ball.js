import { generateCurrentState } from './states';

import { pointProject } from './utils';
import Constants from '../../Constants';

let jsonDescriptor = require('./updates.json');
let root = protobuf.Root.fromJSON(jsonDescriptor);
let pbWall = root.lookup('Wall');

export class Ball {
    constructor(zPos, color = 0xff0000) {
        this.pixiObj = new PIXI.Graphics();
        this.pixiObj.beginFill(color, 0.5);
        this.pixiObj.drawCircle(0, 0, Constants.BALL_RADIUS);
        this.zPos = zPos;
    }

    // @nomaster remove dependency on generateCurrentState (interpolation)
    update(povWall, curState) {
        if (curState === null) {
            curState = generateCurrentState(this);
            if (curState === null) {
                return;
            }
        }
        let adjustedZpos = curState.Zpos;
        if (povWall === pbWall.values.BACK) {
            adjustedZpos = Constants.DEPTH - curState.Zpos;
        }
        let [x0, _] = pointProject(
            Constants.BALL_RADIUS + Constants.WIDTH / 2,
            0,
            adjustedZpos
        );
        let radius = x0 - Constants.WIDTH / 2;

        let [x, y] = pointProject(curState.Xpos, curState.Ypos, adjustedZpos);
        let ratio = radius / Constants.BALL_RADIUS;
        this.pixiObj.scale.x = this.pixiObj.scale.y = ratio;
        this.pixiObj.x = x - radius;
        this.pixiObj.y = y - radius;
        this.zPos = adjustedZpos;
        return curState;
    }
}

function applyWalls(latest, next) {
    if (
        latest.Xpos > Constants.WIDTH - Constants.BALL_RADIUS &&
        latest.Xvel > 0
    ) {
        next.Xvel *= -1;
    } else if (latest.Xpos > Constants.BALL_RADIUS && latest.Xvel < 0) {
        next.Xvel *= -1;
    }

    if (
        latest.Ypos > Constants.HEIGHT - Constants.BALL_RADIUS &&
        latest.Yvel > 0
    ) {
        next.Yvel *= -1;
    } else if (latest.Ypos < Constants.BALL_RADIUS && latest.Yvel < 0) {
        next.Yvel *= -1;
    }

    if (
        latest.Zpos > Constants.DEPTH &&
        Constants.DEPTH + 2 * Constants.BALL_RADIUS > latest.Zpos &&
        latest.Zvel > 0
    ) {
        next.Zvel *= -1;
    } else if (
        latest.Zpos < 0 &&
        -2 * Constants.BALL_RADIUS < latest.Zpos &&
        latest.Zvel < 0
    ) {
        next.Zvel *= -1;
    }
}

function applySpin(ball) {
    // constant that dampens    const zMultiple = 0.05; spin effect
    const multiple = 0.0002;
    const zMultiple = 0.05;
    let out = {
        Xvel:
            ball.Xvel +
            (ball.Yang * ball.Zvel - ball.Zang * ball.Yvel) * multiple,
        Yvel:
            ball.Yvel +
            (ball.Xang * ball.Zvel - ball.Zang * ball.Xvel) * multiple,
        Zvel:
            ball.Zvel +
            (ball.Yang * ball.Xvel - ball.Xang * ball.Yvel) *
                multiple *
                zMultiple,
    };
    return out;
    // additional constant for dampening spin affect z-velocity
    // prevents ball from switching directions
}

export function tickState(latest, dt) {
    let next = JSON.parse(JSON.stringify(latest));
    applyWalls(latest, next);
    const modifiedVelocities = applySpin(next);

    next.Xpos += dt * modifiedVelocities.Xvel;
    next.Ypos += dt * modifiedVelocities.Yvel;
    next.Zpos += dt * modifiedVelocities.Zvel;
    return next;
}
