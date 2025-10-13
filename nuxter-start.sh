#!/bin/bash

PROJECT_NAME="vue-ai-tools"
MAIN_DOCKER_COMPOSE_FILE="docker-compose.nuxter.yml"

start_environment() {
  local env=$1
  local project_name="${PROJECT_NAME}-${env}"
  local env_file=".env.${env}"
  local images_dir="docker-images-${env}"
  
  echo "Starting ${env} environment..."
  
  echo "Loading images from ${images_dir} directory..."
  ls ${images_dir} | while read -r image; do
      echo "Loading $image..."
      docker load --input "${images_dir}/$image"
  done

  docker compose -f ./${MAIN_DOCKER_COMPOSE_FILE} \
    --env-file ./${env_file} -p ${project_name} --project-directory ./ \
    up --no-build --remove-orphans -d
}

start_local() {
  echo "Starting in local development mode..."
  docker compose --env-file .env.local -f ./${MAIN_DOCKER_COMPOSE_FILE} -f ./${MAIN_DOCKER_COMPOSE_FILE}.override.yml up
}


if [[ "$*" == *"--production"* ]]; then
  start_environment "production"
  exit 0
fi

if [[ "$*" == *"--staging"* ]]; then
  start_environment "staging"
  exit 0
fi

# Display comprehensive usage information
echo "============================================================================="
echo "NUXTER START SCRIPT - USAGE INFORMATION"
echo "============================================================================="
echo "APPLICATION: ${PROJECT_NAME}"
echo ""
echo "This script starts the application in different environments"
echo "using pre-built Docker images."
echo ""
echo "USAGE:"
echo "  ./nuxter-start.sh --local       Start in local development mode"
echo "  ./nuxter-start.sh --staging     Start staging environment"
echo "  ./nuxter-start.sh --production  Start production environment"
echo ""
echo "ENVIRONMENTS:"
echo "  --local      Development mode with docker override files (doesn't use pre-built images)"
echo "  --staging    Staging environment using pre-built images"
echo "  --production Production environment using pre-built images"
echo ""
echo "STARTUP PROCESS:"
echo "  1. Loads pre-built Docker images from docker-images-{env} directory"
echo "  2. Starts containers using docker-compose with environment-specific config"
echo "  3. Uses --no-build flag to ensure pre-built images are used (except for local development)"
echo "  4. Removes orphaned containers for clean startup"
echo ""
echo "============================================================================="