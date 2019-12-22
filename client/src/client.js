import { socket } from './socket_io.js';
import * as PIXI from 'pixi.js';

socket.onmessage = event => {
	console.log(event);
	let data = JSON.parse(event.data);
    you_x = data.Xpos;
	you_y = data.Ypos;
	console.log(you_x);
	console.log(you_y);
}

if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
}

let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    autoReszie: true,
});

document.body.appendChild(app.view);

window.addEventListener('resize', resize);

function makePlayer(x, y, size, username) {
    var name = new PIXI.Text(username, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 'white',
        align: 'right',
    });
    name.anchor.set(0.5, 0.5);
    name.position.set(size / 2, size / 2);
    const rect = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, size, size);

    rect.position.set(x - size / 2, y - size / 2);
    rect.addChild(name);
    return rect;
}


let you;
let you_x;
let you_y;

function setup() {
	you = makePlayer(app.screen.width / 2, app.screen.height / 2, 200, 'you')
	you_x = you.x;
	app.stage.addChild(you);
	app.ticker.add(delta => gameLoop(delta));
}

// delta is the fractional lag between frame (0) if not lagging
function gameLoop(delta) {
	if(you_x){
		you.x = you_x;
	}
	if(you_y){
		you.y = you_y;
	}
}



// Add it to the stage

// Resize function window
function resize() {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
}

console.log(socket);

resize();
setup();
if (module.hot) {
    module.hot.accept('./socket_io.js', function() {
        console.log('socket_io.js hot-reloaded');
    });
}
