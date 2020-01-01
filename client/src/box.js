import * as PIXI from 'pixi.js-legacy';
import { pointProject } from './utils';
import Constants from '../../Constants';

const NEON = 0x33ff3f;

function getLine(x0, y0, z0, x1, y1, z1) {
    let line = new PIXI.Graphics();
    line.lineStyle(2, NEON);
    const [x0_out, y0_out] = pointProject(x0, y0, z0);
    const [x1_out, y1_out] = pointProject(x1, y1, z1);
    line.moveTo(x0_out, y0_out);
    line.lineTo(x1_out, y1_out);
    return line;
}

function emptyBoxCoordinates(depth) {
    let out = pointProject(0, 0, depth);
    out.push.apply(out, pointProject(Constants.WIDTH, Constants.HEIGHT, depth));
    return out;
}

function emptyBox(depth, color = NEON, width = 2) {
    let box = new PIXI.Graphics();
    // width of lines scale with depth
    box.lineStyle((width * 500) / (depth + 500), color, 1);
    box.beginFill(0, 0);
    const [x0, y0, x1, y1] = emptyBoxCoordinates(depth);
    box.drawRect(x0, y0, x1 - x0, y1 - y0);
    box.endFill();
    return box;
}

// DEBUG corners for debugging
export function debugCorners() {
    let corners = new PIXI.Graphics();
    
    let corner = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, 10, 10);
    corners.addChild(corner);
    
    let corner2 = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(Constants.WIDTH - 10, Constants.HEIGHT - 10, 10, 10);
    corners.addChild(corner2);
    return corners;
}

export function boxesTunnel() {
    let obj = new PIXI.Graphics();
    
    // add green frames
    const num_boxes = 9;
    for (let i = 0; i < num_boxes; i++) {
        const box = emptyBox(i * 100);
        obj.addChild(box);
    }
    
    let backBoxDepth = (num_boxes - 1) * 100;

    // add lines connecting frames
    const line_indices = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ];
    for (const [i, j] of line_indices) {
        let line = getLine(
            i * Constants.WIDTH,
            j * Constants.HEIGHT,
            0,
            i * Constants.WIDTH,
            j * Constants.HEIGHT,
            backBoxDepth
        );
        obj.addChild(line);
    }
    
    return obj;
}

export class DepthIndicator {
    constructor() {
        this.pixiObj = emptyBox(0, 0x33fcff, 4);
        this.depth = 0;
    }

    update() {
        const [x0, y0, x1, y1] = emptyBoxCoordinates(this.depth);
        this.pixiObj.x = x0;
        this.pixiObj.y = y0;
        this.pixiObj.width = x1 - x0;
        this.pixiObj.height = y1 - y0;
    }
}
