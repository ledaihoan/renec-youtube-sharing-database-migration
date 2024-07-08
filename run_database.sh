#!/usr/bin/env bash
DOCKER_CONTAINER_NAME=renec_postgresql

# Function to remove the container
remove_container() {
    echo "Removing container $DOCKER_CONTAINER_NAME..."
    docker rm -f $DOCKER_CONTAINER_NAME
}

# Check if the first parameter is 'delete'
if [ "$1" = "delete" ]; then
    remove_container
fi

# Check if the container exists (running or stopped)
if docker ps -a --format '{{.Names}}' | grep -q "^$DOCKER_CONTAINER_NAME"; then
    echo "Container $DOCKER_CONTAINER_NAME exists."

    # Check if the container is running
    if docker ps --format '{{.Names}}' | grep -q "^$DOCKER_CONTAINER_NAME"; then
        echo "Container $DOCKER_CONTAINER_NAME is already running."
    else
        echo "Starting container $DOCKER_CONTAINER_NAME..."
        docker start $DOCKER_CONTAINER_NAME
    fi
else
    echo "Container $DOCKER_CONTAINER_NAME does not exist. Running docker compose up..."
    docker compose up -d
fi