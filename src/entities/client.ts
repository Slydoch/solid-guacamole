import * as WebSocket from 'ws';

class Client {
  private _id : Number;
  private _ws : WebSocket;
  constructor(id : Number, ws : WebSocket) {
    this._id = id;
    this._ws = ws;
  }


  public getId(): Number {
    return this._id;
  }

  public sendMessage(message: string): void {
    this._ws.send(message);
  }
}


export default Client;
