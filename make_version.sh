#!/bin/bash

GIT_BRANCH=$(git symbolic-ref --short HEAD)
GIT_COMMIT=$(git rev-parse --short HEAD)
GIT_VERSION=$(git describe --tags --abbrev=0)

sed -ie "s/GIT_BRANCH/$GIT_BRANCH/g" /nodeApp/components/Footer/Footer.js
sed -ie "s/GIT_COMMIT/$GIT_COMMIT/g" /nodeApp/components/Footer/Footer.js
sed -ie "s/GIT_VERSION/$GIT_VERSION/g" /nodeApp/components/Footer/Footer.js