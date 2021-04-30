import dotenv from 'dotenv-flow';
import TurbulentEvent from '../../entities/turbulentEvent';
dotenv.config();

describe("Test clientsManager.ts", () => {
  test('test isPast', () => {
    const e1 = new TurbulentEvent("test 1", new Date("2012-04-30T18:14:00.000Z"));
    expect(e1.isPast()).toBe(true);
    const e2 = new TurbulentEvent("test 2", new Date("2951-04-30T18:14:00.000Z"));
    expect(e2.isPast()).toBe(false);
  });
})
