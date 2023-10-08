@echo off
start /b server.exe > cantina.log
ping -n 2 localhost 
start /b http://localhost:8080
