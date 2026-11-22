#!/usr/bin/env sh

docker build \
  -f apps/web/Dockerfile \
  --target export \
  --output type=local,dest=/tmp/bmstu-actibank-web \
  .
