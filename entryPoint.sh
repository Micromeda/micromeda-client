#!/bin/sh
set -xe

if [[ -z "$BACKEND_URL" ]]
then
      echo "No backend URL is set!"
      exit 1
else
      sed -i "s~API_URL_REPLACE~$BACKEND_URL~g" /usr/share/nginx/html/configs/application_configuration.json
fi

exec "$@"
