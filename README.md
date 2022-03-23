# licencesnationales-front

[![ci](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/licencesnationales.svg)](https://hub.docker.com/r/abesesr/licencesnationales/)

**Application en cours de développement**

Application web Licences Nationales (client léger en JavaScript/VueJS) reposant sur l'[API Licences Nationales](https://github.com/abes-esr/licencesnationales-back). 

Licences nationales permet :
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

Pour publier une nouvelle release (version) de l'application, voici comment procéder:
1. Se rendre sur l'onglet "Actions" sur le dépôt github  
   ![image](https://user-images.githubusercontent.com/328244/159044287-67c7131f-8663-4452-b7fa-55aa8c695692.png)
2. Cliquer sur le workflow "Create release"  
   ![image](https://user-images.githubusercontent.com/328244/159044427-d36ae0d6-51cc-4f69-a855-097c162ba100.png)
3. Cliquez ensuite sur "Run workflow" sur la droite  
   ![image](https://user-images.githubusercontent.com/328244/159044539-57b57fba-15b8-440d-94e7-1ee859566a04.png)
4. Indiquez ensuite le numéro de la version à générer (doit respecter le sementic versionning) après avoir vérifié que votre numéro de version n'existe pas déjà dans la [liste des tags](https://github.com/abes-esr/licencesnationales-front/tags)  
   ![image](https://user-images.githubusercontent.com/328244/159044729-e9cc0d7a-abe3-401f-a246-84e577670493.png)
5. Validez et attendez que le build se termine dans le [workflow "build-test-pubtodockerhub"](https://github.com/abes-esr/licencesnationales-front/actions/workflows/build-test-pubtodockerhub.yml), ce qui aura pour conséquence  de générer et [publier sur dockerhub une image docker](https://hub.docker.com/r/abesesr/licencesnationales/tags) ayant comme tag le numéro de version de votre release.

## Licences

Tous les nouveaux projets créés par l'Abes depuis 2019 produisent du code opensource.

Nous appliquons la Licence CeCILL : c'est une licence équivalente à la GPL compatible avec le droit Français et préconisée par la loi pour une République numérique. Elle est donc "contaminante", c'est à dire qu'elle impose aux contributeurs de publier les modifications/améliorations réalisées sous la même licence. Les bibliothèques de logiciels ("librairies") développées seront elles publiées sous la licence MIT qui permet une réutilisation moins contraignante et donc plus adapté à la nature de ces codes.
