###
# Phase de compilation de l'appli vuejs
FROM node:16.14.0 as build-image
WORKDIR /build/
# Mise en cache docker pour le téléchargement
# des dépendances npm (répertoire node_modules/)
COPY ./package.json /build/
COPY ./node_modules/ /build/node_modules/
RUN npm install
# Compilation du TS en JS compilé
# en injectaant des placeholders dans les variables .env
# (cf le fichier docker/vuejs_env_placeholder) pour pouvoir créer des conteneurs
# en dev, test, prod ou en local en passant les valeurs de ce .env
# via des variables d'environement Docker
# Par exemple, cela permet d'injecter l'URL où se trouvent les API différente
# si on est en dev, test ou prod ou local.
COPY ./docker/vuejs_env_placeholder /build/.env
COPY ./.browserslistrc /build/
COPY ./.eslintrc.js /build/
COPY ./*.js /build/
COPY ./*.json /build/
COPY ./src/ /build/src/
COPY ./public/ /build/public/
RUN npm run build




###
# Serveur web (nginx) pour exec l'appli vuejs
FROM nginx:1.20.2 as front-image
COPY --from=build-image /build/dist/ /usr/share/nginx/html/
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
