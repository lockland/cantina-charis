package middleware

import (
	"encoding/base64"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParseBasicAuth_valid(t *testing.T) {
	raw := base64.StdEncoding.EncodeToString([]byte("admin:secret"))
	u, p, ok := parseBasicAuth("Basic " + raw)
	require.True(t, ok)
	assert.Equal(t, "admin", u)
	assert.Equal(t, "secret", p)
}

func TestParseBasicAuth_missingPrefix(t *testing.T) {
	_, _, ok := parseBasicAuth("Bearer xxx")
	assert.False(t, ok)
}

func TestParseBasicAuth_invalidBase64(t *testing.T) {
	_, _, ok := parseBasicAuth("Basic !!!")
	assert.False(t, ok)
}

func TestParseBasicAuth_noColon(t *testing.T) {
	raw := base64.StdEncoding.EncodeToString([]byte("nocolon"))
	_, _, ok := parseBasicAuth("Basic " + raw)
	assert.False(t, ok)
}

func TestSessionCookie_roundTrip(t *testing.T) {
	cookie := makeSessionCookie("admin", "alice")
	role, username, ok := validateSessionCookie(cookie)
	require.True(t, ok)
	assert.Equal(t, "admin", role)
	assert.Equal(t, "alice", username)
}

func TestSessionCookie_viewerRole(t *testing.T) {
	cookie := makeSessionCookie("viewer", "bob")
	role, username, ok := validateSessionCookie(cookie)
	require.True(t, ok)
	assert.Equal(t, "viewer", role)
	assert.Equal(t, "bob", username)
}

func TestSessionCookie_tamperedSignatureRejected(t *testing.T) {
	cookie := makeSessionCookie("admin", "x")
	if len(cookie) < 2 {
		t.Fatal("cookie too short")
	}
	tampered := cookie[:len(cookie)-1] + "X"
	_, _, ok := validateSessionCookie(tampered)
	assert.False(t, ok)
}
