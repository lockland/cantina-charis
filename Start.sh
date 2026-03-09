#!/bin/bash

xdg-open http://localhost:8080

if ! pgrep cantina-charis; then
  ./cantina-charis > cantina.log
fi
