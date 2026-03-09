.ONESHELL: # Applies to every targets in the file!

build:
	rm dist/views -rf
	mkdir -p dist
	cp -a Start.sh dist/
	cd client && yarn build && cd -
	cd server && go build -o ../dist/cantina-charis main.go

run: server/main.go
	cd server
	nodemon --watch './**/*.go' --signal SIGTERM --exec 'go' run ./main.go

build-windows:
	rm dist/views -rf
	cp -a Start.cmd dist/
	cp -a backup.cmd dist/
	cd client && yarn build && cd -
	cd server && GOOS=windows GOARCH=amd64 CGO_ENABLED=1 CXX=x86_64-w64-mingw32-g++ CC=x86_64-w64-mingw32-gcc go build -o ../dist/cantina-charis.exe main.go
