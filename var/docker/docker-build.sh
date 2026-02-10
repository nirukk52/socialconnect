#!/bin/bash

set -o xtrace

docker rmi localhost/socialconnect || true
docker build --target dist -t localhost/socialconnect -f Dockerfile.dev .
docker build --target devcontainer -t localhost/socialconnect-devcontainer -f Dockerfile.dev .
