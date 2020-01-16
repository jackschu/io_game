import { generateCurrentState } from './states';
import { pointProject } from './utils';
import Constants from '../../Constants';
import updates from './updates_pb';
export class Ball {
    constructor(zPos) {
        this.pixiObj = new PIXI.Graphics();
        this.pixiObj.beginFill(0xff0000);
        this.pixiObj.drawCircle(0, 0, Constants.BALL_RADIUS);
        this.zPos = zPos;
    }

    update(povWall) {
        let curState = generateCurrentState(this);
        if (curState === null) {
            return;
        }
        if (povWall === updates.Wall.BACK) {
            curState.zpos = Constants.DEPTH - curState.zpos;
        }
        let [x0, _] = pointProject(
            Constants.BALL_RADIUS + Constants.WIDTH / 2,
            0,
            curState.zpos
        );
        let radius = x0 - Constants.WIDTH / 2;
        /* this.pixiObj.clear();
         * this.pixiObj.beginFill(0xff0000); */
        let [x, y] = pointProject(curState.xpos, curState.ypos, curState.zpos);
        let ratio = radius / Constants.BALL_RADIUS;
        this.pixiObj.scale.x = this.pixiObj.scale.y = ratio;
        this.pixiObj.x = x - radius;
        this.pixiObj.y = y - radius;
        //this.pixiObj.drawCircle(x, y, radius);
        this.zPos = curState.zpos;
    }
}
