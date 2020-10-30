FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/covid19-attestation /usr/share/nginx/html
