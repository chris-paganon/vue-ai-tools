#!/bin/bash

projectName="vue-ai-tools"
projectNameProduction="$projectName-production"
projectNameStaging="$projectName-staging"

# Check if --local flag is provided
if [[ "$*" == *"--local"* ]]; then
    echo "Starting in local mode..."
    docker compose -f ./docker-compose.nuxter.yml -f ./docker-compose.nuxter.override.yml --env-file ./.env.staging -p ${projectNameProduction} --project-directory ./ up --build --remove-orphans -d
    docker compose -f ./docker-compose.nuxter.yml -f ./docker-compose.nuxter.override.yml --env-file ./.env.production -p ${projectNameStaging} --project-directory ./ up --build --remove-orphans -d
else
    echo "Starting production and staging environments..."
    docker compose -f ./docker-compose.nuxter.yml --env-file ./.env.production -p ${projectNameProduction} --project-directory ./ up --build --remove-orphans -d
    docker compose -f ./docker-compose.nuxter.yml --env-file ./.env.staging -p ${projectNameStaging} --project-directory ./ up --build --remove-orphans -d
fi