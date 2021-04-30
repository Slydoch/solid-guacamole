
import fs from 'fs';
import { isFunction } from 'lodash';
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

  constructor(callback) {
    this.callback = callback;
    this.init();
  }

  /**
   * Used to init the database or the flat file storage in this case
   * I choose to use flat file storage because this is not in the scope, and actually easier to run & setup
   * This may be better to use any database storage for a live application
   * Also clean old event
   */
  init(): void {
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
   * Foreach event, if it's past, send a message to all connected clients
   * and remove it from the array
   * This is call with an interval initialized on EventsManager.init()
   * @see EventsManager.init()
   */
  private sendPastEvents = (): void => {
    this.events = this.events.filter((e: TurbulentEvent): boolean => {
      const isPast: boolean = e.isPast();
      if (isPast) {
        // Event is sent here
        this.callback(e);
      }
      return !isPast;
    });
    this.save();
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
   * Adding a new event
   */
  addEvent(event: TurbulentEvent) {
    this.events.push(event);
    this.save();
  }

  /**
   * Get all event as array
   */
  getAll(): Array<TurbulentEvent> {
    return this.events;
  }
}


export default EventsManager;
