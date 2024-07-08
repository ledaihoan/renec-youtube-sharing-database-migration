#!/usr/bin/env bash
if [ -n "$1" ]; then
  DEPLOYMENT_ENV=$1
else
  DEPLOYMENT_ENV=local
fi

. init_env.sh $DEPLOYMENT_ENV
echo $SERVICE_DB_USER_NAME
yarn migrate:latest
