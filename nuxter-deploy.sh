#!/bin/bash

PROJECT_NAME="vue-ai-tools"
REMOTE_PATH="~/nuxter/vue-ai-tools"
REMOTE_SSH="nuxter@77.37.87.199"

MAIN_DOCKER_COMPOSE_FILE="docker-compose.nuxter.yml"
MAIN_FILES="${MAIN_DOCKER_COMPOSE_FILE} Dockerfile nuxter-start.sh"

deploy_environment() {
  local env=$1
  local project_name="${PROJECT_NAME}-${env}"
  local env_file=".env.${env}"
  local images_dir="docker-images-${env}"
  
  echo "Building ${env} images..."
  docker compose -f ./${MAIN_DOCKER_COMPOSE_FILE} \
    --env-file ./${env_file} -p ${project_name} --project-directory ./ \
    build

  echo "Extracting built image names..."
  images=$(docker images --format "table {{.Repository}}" | grep "${project_name}")

  echo "Saving images to ${images_dir} directory..."
  mkdir -p ${images_dir}
  echo "$images" | while read -r image; do
    echo "Saving $image..."
    docker image save "$image" --output "${images_dir}/${image}.tar"
  done

  echo "Deploying ${env} environment..."
  rsync -Pazre 'ssh' ${MAIN_FILES} ${env_file} ${images_dir} ${REMOTE_SSH}:${REMOTE_PATH}
  
  ssh ${REMOTE_SSH} "cd ${REMOTE_PATH} && ./nuxter-start.sh --${env}"
}

if [[ "$*" == *"--production"* ]]; then
  deploy_environment "production"
  exit 0
fi

if [[ "$*" == *"--staging"* ]]; then
  deploy_environment "staging"
  exit 0
fi

# Display comprehensive usage information
echo "============================================================================="
echo "NUXTER DEPLOYMENT SCRIPT - USAGE INFORMATION"
echo "============================================================================="
echo "APPLICATION: ${PROJECT_NAME}"
echo 
echo "REMOTE SERVER:"
echo "  - Host: ${REMOTE_SSH}"
echo "  - Path: ${REMOTE_PATH}"
echo ""
echo "This script automates deployment of the application"
echo "to remote servers with support for staging and production environments."
echo ""
echo "USAGE:"
echo "  ./nuxter-deploy.sh --staging     Deploy to staging environment"
echo "  ./nuxter-deploy.sh --production  Deploy to production environment"
echo ""
echo "DEPLOYMENT PROCESS:"
echo "  1. Builds Docker images locally"
echo "  2. Saves images as tar files locally"
echo "  3. Transfers files to remote server via rsync"
echo "  4. Executes remote deployment script"
echo ""
echo "============================================================================="

