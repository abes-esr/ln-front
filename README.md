# licencesnationales-front
## Client léger pour l'API Licences Nationales

Client léger web en JavaScript pour l'API Licences Nationales ( https://github.com/abes-esr/licencesnationales-back ), permettant de fournir aux utilisateurs une interface graphique, disponible via un navigateur, pour l'API. 

Licences nationales permet :
- aux institutions bénéficiaires des ressources numériques de :
  - déclarer les contacts pour l’administration technique des ressources,
  - déclarer les adresses IP.
- à l’Abes :
  - renseigner les contacts auprès des éditeurs de ces ressources
  - vérifier les informations saisies par les bénéficiaires, supprimer ou accepter les comptes, valider ou non les adresses IP
  - envoyer les informations de gestion renseignées par les institutions aux éditeurs présents dans la base, via un batch mensuel, non automatisé. Ce batch comprend un identifiant Abes ad hoc, utilisé souvent comme identifiant pivot sur lequel les éditeurs et l’Inist (pour les plates-formes ISTEX et PANIST) s’appuient pour gérer les droits d’accès.


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

## Licences

Tous les nouveaux projets créés par l'Abes depuis 2019 produisent du code opensource.

Nous appliquons la Licence CeCILL : c'est une licence équivalente à la GPL compatible avec le droit Français et préconisée par la loi pour une République numérique. Elle est donc "contaminante", c'est à dire qu'elle impose aux contributeurs de publier les modifications/améliorations réalisées sous la même licence. Les bibliothèques de logiciels ("librairies") développées seront elles publiées sous la licence MIT qui permet une réutilisation moins contraignante et donc plus adapté à la nature de ces codes.
