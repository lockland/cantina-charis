package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
)

type TodoController struct{}

func NewTodoController() TodoController {
	return TodoController{}
}

func (c *TodoController) GetTodos(f *fiber.Ctx) error {
	return f.JSON([]models.Todo{
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
