let host = window.location.hostname;
if (window.location.port) {
    host = host + ':' + window.location.port;
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
socket.binaryType = 'arraybuffer';

export { socket };
