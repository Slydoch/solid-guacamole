
import assert from 'assert';
import fs from 'fs';
import path from 'path';

import TurbulentEvent from "./entities/turbulentEvent";

/**
 * This class is here to manage events, and save them to the DB / File
 */
class EventsManager {
  private events: TurbulentEvent[];
  private fileName: string;
  private interval: NodeJS.Timeout;
  private callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
    this.init();
  }

  /**
   * Used to init the database or the flat file storage in this case
   * I choose to use flat file storage because this is not in the scope, and actually easier to run & setup
   * This may be better to use any database storage for a live application
   * Also clean old event
   */
  private init(): void {
    this.fileName = path.join(__dirname, '..', process.env.DATA_DIRECTORY, "/events.json");
    if (!fs.existsSync(this.fileName)) {
      fs.writeFileSync(this.fileName, "[]");
    }
    const stringEvents: string = fs.readFileSync(this.fileName, { encoding: "utf8", flag: "r" });
    const eventsObjs: object[] = JSON.parse(stringEvents);
    this.events = eventsObjs.map<TurbulentEvent>(function (e: object) {
      return TurbulentEvent.FromJSON(e);
    });
    this.interval = setInterval(this.sendPastEvents, 5000);
  }

  /**
   * Save events on the file
   */
  private save = (): void => {
    fs.writeFileSync(this.fileName, JSON.stringify(
      this.events.map<object>((e: TurbulentEvent) => {
        return e.asJSONObject();
      })
    ));
  }

  /**
   * Foreach event, if it's past, send a message to all connected clients
   * and remove it from the array
   * This is call with an interval initialized on EventsManager.init()
   * @see EventsManager.init()
   */
  public sendPastEvents = (): void => {
    let hasEventSent = false;
    this.events = this.events.filter((e: TurbulentEvent): boolean => {
      const isPast: boolean = e.isPast();
      if (isPast) {
        // Event is sent here
        hasEventSent = true;
        this.callback(e);
      }
      return !isPast;
    });
    if (hasEventSent) {
      this.save();
    }
  }

  /**
   * Adding a new event
   * @param name The event name
   * @param date The datetime of the event as ISO string
   * @returns true if it has been added
   */
  public addEvent(name: string, date: string): boolean {
    try {
      assert.notStrictEqual(name, "");
      assert.notStrictEqual(name, null);
      assert.notStrictEqual(name, undefined);
      assert.notStrictEqual(date, "");
      assert.notStrictEqual(date, null);
      assert.notStrictEqual(date, undefined);
      assert.notStrictEqual(this.assertISODate(date), false);
      this.events.push(new TurbulentEvent(name, new Date(date)));
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Test if a string date is ISO
   * @param str The date as a string
   * @returns If the date is correct ISO format (ex: 2012-04-30T18:14:00.000Z)
   */
  public assertISODate(str: string): boolean {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    var d = new Date(str);
    return d.toISOString() === str;
  }

  /**
   * Get all event as array
   * @returns all events
   */
  public getAll(): Array<TurbulentEvent> {
    return this.events;
  }

  /**
   * Get all event as array
   */
  public clear(): void {
    this.events = [];
    this.save();
  }

  /**
   * Stop the watcher
   */
  public stop(): void {
    clearInterval(this.interval);
  }
}


export default EventsManager;
