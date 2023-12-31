#!/bin/bash

if pulseaudio --check; then
    echo "Pulseaudio already running - killing it..."
    pulseaudio --kill
fi

# sometimes pulseaudio fails to start (for unknown reason - try starting it again)
echo "Starting pulseaudio..."
echo "pulse audio..."
pulseaudio --start -vvv --disallow-exit --log-target=syslog --high-priority --exit-idle-time=-1 &

echo "pulse audio started successfully..."

# launch streaming
echo "Launching bbb_stream.js"
node bbb_stream.js
