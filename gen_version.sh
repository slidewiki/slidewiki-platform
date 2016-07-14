#!/bin/bash
echo "" > configs/version.js
echo "export default {" >> configs/version.js
git rev-parse --abbrev-ref HEAD 2> /dev/null | sed "s/\(.*\)/branch: '\1',/" >> configs/version.js
git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/head: '\1'/" >> configs/version.js
echo "};" >> configs/version.js
