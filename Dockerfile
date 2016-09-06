FROM slidewiki/runtime:latest
MAINTAINER Ali Khalili "hyperir@gmail.com"

WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD . /nodeApp
RUN bower install --allow-root
# Install only production dependencies? todo: handle webpack issue
RUN npm install

# ----------------- #
#   Configuration   #
# ----------------- #

RUN if [ ! -e /nodeApp/configs/microservices.js ]; then cp /nodeApp/configs/microservices.sample.js /nodeApp/configs/microservices.js; fi

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["npm", "run", "build"]
