#!/bin/bash

tar xvf deployment_keys.tar && rm -f deployment_keys.tar && sudo chmod 0444 *.pem && mv -f -t ~/.docker/ cert.pem key.pem ca.pem
export DOCKER_HOST="$DOCKERHOST" && export DOCKER_TLS_VERIFY=1

docker-compose pull
docker-compose stop
echo y | docker-compose rm
docker-compose up -d
docker rmi $(docker images | grep "<none>" | awk "{print \$3}")
