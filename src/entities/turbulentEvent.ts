
class TurbulentEvent {
  private _name: string;
  private _date: Date;

  constructor(name: string, date: Date) {
    this._name = name;
    this._date = date;
  }
  public isPast(): boolean {
    const now = new Date();
    return (this._date.getTime() - now.getTime()) < 0;
  }

  public asJSONObject(): object {
    return {
      name: this._name,
      date: this._date
    };
  }


  public static FromJSON(obj: object): TurbulentEvent {
    return new TurbulentEvent(obj["name"], new Date(obj["date"]));
  }
}


export default TurbulentEvent;
