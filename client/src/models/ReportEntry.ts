import DecimalFormatter from "../helpers/Decimal"

interface ReportEntryType {
  event_id: number,
  event_name: string,
  open_amount: any,
  incoming: any,
  outgoing: any,
  debits: any,
  balance: any,
  liquid_funds: any
  created_at?: Date,
}

export default class ReportEntry {
  constructor(
    public event_id: number,
    public event_name: string,
    public open_amount: any,
    public incoming: any,
    public outgoing: any,
    public debits: any,
    public balance: any,
    public liquid_funds: any,
    public created_at?: Date

  ) {
    this.event_id = event_id
    this.event_name = event_name
    this.open_amount = parseFloat(open_amount)
    this.created_at = new Date(created_at || "")
    this.incoming = parseFloat(incoming)
    this.outgoing = parseFloat(outgoing)
    this.debits = parseFloat(debits)
    this.balance = parseFloat(balance)
    this.liquid_funds = parseFloat(liquid_funds)
  }

  static buildFromData({
    event_id,
    event_name,
    open_amount,
    created_at,
    incoming,
    outgoing,
    debits,
    balance,
    liquid_funds
  }: ReportEntryType): ReportEntry {
    return new ReportEntry(
      event_id,
      event_name,
      open_amount,
      incoming,
      outgoing,
      debits,
      balance,
      liquid_funds,
      created_at
    )
  }

  getFormattedOpenAmount(): string {
    return DecimalFormatter.format(this.open_amount)
  }

  getFormattedIncoming(): string {
    return DecimalFormatter.format(this.incoming)
  }

  getFormattedOutgoing(): string {
    return DecimalFormatter.format(this.outgoing)
  }

  getFormattedDebits(): string {
    return DecimalFormatter.format(this.debits)
  }

  getFormattedBalance(): string {
    return DecimalFormatter.format(this.balance)
  }

  getFormattedLiquidFunds(): string {
    return DecimalFormatter.format(this.liquid_funds)
  }

  getFormattedCreatedAt(): string | undefined {
    return this.created_at?.toLocaleDateString('pt-BR')
  }
}