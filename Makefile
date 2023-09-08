.ONESHELL: # Applies to every targets in the file!

build:
	cd client && yarn build && cd -
	cd server && go build

run: server/main.go
	cd server
	nodemon --watch './**/*.go' --signal SIGTERM --exec 'go' run ./main.go

build-windows:
	cd server
	GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CXX=x86_64-w64-mingw32-g++ CC=x86_64-w64-mingw32-gcc go build -o server.exe main.go
