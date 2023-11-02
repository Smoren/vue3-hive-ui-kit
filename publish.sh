#!/bin/bash
git pull -r origin master
npm install
npm run clean
npm run build
npm publish
