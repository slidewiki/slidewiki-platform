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

# -------- #
#   Run!   #
# -------- #

# default value for SMTP configuration in case it is left blank in the .env file
ENV SMTP_PORT=25

ENTRYPOINT ["./entrypoint.sh"]
