#!/bin/bash
echo "Build start"

rm -rf dist
mkdir -p dist

cat src/jquery.js src/index.js | tr -d '\t\n' > dist/entry.js