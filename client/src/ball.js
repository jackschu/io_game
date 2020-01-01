import * as PIXI from 'pixi.js-legacy';
import { generateCurrentState } from './states';
import { pointProject } from './utils';
import Constants from '../../Constants';

export class Ball {
    constructor(zPos) {
        this.pixiObj = new PIXI.Graphics();
        this.zPos = zPos;
    }

    hash() {
        return 'ball';
    }

    update() {
        let curState = generateCurrentState(this);
        if (curState === null) {
            return;
        }
        let [x0, _] = pointProject(Constants.BALL_RADIUS + Constants.WIDTH / 2, 0, curState.zpos);
        let radius = x0 - Constants.WIDTH / 2;
        this.pixiObj.clear();
        this.pixiObj.beginFill(0xff0000);
        let [x, y] = pointProject(
            curState.xpos,
            curState.ypos,
            curState.zpos
        );
        this.pixiObj.drawCircle(x, y, radius);
        this.pixiObj.endFill();
        this.zPos = curState.zpos;
    }
}
