package middleware

import (
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Authorize() fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, _ := c.Locals("role").(string)
		if role != "viewer" {
			return c.Next()
		}

		method := c.Method()
		path := c.Path()

		allowed := false
		if method == "GET" {
			switch {
			case path == "/api/auth/me":
				allowed = true
			case path == "/api/events" || strings.HasPrefix(path, "/api/events/"):
				allowed = true
			case path == "/" || path == "/orders":
				allowed = true
			case strings.HasPrefix(path, "/assets/"):
				allowed = true
			case strings.Contains(path, "."):
				// arquivos estáticos (ex.: /vite.svg, /favicon.ico)
				allowed = true
			}
		}

		if !allowed {
			return c.Status(http.StatusForbidden).SendString("Forbidden")
		}
		return c.Next()
	}
}
