FROM node:5.7-slim
MAINTAINER Ali Khalili "hyperir@gmail.com"

RUN mkdir /nodeApp
WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

RUN apt-get update
RUN apt-get install -y git

RUN npm install bower -g
RUN npm install webpack -g

ADD bower.json /nodeApp/
RUN bower install --allow-root

ADD package.json /nodeApp/
# Installing ALL depencies is a bad idea because it increases the deployment image a lot! Can we fix that?
RUN npm install

ADD . /nodeApp

# ----------------- #
#   Configuration   #
# ----------------- #

EXPOSE 3000

# ----------- #
#   Cleanup   #
# ----------- #

RUN apt-get autoremove -y && apt-get -y clean && \
		rm -rf /var/lib/apt/lists/*

# -------- #
#   Run!   #
# -------- #

ENTRYPOINT ["npm", "run", "build"]
