#!/usr/bin/env bash

docker kill socialconnect || true 
docker rm socialconnect || true 
docker create --name socialconnect -p 3000:3000 -p 4200:4200 localhost/socialconnect
