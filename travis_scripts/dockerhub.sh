#!/bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build --build-arg BUILD_ENV=travis -t slidewiki/platform:latest-dev ./
rc=$?
if [[ $rc != 0 ]]; then
  exit $rc
else
  docker push slidewiki/platform:latest-dev
fi
