#!/usr/bin/env bash

if [ -n "$1" ]; then
  jest --maxWorkers=1 ./build/packages/$1
else
  jest --maxWorkers=1 ./build/packages/{stryker,workbox} --passWithNoTests
fi
