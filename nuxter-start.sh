#!/bin/bash

projectName="vue-ai-tools"
projectNameProduction="$projectName-production"
projectNameStaging="$projectName-staging"

# Check if --local flag is provided
if [[ "$*" == *"--local"* ]]; then
    echo "Starting in local mode..."
    docker compose -f ./nuxter-config/nuxter-base-compose.yml -f ./nuxter-config/nuxter-base-compose.override.yml --env-file ./nuxter-config/staging.env -p ${projectNameProduction} --project-directory ./ up --build --remove-orphans -d
    docker compose -f ./nuxter-config/nuxter-base-compose.yml -f ./nuxter-config/nuxter-base-compose.override.yml --env-file ./nuxter-config/production.env -p ${projectNameStaging} --project-directory ./ up --build --remove-orphans -d
else
    echo "Starting production and staging environments..."
    docker compose -f ./nuxter-config/nuxter-base-compose.yml --env-file ./nuxter-config/production.env -p ${projectNameProduction} --project-directory ./ up --build --remove-orphans -d
    docker compose -f ./nuxter-config/nuxter-base-compose.yml --env-file ./nuxter-config/staging.env -p ${projectNameStaging} --project-directory ./ up --build --remove-orphans -d
fi