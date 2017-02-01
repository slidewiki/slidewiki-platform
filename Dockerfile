FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN npm install
RUN npm run install

# ----------------------------------- #
#   Default Container Configuration   #
# ----------------------------------- #

ENV SLIDEWIKI_URL_DECK="http://deckservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_DISCUSSION="http://discussionservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_ACTIVITIES="http://activitiesservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_NOTIFICATION="http://notificationservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_USER="http://userservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_IMPORT="http://importservice.experimental.slidewiki.org" \
    SLIDEWIKI_VAR_IMPORT_HOST="importservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_SEARCH="http://searchservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_IMAGE="http://imageservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_FILE="http://fileservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_PDF="http://pdfservice.experimental.slidewiki.org"

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["./entrypoint.sh"]
