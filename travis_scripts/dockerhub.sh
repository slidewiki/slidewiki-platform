#!/bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t slidewiki/platform:latest-dev ./
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
docker push slidewiki/platform:latest-dev
