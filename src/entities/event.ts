
class Event {
  private _name: String;
  private _date: Date;

  constructor(name: String, date: Date) {
    this._name = name;
    this._date = date;
  }

  asMongoObject(): Object {
    return {
      name: this._name,
      date: this._date
    };
  }
}


export default Event;
