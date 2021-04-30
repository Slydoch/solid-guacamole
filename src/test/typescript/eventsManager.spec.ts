import TurbulentEvent from '../../entities/turbulentEvent';
import EventsManager from '../../eventsManager';
import dotenv from 'dotenv';
dotenv.config();

describe("Test eventManager.js", () => {
  let eventsManager = new EventsManager((event) => {
    //console.log("send event");
  });

  beforeEach(() => {
    eventsManager.clear();
  });
  test('add a past event and send it', () => {
    eventsManager.addEvent(new TurbulentEvent("past event", new Date("2012-04-30 18:14:00")));
    expect(eventsManager.getAll().length).toBe(1);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(0);
  });
  
  
  test('add a future event and try to send it', () => {
    eventsManager.addEvent(new TurbulentEvent("future event", new Date("2951-04-30 18:17:00")));
    expect(eventsManager.getAll().length).toBe(1);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(1);
  });
  
  
  test('try with multiple events and try to send them', () => {
    eventsManager.addEvent(new TurbulentEvent("past event", new Date("2012-04-30 18:14:00")));
    eventsManager.addEvent(new TurbulentEvent("future event", new Date("2951-04-30 18:17:00")));
    expect(eventsManager.getAll().length).toBe(2);
    eventsManager.sendPastEvents();
    expect(eventsManager.getAll().length).toBe(1);
  });

  eventsManager.stop();
})
