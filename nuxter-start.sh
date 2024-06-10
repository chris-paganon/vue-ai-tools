projectName="vue-ai-tools"
projectNameProduction="$projectName-production"
projectNameStaging="$projectName-staging"

docker network create ${projectNameProduction}_caddy_nuxt_app
docker network create ${projectNameProduction}_vector_db
docker network create ${projectNameStaging}_caddy_nuxt_app
docker network create ${projectNameStaging}_vector_db

docker compose -f ./nuxter-config/nuxter-base-compose.yml --env-file ./nuxter-config/production.env -p ${projectNameProduction} --project-directory ./ up --build --remove-orphans -d
docker compose -f ./nuxter-config/nuxter-base-compose.yml --env-file ./nuxter-config/staging.env -p ${projectNameStaging} --project-directory ./ up --build --remove-orphans -d