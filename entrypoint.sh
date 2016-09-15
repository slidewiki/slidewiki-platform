#!/bin/bash

echo "--- configuring microservices

Deck Service        : ${SERVICE_URL_DECK}
Discussion Service  : ${SERVICE_URL_DISCUSSION}
Activities Service  : ${SERVICE_URL_ACTIVITIES}
Notification Servie : ${SERVICE_URL_NOTIFICATION}
User Service        : ${SERVICE_URL_USER}
PPTX Import Service : ${SERVICE_URL_IMPORT}

"
cat /nodeApp/travis_scripts/microservices.js.template | envsubst > /nodeApp/configs/microservices.js
npm run build
