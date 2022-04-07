#!/bin/bash

# Paramètres par défaut du conteneur
export LN_VUE_APP_ROOT_API=${LN_VUE_APP_ROOT_API:='https://acces.licencesnationales.fr/v1/api/'}
export LN_VUE_APP_RECAPTCHA_KEY_SITE=${LN_VUE_APP_RECAPTCHA_KEY_SITE:='6LcjHroaAAAAAOhO6sd_1ooz5LfcyRPoYirqxsFt'}


# Remplace les placeholders dans le code généré en prod
# LN_PLACEHOLDER_VUE_APP_RECAPTCHA_KEY_SITE
# LN_PLACEHOLDER_VUE_APP_ROOT_API
# On va remplacer les placeholders depuis les JS originales
echo "TEST Récup Hash : $1"
echo "-> Remplacement des placeholders venant du .env de vuejs dans la destination /usr/share/nginx/html/"
echo "-> LN_VUE_APP_ROOT_API=${LN_VUE_APP_ROOT_API}"
echo "-> LN_VUE_APP_RECAPTCHA_KEY_SITE=${LN_VUE_APP_RECAPTCHA_KEY_SITE}"
rm -rf /usr/share/nginx/html/
cp -rf /usr/share/nginx/html.orig/ /usr/share/nginx/html/
sed -i "s#LN_PLACEHOLDER_VUE_APP_ROOT_API#${LN_VUE_APP_ROOT_API}#g" /usr/share/nginx/html/js/*
sed -i "s#LN_PLACEHOLDER_VUE_APP_RECAPTCHA_KEY_SITE#${LN_VUE_APP_RECAPTCHA_KEY_SITE}#g" /usr/share/nginx/html/js/*



# execute nginx (cf CMD dans Dockerfile)
exec "$@"
