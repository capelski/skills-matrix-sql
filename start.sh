#!/bin/bash

cd types && npm ci && npm run build
docker compose up
