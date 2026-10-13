#!/bin/sh

cd validation
if [ ! -d node_modules ]; then
  npm ci
fi
npm run open
