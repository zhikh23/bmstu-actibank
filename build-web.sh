#!/usr/bin/env sh

if [ $# -lt 2 ]; then
  echo "Usage: $0 <dist>" >&2
  exit 1
fi

docker build \
  -f apps/web/Dockerfile \
  --target export \
  --output type=local,dest="$1" \
  .
