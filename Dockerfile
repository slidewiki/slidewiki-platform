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

# ----------------------------------- #
#   Default Container Configuration   #
# ----------------------------------- #

ENV SERVICE_URL_DECK="https://deckservice.experimental.slidewiki.org" \
    SERVICE_URL_DISCUSSION="https://discussionservice.experimental.slidewiki.org" \
    SERVICE_URL_ACTIVITIES="https://activitiesservice.experimental.slidewiki.org" \
    SERVICE_URL_NOTIFICATION="https://notificationservice.experimental.slidewiki.org" \
    SERVICE_URL_USER="https://userservice.experimental.slidewiki.org" \
    SERVICE_URL_IMPORT="https://importservice.experimental.slidewiki.org" \
    SERVICE_VAR_IMPORT_HOST="importservice.experimental.slidewiki.org" \
    SERVICE_URL_SEARCH="https://searchservice.experimental.slidewiki.org" \
    SERVICE_URL_FILE="https://fileservice.experimental.slidewiki.org" \
    SERVICE_URL_PDF="https://pdfservice.experimental.slidewiki.org" \
    SERVICE_URL_TAG="https://pdfservice.experimental.slidewiki.org" \
    SERVICE_USER_PRIVATE_RECAPTCHA_KEY="6LdNLyYTAAAAAFMC0J_zuVI1b9lXWZjPH6WLe-vJ" \
    SERVICE_USER_PUBLIC_RECAPTCHA_KEY="6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET" \
    LOGGING_LEVEL="debug" \
    SERVICE_USER_APIKEY="2cbc621f86e97189239ee8c4c80b10b3a935b8a9f5db3def7b6a3ae7c4b75cb5" \
    SMTP_HOST="localhost" \
    SMTP_PORT="25" \
    # SMTP_CLIENTNAME= \
    SMTP_FROM="no-reply@slidewiki.org" \
    SMTP_TO="jira@slidewiki.atlassian.net"

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
