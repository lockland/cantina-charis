export default class DecimalFormatter {
  static format(value: any): string {
    return parseFloat(value).toLocaleString('pt-BR', {
      style: "currency",
      currency: 'BRL'
    })
  }
}
