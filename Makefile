.ONESHELL: # Applies to every targets in the file!

run: server/main.go
	cd server
	nodemon --watch './**/*.go' --signal SIGTERM --exec 'go' run ./main.go

build:
	cd client && yarn build && cd -
	cd server && go build



