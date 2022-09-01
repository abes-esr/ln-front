# licencesnationales-front

[![ci](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/licencesnationales.svg)](https://hub.docker.com/r/abesesr/licencesnationales/)

Application web de gestion des droits des Licences Nationales. Ce dépôt concerne le code source de son interface graphique (client léger en JavaScript/VueJS) qui repose sur l'[API REST Licences Nationales](https://github.com/abes-esr/licencesnationales-back). 

URL de producation de l'application : https://acces.licencesnationales.fr

Cette application permet :
- aux institutions bénéficiaires des ressources numériques de :
  - déclarer les contacts pour l’administration technique des ressources,
  - déclarer les adresses IP.
- à l’Abes :
  - renseigner les contacts auprès des éditeurs de ces ressources
  - vérifier les informations saisies par les bénéficiaires, supprimer ou accepter les comptes, valider ou non les adresses IP
  - envoyer les informations de gestion renseignées par les institutions aux éditeurs présents dans la base, via un batch mensuel, non automatisé. Ce batch comprend un identifiant Abes ad hoc, utilisé souvent comme identifiant pivot sur lequel les éditeurs et l’Inist (pour les plates-formes ISTEX et PANIST) s’appuient pour gérer les droits d’accès.

Copie d'écran de la page d'accueil de l'application Licences Nationales :  
![image](https://user-images.githubusercontent.com/328244/159643443-e8d8df64-ada6-44a5-a1f1-8f7f8a76530d.png)

Voir aussi le code source de l'API et du batch:  
https://github.com/abes-esr/licencesnationales-back

## Architecture

Cette application a été developpée avec le framework JavaScript VueJS version 2 (avec VueX et vue-router), la librairie de composants UI Material Design Vuetify. Elle utilise la surcouche Javascript TypeScript.

Elle fonctionne sur les versions récentes des navigateurs Chrome (et dérivés), Firefox, Edge et Safari. La compatibilité avec Internet Explorer n'a pas été testée par nos équipes, et n'est donc pas garantie.

L'ensemble des librairies tierces utilisées par ce projet est accessible dans le fichier package.json, situé à la racine du dépot.

## Installation

### Copier le répertoire
```sh
git clone https://github.com/abes-esr/licencesnationales-front
```

### Installer les dépendances

```
npm install
```


## Utilisation

### Compilation et hot-reloads pour le développement
```
npm run serve
```

### Compilation et packaging pour le déploiement
```
npm run build
```

### Lints
```
npm run lint
```

### Configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Utilisation avec docker

### Génération des images docker

L'image docker de licencesnationales-front est générée automatiquement à chaque ``git push`` par la chaîne d'intégration continue [![ci](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml). Les images suivantes sont [disponibles sur dockerhub](https://hub.docker.com/r/abesesr/licencesnationales/tags) :
- ``abesesr/licencesnationales:main-front`` : l'image du dernier git push sur la branche ``main``
- ``abesesr/licencesnationales:develop-front`` : l'image du dernier git push sur la branche ``develop``
- ``abesesr/licencesnationales:X.X.X-front`` : l'image dont le n° de version est ``X.X.X``
- ``abesesr/licencesnationales:latest-front`` : l'image de la dernière version publiée

Il est aussi possible de générer cette image localement en tapant la commande suivante :
```bash
cd licencesnationales-front/
docker build . -t abesesr/licencesnationales:latest-front

```

### Démarrage du conteneur docker

Pour un déploiement dans le SI de l'Abes, il faut se référer aux configurations suivantes :
https://git.abes.fr/depots/licencesnationales-docker/

Pour le déployer en local sur sa machine, une fois la génération de l'images terminée (cf section au dessus), voici les commandes que l'on peut utiliser (TODO, cette partie pourrait être améliorée en proposant un ``docker-compose.yml``):
```bash
# on suppose ci-dessous que l'URL de licencesnationales-back est sur http://127.0.0.1:8080/v1/
docker run -d \
  --name licencesnationales-front \
  -p 8081:80 \
  -e LN_VUE_APP_ROOT_API="http://127.0.0.1:8080/v1/" \
  -e LN_VUE_APP_RECAPTCHA_KEY_SITE="6LcjHroaAAAAAOhO6sd_1ooz5LfcyRPoYirqxsFt" \
  abesesr/licencesnationales:latest-front
```

Pour consulter les logs :
```bash
docker logs -n 100 -f licencesnationales-front
```


## Publier une nouvelle release de l'application

Se référer à la procédure commune à toutes les applications opensource de l'Abes ici :  
https://github.com/abes-esr/abes-politique-developpement/blob/main/01-Gestion%20du%20code%20source.md#publier-une-nouvelle-release-dune-application


## Licences

Tous les nouveaux projets créés par l'Abes depuis 2019 produisent du code opensource.

Nous appliquons la Licence CeCILL : c'est une licence équivalente à la GPL compatible avec le droit Français et préconisée par la loi pour une République numérique. Elle est donc "contaminante", c'est à dire qu'elle impose aux contributeurs de publier les modifications/améliorations réalisées sous la même licence. Les bibliothèques de logiciels ("librairies") développées seront elles publiées sous la licence MIT qui permet une réutilisation moins contraignante et donc plus adapté à la nature de ces codes.
