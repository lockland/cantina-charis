package models

// MergeOrderProductLines collapses duplicate product_id rows by summing quantities
// and fills order_id and customer_id on each merged line.
func MergeOrderProductLines(orderID, customerID int, lines []OrderProduct) []OrderProduct {
	out := make([]OrderProduct, 0, len(lines))
	indexOf := func(id int) int {
		for i, p := range out {
			if p.ProductID == id {
				return i
			}
		}
		return -1
	}
	for _, el := range lines {
		j := indexOf(el.ProductID)
		if j > -1 {
			out[j].ProductQuantity += el.ProductQuantity
		} else {
			out = append(out, OrderProduct{
				OrderID:         orderID,
				CustomerID:      customerID,
				ProductID:       el.ProductID,
				ProductQuantity: el.ProductQuantity,
			})
		}
	}
	return out
}
