package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

const (
	sessionCookieName = "session"
	sessionDuration   = 24 * time.Hour
)

var (
	adminPassword  string
	viewerPassword string
	sessionSecret  string
)

func init() {
	adminPassword = os.Getenv("ADMIN_PASSWORD")
	viewerPassword = os.Getenv("VIEWER_PASSWORD")
	sessionSecret = os.Getenv("SESSION_SECRET")
	if sessionSecret == "" {
		sessionSecret = "dev-secret-change-in-production"
	}
}

func validateBasicAuth(username, password string) bool {
	switch username {
	case "admin":
		return password == adminPassword
	case "viewer":
		return password == viewerPassword
	default:
		return false
	}
}

func parseBasicAuth(auth string) (username, password string, ok bool) {
	const prefix = "Basic "
	if !strings.HasPrefix(auth, prefix) || len(auth) <= len(prefix) {
		return "", "", false
	}
	decoded, err := base64.StdEncoding.DecodeString(auth[len(prefix):])
	if err != nil {
		return "", "", false
	}
	parts := strings.SplitN(string(decoded), ":", 2)
	if len(parts) != 2 {
		return "", "", false
	}
	return parts[0], parts[1], true
}

func signSession(value string) string {
	mac := hmac.New(sha256.New, []byte(sessionSecret))
	mac.Write([]byte(value))
	return base64.URLEncoding.EncodeToString(mac.Sum(nil))
}

func makeSessionCookie(role, username string) string {
	exp := time.Now().Add(sessionDuration).Unix()
	payload := role + "|" + username + "|" + strconv.FormatInt(exp, 10)
	return base64.URLEncoding.EncodeToString([]byte(payload)) + "." + signSession(payload)
}

func validateSessionCookie(cookie string) (role, username string, ok bool) {
	idx := strings.LastIndex(cookie, ".")
	if idx <= 0 {
		return "", "", false
	}
	payloadB64 := cookie[:idx]
	sigB64 := cookie[idx+1:]
	payloadBytes, err := base64.URLEncoding.DecodeString(payloadB64)
	if err != nil {
		return "", "", false
	}
	payload := string(payloadBytes)
	if signSession(payload) != sigB64 {
		return "", "", false
	}
	parts := strings.SplitN(payload, "|", 3)
	if len(parts) != 3 {
		return "", "", false
	}
	role, username = parts[0], parts[1]
	exp, err := strconv.ParseInt(parts[2], 10, 64)
	if err != nil || time.Now().Unix() > exp {
		return "", "", false
	}
	if role != "admin" && role != "viewer" {
		return "", "", false
	}
	return role, username, true
}

func Auth() fiber.Handler {
	return func(c fiber.Ctx) error {
		role, username := "", ""

		if cookie := c.Cookies(sessionCookieName); cookie != "" {
			if r, u, ok := validateSessionCookie(cookie); ok {
				role, username = r, u
			}
		}

		if role == "" {
			auth := c.Get("Authorization")
			if user, pass, ok := parseBasicAuth(auth); ok && validateBasicAuth(user, pass) {
				role, username = user, user
				cookie := makeSessionCookie(role, username)
				c.Cookie(&fiber.Cookie{
					Name:     sessionCookieName,
					Value:    cookie,
					Path:     "/",
					MaxAge:   int(sessionDuration.Seconds()),
					HTTPOnly: true,
					SameSite: "Strict",
					Secure:   c.Protocol() == "https",
				})
			}
		}

		if role == "" {
			c.Set("WWW-Authenticate", `Basic realm="Cantina Charis"`)
			return c.Status(http.StatusUnauthorized).SendString("Unauthorized")
		}

		c.Locals("role", role)
		c.Locals("username", username)
		return c.Next()
	}
}
