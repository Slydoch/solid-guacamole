import EventsManager from '../../eventsManager';
import dotenv from 'dotenv-flow';
dotenv.config();

describe("Test eventsManager.ts", () => {
  let eventsManager = new EventsManager((event) => {
    //console.log("send event");
  });

  beforeEach(() => {
    eventsManager.clear();
  });
  test('asserting dates', () => {
    expect(eventsManager.assertISODate("2012-04-30T18:14:00.000Z")).toBe(true);
    expect(eventsManager.assertISODate("2012-04-30 18:14:00.000Z")).toBe(false);
    expect(eventsManager.assertISODate("2012-04-30T18:14:00")).toBe(false);
    expect(eventsManager.assertISODate("2012-04-30 18:14:00")).toBe(false);
    expect(eventsManager.assertISODate("2951-09-13T15:14:00.000Z")).toBe(true);
  });

  test('add a past event and send it', () => {
    eventsManager.addEvent("past event", "2012-04-30T18:14:00.000Z");
    expect(eventsManager.getAll().length).toBe(1);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(0);
  });


  test('add a future event and try to send it', () => {
    eventsManager.addEvent("future event", "2951-04-30T18:17:00.000Z");
    expect(eventsManager.getAll().length).toBe(1);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(1);
  });


  test('try with multiple events and try to send them', () => {
    eventsManager.addEvent("past event", "2012-04-30T18:14:00.000Z");
    eventsManager.addEvent("future event", "2951-04-30T18:17:00.000Z");
    expect(eventsManager.getAll().length).toBe(2);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(1);
  });
  eventsManager.clear();
  eventsManager.stop();
})
