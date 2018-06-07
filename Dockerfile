FROM slidewiki/runtime:nodejs-8-slim
MAINTAINER Ali Khalili "hyperir@gmail.com"

ARG BUILD_ENV=local
ENV BUILD_ENV ${BUILD_ENV}

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN ./make_version.sh

RUN if [ "$BUILD_ENV" = "travis" ] ; then npm prune --production ; else rm -R node_modules ; npm install --production ; fi
RUN npm run install

# ----------------------------------------------------------------- #
#   The following variables need be set when starting a container   #
# ----------------------------------------------------------------- #

ENV SERVICE_URL_DECK= \
    SERVICE_URL_DISCUSSION= \
    SERVICE_URL_ACTIVITIES= \
    SERVICE_URL_NOTIFICATION= \
    SERVICE_URL_USER= \
    SERVICE_URL_IMPORT= \
    SERVICE_VAR_IMPORT_HOST= \
    SERVICE_URL_SEARCH= \
    SERVICE_URL_FILE= \
    SERVICE_URL_PDF= \
    SERVICE_URL_TAG= \
    SERVICE_URL_TRANSLATION= \
    SERVICE_URL_SIGNALING= \
    SERVICE_URL_QUESTION= \
    SERVICE_URL_NLP= \
    SERVICE_USER_PRIVATE_RECAPTCHA_KEY= \
    SERVICE_USER_PUBLIC_RECAPTCHA_KEY= \
    SERVICE_USER_APIKEY= \
    SMTP_CLIENTNAME= \
    SMTP_FROM= \
    SMTP_TO=

# ----------------------------------- #
#      Safe defaults for building     #
# ----------------------------------- #

ENV SMTP_HOST=localhost \
    SMTP_PORT=25 \
    LOGGING_LEVEL=debug \
    SSO_ENABLED=false

# ----------------------------------- #
#         Default Webpack Build       #
# ----------------------------------- #

RUN cat /nodeApp/microservices.js.template | envsubst > /nodeApp/configs/microservices.js
RUN cat /nodeApp/general.js.template | envsubst > /nodeApp/configs/general.js
RUN cat /nodeApp/secrets.js.template | envsubst > /nodeApp/configs/secrets.js

RUN npm run build:nostart

# -------- #
#   Run!   #
# -------- #

# default value for some configuration variables in case they is left blank in the .env file
ENV SMTP_PORT=25
ENV SSO_ENABLED=false

ENTRYPOINT ["./entrypoint.sh"]
