FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN ./make_version.sh

RUN npm install
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
    LOGGING_LEVEL=debug

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

# default value for SMTP configuration in case it is left blank in the .env file
ENV SMTP_PORT=25

ENTRYPOINT ["./entrypoint.sh"]
