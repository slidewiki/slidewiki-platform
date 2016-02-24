FROM node:5.7-slim
MAINTAINER Ali Khalili "hyperir@gmail.com"

# Update aptitude with new repo
RUN apt-get update
# Install software
RUN apt-get install -y git

RUN mkdir /slidewiki-platform
WORKDIR /slidewiki-platform

RUN npm install bower -g
RUN npm install webpack -g

ADD bower.json /slidewiki-platform/
RUN bower install --allow-root

ADD package.json /slidewiki-platform/
RUN npm install

ADD . /slidewiki-platform


#specify the port used by slidewiki-platform
EXPOSE 3000

ENTRYPOINT ["npm", "run", "build"]
