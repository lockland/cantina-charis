package middleware

import (
	"encoding/base64"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParseBasicAuth(t *testing.T) {
	t.Run("given valid basic header when parse then user and password", func(t *testing.T) {
		raw := base64.StdEncoding.EncodeToString([]byte("admin:secret"))
		u, p, ok := parseBasicAuth("Basic " + raw)
		require.True(t, ok)
		assert.Equal(t, "admin", u)
		assert.Equal(t, "secret", p)
	})

	t.Run("given missing basic prefix when parse then not ok", func(t *testing.T) {
		_, _, ok := parseBasicAuth("Bearer xxx")
		assert.False(t, ok)
	})

	t.Run("given invalid base64 when parse then not ok", func(t *testing.T) {
		_, _, ok := parseBasicAuth("Basic !!!")
		assert.False(t, ok)
	})

	t.Run("given credentials without colon when parse then not ok", func(t *testing.T) {
		raw := base64.StdEncoding.EncodeToString([]byte("nocolon"))
		_, _, ok := parseBasicAuth("Basic " + raw)
		assert.False(t, ok)
	})
}

func TestSessionCookie(t *testing.T) {
	t.Run("given admin session when validate then round trip role and user", func(t *testing.T) {
		cookie := makeSessionCookie("admin", "alice")
		role, username, ok := validateSessionCookie(cookie)
		require.True(t, ok)
		assert.Equal(t, "admin", role)
		assert.Equal(t, "alice", username)
	})

	t.Run("given viewer session when validate then role viewer", func(t *testing.T) {
		cookie := makeSessionCookie("viewer", "bob")
		role, username, ok := validateSessionCookie(cookie)
		require.True(t, ok)
		assert.Equal(t, "viewer", role)
		assert.Equal(t, "bob", username)
	})

	t.Run("given tampered cookie when validate then rejected", func(t *testing.T) {
		cookie := makeSessionCookie("admin", "x")
		if len(cookie) < 2 {
			t.Fatal("cookie too short")
		}
		tampered := cookie[:len(cookie)-1] + "X"
		_, _, ok := validateSessionCookie(tampered)
		assert.False(t, ok)
	})
}
