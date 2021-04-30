import dotenv from 'dotenv';
import * as http from 'http';
import * as WebSocket from 'ws';
import _ from 'lodash';
import assert from 'assert';
import Client from './entities/client';
import EventsManager from './eventsManager';
import TurbulentEvent from './entities/turbulentEvent';

dotenv.config();
let clients = [];
let clientId = 0;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const eventsManager = new EventsManager((event: TurbulentEvent) => {
  // This is the callback to send a message to all connected clients
  clients.forEach((client: Client) => {
    client.sendMessage(`${JSON.stringify(event.asJSONObject())}`);
  });
});

wss.on('connection', (ws: WebSocket, request: http.ClientRequest) => {
  const client = new Client(++clientId, ws);
  clients.push(client);
  ws.on('message', (message: string) => {
    // Somebody is trying to talk ?
    try {
      console.log(message);
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage);
      assert.notStrictEqual(parsedMessage.action, null);
      assert.notStrictEqual(parsedMessage.action, undefined);
      switch(parsedMessage.action) {
        case "add_event":
          eventsManager.addEvent(new TurbulentEvent(
            parsedMessage.name,
            new Date(parsedMessage.date)
          ));
        break;
        case "say":
          clients.forEach((client: Client) => {
            client.sendMessage(parsedMessage.message);
          });
        break;
      }
    } catch (e) {
    }
  });
  ws.on('close', () => {
    // bye faithful client, It was a good time
    _.remove(clients, function (c: Client) {
      return c.getId() == client.getId();
    });
  });
  // Hello new client :)
  ws.send("Hello");
});

//start our http server
server.listen(process.env.HTTP_PORT, () => {
  console.log(`Server started on port ${process.env.HTTP_PORT} :)`);
});
