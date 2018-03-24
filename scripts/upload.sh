#!/bin/bash

cp dist/latest-linux-armv7l.yml dist/latest-linux-arm.yml
rsync -az --delete --progress dist/ root@pi3.local:/home/electron-update/pi-dashboard
