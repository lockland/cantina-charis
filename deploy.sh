#!/bin/bash

git pull
make build
rm $HOME/cantina-charis/{cantina-charis,views} -rf
cp -a dist/* $HOME/cantina-charis/
systemctl --user restart cantina-charis
journalctl --user -u cantina-charis.service -n 50 --no-pager -f
