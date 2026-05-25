package repository

// cashRegisterOrdersScope: ativos do evento aberto + não entregues de outros eventos.
const cashRegisterOrdersScope = `deliveried = ? OR (event_id = ? AND CAST(paid_value AS REAL) < CAST(order_amount AS REAL))`

// CashRegisterEventID identifica o evento aberto no caixa (contexto da consulta).
type CashRegisterEventID int

func (id CashRegisterEventID) isValid() bool {
	return id > 0
}
