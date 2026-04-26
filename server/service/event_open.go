package service

import "github.com/lockland/cantina-charis/server/repository"

// ensureEventOpenForCreate returns nil if the event exists and is open; otherwise
// the error from the repository lookup or ErrEventClosed.
func ensureEventOpenForCreate(events *repository.EventRepository, eventID int) error {
	isOpen, err := events.IsOpen(eventID)
	if err != nil {
		return err
	}
	if !isOpen {
		return ErrEventClosed
	}
	return nil
}
