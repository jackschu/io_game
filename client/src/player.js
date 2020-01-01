import * as PIXI from 'pixi.js-legacy';
import { generateCurrentState, deleteStates } from './states';

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
        this.pixiObj.addChild(name);
    }

    hash() {
        return this.username;
    }

    update(size) {
        let curState = generateCurrentState(this);
        if (curState === null) {
            return;
        }
        this.pixiObj.x = curState.xpos - size / 2;
        this.pixiObj.y = curState.ypos - size / 2;
    }
    destroy() {
        this.pixiObj.destroy();
        deleteStates(this);
    }
}
