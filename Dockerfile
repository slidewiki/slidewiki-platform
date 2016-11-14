FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN npm install

# -------------------------------------- #
#   Default Microservice Configuration   #
# -------------------------------------- #

ENV SERVICE_URL_DECK="http://deckservice.manfredfris.ch" \
    SERVICE_URL_DISCUSSION="http://discussionservice.manfredfris.ch" \
    SERVICE_URL_ACTIVITIES="http://activitiesservice.manfredfris.ch" \
    SERVICE_URL_NOTIFICATION="http://notificationservice.manfredfris.ch" \
    SERVICE_URL_USER="http://userservice.manfredfris.ch" \
    SERVICE_URL_IMPORT="http://importservice.manfredfris.ch" \
    SERVICE_VAR_IMPORT_HOST="importservice.manfredfris.ch"

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["./entrypoint.sh"]
