
class TurbulentEvent {
  private _name: string;
  private _date: Date;

  constructor(name: string, date: Date) {
    this._name = name;
    this._date = date;
  }

  /**
   * Is the event is past of future ?
   * @returns true for past event
   */
  public isPast(): boolean {
    return (this._date.getTime() - (new Date()).getTime()) < 0;
  }
  /**
   * Convert to flat object json compatible
   * @returns the JSON object
   */
  public asJSONObject(): object {
    return {
      name: this._name,
      date: this._date
    };
  }

  /**
   * Convert flat object to a class instance
   * @param obj The event as flat object
   * @returns The event as class instance
   */
  public static FromJSON(obj: object): TurbulentEvent {
    return new TurbulentEvent(obj["name"], new Date(obj["date"]));
  }
}


export default TurbulentEvent;
