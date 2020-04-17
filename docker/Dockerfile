FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build --prod

FROM ubuntu:18.04
USER root
WORKDIR /var/www/covid-testing
COPY --from=build /usr/src/app/dist/covid19-attestation .
COPY ./docker/config ./docker/config

# INSTALL UTILS
RUN apt-get update
RUN apt-get install -y vim

# SSL CERTIFICATES PACKAGE
RUN apt-get -y install software-properties-common
RUN add-apt-repository universe
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update
RUN apt-get install -y \
    certbot \
    python-certbot-nginx

ENV nginx_vhost /etc/nginx/sites-available/default
ENV nginx_conf /etc/nginx/nginx.conf

ADD docker/config/default ${nginx_vhost}
ADD docker/config/nginx.conf ${nginx_conf}

EXPOSE 80 443

ENTRYPOINT ["/bin/bash", "docker/config/entrypoint.sh"]
