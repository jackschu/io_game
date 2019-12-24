document.addEventListener('keydown', onKeyDown);

function onKeyDown(key) {
    let output = -1;
    if (key.keyCode === 87 || key.keyCode === 38) {
        // W or UP
        output = 0;
    } else if (key.keyCode === 83 || key.keyCode === 40) {
        // S or DOWN
        output = 1;
    } else if (key.keyCode === 65 || key.keyCode === 37) {
        // A or LEFT
        output = 2;
    } else if (key.keyCode === 68 || key.keyCode === 39) {
        // D or RIGHT
        output = 3;
    }
    if (output >= 0) {
        socket.send(output);
    }
}
let host = window.location.hostname;
if (host == 'localhost') {
    host = host + ':8000';
}

let socket = new WebSocket('ws://' + host + '/ws');
console.log('Attempting Connection...' + host);

socket.onopen = () => {
    console.log('Successfully Connected');
};

socket.onclose = event => {
    console.log('Socket Closed Connection: ', event);
};

socket.onmessage = event => {
    console.log(event);
};

socket.onerror = error => {
    console.log('Socket Error: ', error);
};

export { socket };
