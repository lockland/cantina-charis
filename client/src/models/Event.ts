export interface EventType {
  event_id?: number
  event_name: string
  open_amount: any
  is_open?: boolean
  created_at?: Date
}

class Event implements EventType {

  constructor(
    public event_id: number = 0,
    public event_name: string = "",
    public open_amount: any = "",
    public is_open: boolean = false,
    public created_at?: Date
  ) {
    this.event_id = event_id
    this.event_name = event_name
    this.open_amount = parseFloat(open_amount)
    this.is_open = is_open
    this.created_at = new Date(created_at || "")
  }

  static buildFromData({ event_id, event_name, open_amount, is_open, created_at }: EventType): Event {
    return new Event(event_id, event_name, open_amount, is_open, created_at)
  }

}

export default Event