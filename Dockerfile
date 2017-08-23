FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN ./make_version.sh

# why is this not "npm install --production"? I'd like to exchange it with "npm prune --production"
RUN npm prune --production
RUN npm run install

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["./entrypoint.sh"]
