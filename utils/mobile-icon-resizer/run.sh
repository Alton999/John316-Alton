#! /usr/bin/env bash

mobile-icon-resizer \
  -i appicon_1024.png \
  --iosprefix="Icon" \
  --iosof=output/ios \
  --androidof=output/android \
  --config=config.js
