import dotenv from 'dotenv';
import * as http from 'http';
import * as WebSocket from 'ws';
import _ from 'lodash';
import Client from './entities/client';

dotenv.config();

const server = http.createServer();
const wss = new WebSocket.Server({ server });
let clients = [];
let clientId = 0;

wss.on('connection', (ws: WebSocket, request: http.ClientRequest) => {
  const client = new Client(++clientId, ws);
  clients.push(client);
  ws.on('message', (message: string) => {
    clients.forEach((client: Client) => {
      client.sendMessage(`${message}`);
    });
  });
  ws.on('close', () => {
    _.remove(clients, function (c: Client) {
      return c.getId() == client.getId();
    });
    console.log('websocket closed');
  });
  ws.send("Hello");
});

//start our server
server.listen(process.env.HTTP_PORT, () => {
  console.log(`Server started on port ${process.env.HTTP_PORT} :)`);
});
