document.addEventListener('keydown', onKeyDown)

function onKeyDown(key) {
    let output = -1
    if (key.keyCode === 87 || key.keyCode === 38) {
        // W or UP
        output = 0
    } else if (key.keyCode === 83 || key.keyCode === 40) {
        // S or DOWN
        output = 1
    } else if (key.keyCode === 65 || key.keyCode === 37) {
        // A or LEFT
        output = 2
    } else if (key.keyCode === 68 || key.keyCode === 39) {
        // D or RIGHT
        output = 3
    }
    if (output >= 0) {
        socket.send(output)
    }
}

let socket = new WebSocket('ws://127.0.0.1:8080/ws')
console.log('Attempting Connection...')

socket.onopen = () => {
    console.log('Successfully Connected')
    socket.send('Hi From the Client!')
}

socket.onclose = event => {
    console.log('Socket Closed Connection: ', event)
    socket.send('Client Closed!')
}

socket.onerror = error => {
    console.log('Socket Error: ', error)
}

export { socket }
