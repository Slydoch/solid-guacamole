import * as WebSocket from 'ws';

class Client {
  private _id : Number;
  private _ws : WebSocket;
  constructor(id : Number, ws : WebSocket) {
    this._id = id;
    this._ws = ws;
  }

  getId(): Number {
    return this._id;
  }

  sendMessage(message: String): void {
    this._ws.send(message);
  }
}


export default Client;
