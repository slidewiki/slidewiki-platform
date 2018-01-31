#!/bin/bash

# 1. download images of slides to folder, name like 01.png, 02.png, ...
# 2. calculate durations of each image
# 3. create a text file that contains :
#  file '/path/to/01.png'
#  duration 5
#  file '/path/to/02.png'
#  duration 1
#  file '/path/to/03.png'
#  duration 3
#  file '/path/to/04.png'
#  duration 2
# 4.

ffmpeg -f concat -safe 0 -i pics.txt -i audio.webm -vsync cfr -c:v libx265 -preset faster -c:a libvorbis output.mkv
