#!/bin/sh

cd api
if [ ! -d node_modules ]; then
  mkdir directory
fi
npm test
