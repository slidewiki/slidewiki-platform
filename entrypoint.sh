#!/bin/bash

echo "configuring microservices"
env | grep "SERVICE_URL_.*"

cp /nodeApp/configs/microservices.sample.js /nodeApp/configs/microservices.js
npm run build
#cat /nodeApp/travis_scripts/microservices.js.template | envsubst > /nodeApp/configs/microservices.js
#npm run build
