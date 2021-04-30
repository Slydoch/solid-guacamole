
import Client from './entities/client';
import * as WebSocket from 'ws';

/**
 * This class is here to manage events, and save them to the DB / File
 */
class ClientsManager {
  private clients: Client[];
  private AUTO_ID: number = 0;

  constructor() {
    this.AUTO_ID = 0;
    this.clients = [];
  }


  /**
   * Add a new websocket client
   * @param wsClient The websocket client
   * @returns The added client
   */
  public addClient(wsClient: WebSocket): Client {
    this.AUTO_ID++;
    const client = new Client(this.AUTO_ID, wsClient);
    this.clients.push(client);
    return client;
  }

  /**
   * Remove a client, bye
   * @param client the client to be removed
   */
  public removeClient(client: Client): void {
    this.clients = this.clients.filter((c) => {
      return c.getId() != client.getId();
    });
  }

  /**
   * Return all currently connected clients
   * @returns All connected clients
   */
  public getAll(): Client[] {
    return this.clients;
  }
}


export default ClientsManager;
