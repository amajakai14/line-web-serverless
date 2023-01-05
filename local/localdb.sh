#!/bin/bash

# Change to the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

# Stop and remove the old container if it exists
echo "stop docker container"
docker stop linemenu-mysql-container
echo "remove docker container"
docker rm linemenu-mysql-container

# Check if the image exists
if [ "$(docker images -q linemenu-mysql-image:latest 2> /dev/null)" = "" ]; then
  # Build the image if it does not exist
  docker build -t linemenu-mysql-image .
fi

# Run the container
echo "run container"
docker run -d --name linemenu-mysql-container -p 3306:3306 linemenu-mysql-image