#!/bin/bash
git pull -r origin main &
npm install &
npm run clean &
npm run build &
npm publish