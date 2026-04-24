package service

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

// OutgoingService creates outgoings only when the event is open.
type OutgoingService struct {
	out  *repository.OutgoingRepository
	evts *repository.EventRepository
}

// NewOutgoingService wires outgoing persistence and event checks.
func NewOutgoingService(out *repository.OutgoingRepository, evts *repository.EventRepository) *OutgoingService {
	return &OutgoingService{out: out, evts: evts}
}

// CreateOutgoing persists an outgoing if the event exists and is open.
func (s *OutgoingService) CreateOutgoing(o *models.Outgoing) error {
	isOpen, err := s.evts.IsOpen(o.EventID)
	if err != nil {
		return err
	}
	if !isOpen {
		return ErrEventClosed
	}
	return s.out.Create(o)
}

// FindAll loads all outgoings.
func (s *OutgoingService) FindAll(outgoings *[]models.Outgoing) error {
	return s.out.FindAll(outgoings)
}
