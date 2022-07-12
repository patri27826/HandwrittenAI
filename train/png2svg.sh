#!/bin/bash

for file_png in ./train/B/*
do 
convert "$file_png" "${file_png%.*}.pnm"        # PNG to PNM
potrace "${file_png%.*}.pnm" -s -o "${file_png%.*}.svg"  # PNM to SVG
rm "$file_png"
rm "${file_png%.*}.pnm"
done
