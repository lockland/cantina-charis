package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
)

type TodoController struct{}

func (t *TodoController) GetTodos(c *fiber.Ctx) error {
	return c.JSON([]models.Todo{
		{
			ID:    1,
			Title: "Teste",
			Done:  false,
			Body:  "Boooddyyyy",
		},
		{
			ID:    2,
			Title: "Teste",
			Done:  false,
			Body:  "Boooddyyyy",
		},
	})
}

func NewTodoController() TodoController {
	return TodoController{}
}
