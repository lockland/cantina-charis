.ONESHELL: # Applies to every targets in the file!

# cgo (SQLite) link needs a lot of free space on the filesystem that holds $TMPDIR (often /tmp) and the output binary.
# If `go run` / `go build` fails with "collect2: error: ld returned 1", check `df -h` — free space on /
# (e.g. `go clean -cache`, remove old images, journal vacuum). This Makefile forces TMPDIR/GOTMPDIR to .gotmp/
# so a full /tmp alone is not the only failure mode.
GOTMPDIR := $(abspath .gotmp)
GO_LDFLAGS := -ldflags="-s -w"
GO_ENV_TMP := TMPDIR="$(GOTMPDIR)" GOTMPDIR="$(GOTMPDIR)"

test tests:
	mkdir -p "$(GOTMPDIR)"
	$(GO_ENV_TMP) go test $(GO_LDFLAGS) ./...

build:
	rm dist/views dist/cantina-charis -rf
	mkdir -p dist "$(GOTMPDIR)"
	cd client && yarn build && cd -
	cd server && $(GO_ENV_TMP) go build $(GO_LDFLAGS) -o ../dist/cantina-charis main.go

run: server/main.go
	mkdir -p "$(GOTMPDIR)"
	cd server
	$(GO_ENV_TMP) nodemon -e go --watch './**/*.go' --signal SIGTERM --exec 'go run ./main.go'

# Frees the Go build cache (often 1GB+). Use when / is nearly full and linking fails.
clean-go-cache:
	go clean -cache

build-windows:
	mkdir -p "$(GOTMPDIR)"
	rm dist/views -rf
	cp -a Start.cmd dist/
	cp -a backup.cmd dist/
	cd client && yarn build && cd -
	cd server && $(GO_ENV_TMP) GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CXX=x86_64-w64-mingw32-g++ CC=x86_64-w64-mingw32-gcc go build $(GO_LDFLAGS) -o ../dist/cantina-charis.exe main.go
