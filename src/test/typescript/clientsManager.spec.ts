import dotenv from 'dotenv-flow';
import ClientsManager from '../../clientsManager';
dotenv.config();

describe("Test clientsManager.ts", () => {
  let clientsManager;
  beforeEach(() => {
    clientsManager = new ClientsManager();
  });
  test('test adding client', () => {
    const client = clientsManager.addClient(null);
    expect(client.getId()).toBe(1);
    expect(clientsManager.getAll().length).toBe(1);
  });
  test('test removing client', () => {
    const client = clientsManager.addClient(null);
    expect(client.getId()).toBe(1);
    expect(clientsManager.getAll().length).toBe(1);
    const client2 = clientsManager.addClient(null);
    expect(client2.getId()).toBe(2);
    expect(clientsManager.getAll().length).toBe(2);
    clientsManager.removeClient(client);
    expect(clientsManager.getAll().length).toBe(1);
  });
})
