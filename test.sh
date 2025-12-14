#!/bin/bash

cd api
[[ ! -d node_modules ]] && npm ci
npm test
