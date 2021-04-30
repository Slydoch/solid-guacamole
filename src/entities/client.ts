import * as WebSocket from 'ws';

class Client {
  private _id: Number;
  private _ws: WebSocket;
  constructor(id: Number, ws: WebSocket) {
    this._id = id;
    this._ws = ws;
  }

  /**
   * @returns the client id
   */
  public getId(): Number {
    return this._id;
  }

  /**
   * Send a message to the WS client
   * @param message the string message to send to the client
   */
  public sendMessage(message: string): void {
    this._ws.send(message);
  }
}


export default Client;
