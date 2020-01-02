import * as PIXI from 'pixi.js-legacy';
import { generateCurrentState, deleteStates } from './states';
import { pointProject } from './utils';
import Constants from '../../Constants';
export class Player {
    constructor(username, size) {
        this.pixiObj = new PIXI.Graphics()
            .beginFill(0xff0000, 0.3)
            .drawRect(0, 0, size, size);
        this.username = String(username);

        let name = new PIXI.Text(this.username, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white',
            align: 'right',
        });

        name.anchor.set(0.5, 0.5);
        name.position.set(size / 2, size / 2);
        this.nameText = name;
        this.pixiObj.addChild(this.nameText);
    }

    update(size, ourWall, theirWall) {
        let curState = generateCurrentState(this);
        if (curState === null) {
            return;
        }

        if (ourWall != theirWall) {
            let [x0, _] = pointProject(
                Constants.VIRTUAL_PLAYER_SIZE / 2 + Constants.WIDTH / 2,
                0,
                Constants.DEPTH
            );
            size = x0 * 2 - Constants.WIDTH;
            [curState.xpos, curState.ypos] = pointProject(
                curState.xpos,
                curState.ypos,
                Constants.DEPTH
            );
        }

        this.pixiObj.clear();
        this.pixiObj.beginFill(0xff0000, 0.3).drawRect(0, 0, size, size);
        this.pixiObj.x = curState.xpos - size / 2;
        this.pixiObj.y = curState.ypos - size / 2;
        this.nameText.position.set(size / 2, size / 2);
    }
    destroy() {
        this.pixiObj.destroy();
        deleteStates(this);
    }
}
