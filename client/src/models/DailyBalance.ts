import DecimalFormatter from "../helpers/Decimal"

class DailyBalanceEntry {

  constructor(
    public date: Date,
    public incoming: any,
    public outgoing: any
  ) {
    this.date = new Date(date + "T00:00:00")
    this.incoming = parseFloat(incoming)
    this.outgoing = parseFloat(outgoing)
  }

  static buildFromData({ date, incoming, outgoing }: DailyBalanceEntry): DailyBalanceEntry {
    return new DailyBalanceEntry(date, incoming, outgoing)
  }

  getFormattedIncoming(): string {
    return DecimalFormatter.format(this.incoming)
  }

  getFormattedOutgoing(): string {
    return DecimalFormatter.format(this.outgoing)
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR')
  }
}

export default DailyBalanceEntry