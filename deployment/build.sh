#!/bin/bash

docker build -t slidewiki/platform ./
docker rmi $(docker images | grep "<none>" | awk "{print \$3}")
docker push slidewiki/platform
