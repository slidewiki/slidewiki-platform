FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN ./make_version.sh

RUN npm prune --production
RUN npm run install

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["./entrypoint.sh"]
