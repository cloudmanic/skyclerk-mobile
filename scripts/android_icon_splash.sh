#!/bin/bash

######
# Make a bunch of Android splash screens Master image.
# Given an image at least 1920x1920 pixels named splash.png, resize and create a
# duplicate at each specified size. Add new sizes as needed. When finished,
# copy the resulting images into your Android project, under the res folder.

splash="../resources/android/splash.png"
target="../android/app/src/main/res"

mkdir -p $target
function resize {
  w=$2
  h=$3

  echo $splash into $4

  [ -d "$target/$4" ] || mkdir $target/$4

  if [[ $w -ge $h ]]; then
    sips -Z $w -c $h $w --out $target/$4/splash.png $1
  else
    sips -Z $h -c $h $w --out $target/$4/splash.png $1
  fi
}

resize $splash 480 320 drawable
resize $splash 800 480 drawable-land-hdpi
resize $splash 480 320 drawable-land-mdpi
resize $splash 1280 720 drawable-land-xhdpi
resize $splash 1600 960 drawable-land-xxhdpi
resize $splash 1920 1280 drawable-land-xxxhdpi
resize $splash 480 800 drawable-port-hdpi
resize $splash 320 480 drawable-port-mdpi
resize $splash 720 1280 drawable-port-xhdpi
resize $splash 960 1600 drawable-port-xxhdpi
resize $splash 1280 1920 drawable-port-xxxhdpi
