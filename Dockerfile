###
# Phase de compilation de l'appli vuejs
FROM node:16.14.0 as build-image
WORKDIR /app/

# mise en cache docker pour le téléchargement
# des dépendances npm (répertoire node_modules/)
COPY ./package.json /app/
RUN npm install

# Compilation du TS en JS compilé
COPY . /app/
RUN npm run build




###
# Serveur web pour exec l'appli vuejs
FROM nginx:1.20.2 as front-image
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
