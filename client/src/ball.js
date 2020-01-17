import { generateCurrentState } from './states';
import { pointProject } from './utils';
import Constants from '../../Constants';
import updates from './updates_pb';
export class Ball {
    constructor(zPos) {
        this.pixiObj = new PIXI.Graphics();
        this.zPos = zPos;
    }

    update(povWall) {
        let curState = generateCurrentState(this);
        if (curState === null) {
            return;
        }
        if (povWall === updates.Wall.BACK) {
            curState.Zpos = Constants.DEPTH - curState.Zpos;
        }
        let [x0, _] = pointProject(
            Constants.BALL_RADIUS + Constants.WIDTH / 2,
            0,
            curState.Zpos
        );
        let radius = x0 - Constants.WIDTH / 2;
        this.pixiObj.clear();
        this.pixiObj.beginFill(0xff0000);
        let [x, y] = pointProject(curState.Xpos, curState.Ypos, curState.Zpos);
        this.pixiObj.drawCircle(x, y, radius);
        this.pixiObj.endFill();
        this.zPos = curState.Zpos;
    }
}
