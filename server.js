const { WebSocketServer } = require('ws');
const http = require('http');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', function (connection) {
    console.log(`Recieved a new connection.`);
});
const port = 8000;

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});