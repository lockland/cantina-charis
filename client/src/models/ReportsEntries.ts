import DecimalFormatter from "../helpers/Decimal";
import ReportEntry from "./ReportEntry";

export default class ReportEntries extends Array {
  private liquidFundsOnPeriod = 0.00

  push(item: ReportEntry): number {
    this.liquidFundsOnPeriod += parseFloat(item.liquid_funds)
    return super.push(item)
  }

  getliquidFunds() {
    return this.liquidFundsOnPeriod
  }

  getFormattedLiquidFounds() {
    return DecimalFormatter.format(this.liquidFundsOnPeriod)
  }

}