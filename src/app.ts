import dotenv from 'dotenv-flow';
import * as http from 'http';
import * as WebSocket from 'ws';
import assert from 'assert';
import Client from './entities/client';
import EventsManager from './eventsManager';
import TurbulentEvent from './entities/turbulentEvent';
import ClientsManager from './clientsManager';
dotenv.config();

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const clientsManager = new ClientsManager();
const eventsManager = new EventsManager((event: TurbulentEvent) => {
  // This is the callback to send a message to all connected clients
  clientsManager.getAll().forEach((client: Client) => {
    client.sendMessage(JSON.stringify({
      ...event.asJSONObject(),
      action: "event"
    }));
  });
});

wss.on('connection', (ws: WebSocket, request: http.ClientRequest) => {
  const client = clientsManager.addClient(ws);
  ws.on('message', (message: string) => {
    // Somebody is trying to talk ?
    try {
      const parsedMessage = JSON.parse(message);
      assert.notStrictEqual(parsedMessage.action, null);
      assert.notStrictEqual(parsedMessage.action, undefined);
      switch (parsedMessage.action) {
        case "add_event":
          eventsManager.addEvent(parsedMessage.name, parsedMessage.date);
          break;
        case "say":
          clientsManager.getAll().forEach((client: Client) => {
            client.sendMessage(JSON.stringify({
              action: "message",
              message: parsedMessage.message
            }));
          });
          break;
      }
    } catch (e) {
    }
  });
  ws.on('close', () => {
    clientsManager.removeClient(client);
  });
  // Hello new client :)
  ws.send("Hello");
});

//start our http server
server.listen(process.env.HTTP_PORT, () => {
  console.log(`Server started on port ${process.env.HTTP_PORT} :)`);
});
