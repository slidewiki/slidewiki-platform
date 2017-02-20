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

ENV SLIDEWIKI_URL_DECK="https://deckservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_DISCUSSION="https://discussionservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_ACTIVITIES="https://activitiesservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_NOTIFICATION="https://notificationservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_USER="https://userservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_IMPORT="https://importservice.experimental.slidewiki.org" \
    SLIDEWIKI_VAR_IMPORT_HOST="importservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_SEARCH="https://searchservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_IMAGE="https://imageservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_FILE="https://fileservice.experimental.slidewiki.org" \
    SLIDEWIKI_URL_PDF="https://pdfservice.experimental.slidewiki.org"

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["./entrypoint.sh"]
