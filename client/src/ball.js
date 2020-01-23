import { generateCurrentState } from './states';

import { pointProject } from './utils';
import Constants from '../../Constants';

let jsonDescriptor = require('./updates.json');
let root = protobuf.Root.fromJSON(jsonDescriptor);
let pbWall = root.lookup('Wall');

export class Ball {
    constructor(zPos, color = 0xff0000) {
        this.pixiObj = new PIXI.Graphics();
        this.pixiObj.beginFill(color);
        this.pixiObj.drawCircle(0, 0, Constants.BALL_RADIUS);
        this.zPos = zPos;
    }

    update(povWall, curState) {
        if (curState === null) {
            curState = generateCurrentState(this);

            if (curState === null) {
                return;
            }
        }

        if (povWall === pbWall.values.BACK) {
            curState.Zpos = Constants.DEPTH - curState.Zpos;
        }
        let [x0, _] = pointProject(
            Constants.BALL_RADIUS + Constants.WIDTH / 2,
            0,
            curState.Zpos
        );
        let radius = x0 - Constants.WIDTH / 2;

        let [x, y] = pointProject(curState.Xpos, curState.Ypos, curState.Zpos);
        let ratio = radius / Constants.BALL_RADIUS;
        this.pixiObj.scale.x = this.pixiObj.scale.y = ratio;
        this.pixiObj.x = x - radius;
        this.pixiObj.y = y - radius;
        this.zPos = curState.Zpos;
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
    // constant that dampens spin effect
    const multiple = 0.0002;
    ball.Xvel += (ball.Yang * ball.Zvel - ball.Zang * ball.Yvel) * multiple;
    ball.Yvel += (ball.Zang * ball.Xvel - ball.Xang * ball.Zvel) * multiple;

    // additional constant for dampening spin affect z-velocity
    // prevents ball from switching directions
    const zMultiple = 0.05;
    ball.Zvel +=
        (ball.Yang * ball.Xvel - ball.Xang * ball.Yvel) * multiple * zMultiple;
}

export function tickState(latest, dt) {
    let next = JSON.parse(JSON.stringify(latest));
    applyWalls(latest, next);
    applySpin(next);

    next.Xpos += dt * next.Xvel;
    next.Ypos += dt * next.Yvel;
    next.Zpos += dt * next.Zvel;
    return next;
}
