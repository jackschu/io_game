import { socket } from './socket_io.js'

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas'
}
//let window = document.getElementById("header");
let app = new PIXI.Application({
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    autoReszie: true,
})
document.body.appendChild(app.view)

window.addEventListener('resize', resize)
function makePlayer(x, y, size, username) {
    var name = new PIXI.Text(username, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 'white',
        align: 'right',
    })
    name.anchor.set(0.5, 0.5)
    name.position.set(size / 2, size / 2)
    const rect = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, size, size)
    rect.position.set(x - size / 2, y - size / 2)
    rect.addChild(name)
    return rect
}

const you = makePlayer(app.screen.width / 2, app.screen.height / 2, 200, 'you')
app.stage.addChild(you)
// Add it to the stage

// Resize function window
function resize() {
    // Resize the renderer
    app.renderer.resize(window.innerWidth, window.innerHeight)

    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    you.position.set(app.screen.width / 2 - 100, app.screen.height / 2 - 100)
}
console.log(socket)
resize()
