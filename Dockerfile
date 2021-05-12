FROM node:lts-alpine as build
WORKDIR /applis
COPY package*.json ./

COPY . ./
ARG VUE_APP_ROOT_API
ARG VUE_APP_RECAPTCHA_KEY_SITE
ENV VUE_APP_ROOT_API=${VUE_APP_ROOT_API}
ENV VUE_APP_RECAPTCHA_KEY_SITE=${VUE_APP_RECAPTCHA_KEY_SITE}
RUN npm install
RUN npm run build

FROM nginx:stable-alpine as front-server
COPY --from=build /applis/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
