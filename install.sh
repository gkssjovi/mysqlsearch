#!/bin/bash

yarn
chmod +x ./dist/main.js
ln -s $PWD/dist/main.js /usr/local/bin/mysqlsearch

cp config.yaml personal.config.yaml
mkdir ~/.config/mysqlsearch
ln -s $PWD/personal.config.yaml ~/.config/mysqlsearch/config.yaml
