#!/bin/bash

# 1. download images of slides to folder, name like 01.png, 02.png, ...
# 2. calculate durations of each image from the provided json file
# 3. create a text file that contains :
#  file '/path/to/01.png'
#  duration 5
#  file '/path/to/02.png'
#  duration 1
#  file '/path/to/03.png'
#  duration 3
#  file '/path/to/04.png'
#  duration 2
# 4 run:


# webm VP9/opus is supported by most modern browsers, fallback is h264/aac(MP4), that is supported on all browsers
ffmpeg -f concat -safe 0 -i pics.txt -i webm.webm -vsync cfr -c:v libx264 -tune stillimage -c:a aac -b:a 64k output.mp4 # fastest (4.1x)m audio quality might be worse than with opus
ffmpeg -f concat -safe 0 -i pics.txt -i webm.webm -vsync cfr -c:v libx265 -c:a libopus -application voip output.mkv # middle (0.8) same size as h264
ffmpeg -f concat -safe 0 -i pics.txt -i webm.webm -vsync cfr -c:v libvpx-vp9 -c:a libopus -application voip output.webm # slowest (0.25x), biggest file
