package repository

// cashRegisterOrdersScope: ativos do evento aberto + não entregues de outros eventos.
const cashRegisterOrdersScope = `(event_id = ? AND (deliveried = ? OR CAST(paid_value AS REAL) < CAST(order_amount AS REAL)))
	OR (event_id != ? AND deliveried = ?)`

// CashRegisterEventID identifica o evento aberto no caixa (contexto da consulta).
type CashRegisterEventID int

func (id CashRegisterEventID) isValid() bool {
	return id > 0
}
