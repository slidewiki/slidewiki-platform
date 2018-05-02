#!/bin/bash

# ----------------------------------- #
#      Safe defaults for building     #
# ----------------------------------- #

export	SMTP_HOST=localhost \
		SMTP_PORT=25 \
		LOGGING_LEVEL=debug \
		SSO_ENABLED=false

# ----------------------------------- #
#         Default Webpack Build       #
# ----------------------------------- #

cat microservices.js.template | envsubst > configs/microservices.js
cat general.js.template | envsubst > configs/general.js
cat secrets.js.template | envsubst > configs/secrets.js
