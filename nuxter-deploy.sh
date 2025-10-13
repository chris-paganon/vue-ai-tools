#!/bin/bash

if [[ "$*" == *"--production"* ]]; then
    echo "Deploying production environment..."
    rsync -azre 'ssh' docker-compose.nuxter.yml Dockerfile nuxter-start.sh \
      .env.production \
      .output.production \
      nuxter@77.37.87.199:~/nuxter/vue-ai-tools
    
    ssh nuxter@77.37.87.199 "cd ~/nuxter/vue-ai-tools && ./nuxter-start.sh --production"
    exit 0
fi

if [[ "$*" == *"--staging"* ]]; then
    echo "Deploying staging environment..."

    rsync -azre 'ssh' docker-compose.nuxter.yml Dockerfile nuxter-start.sh \
      .env.staging \
      .output.staging \
      nuxter@77.37.87.199:~/nuxter/vue-ai-tools

    ssh nuxter@77.37.87.199 "cd ~/nuxter/vue-ai-tools && ./nuxter-start.sh --staging"
    exit 0
fi

echo "Deploying production and staging environments..."

rsync -azre 'ssh' docker-compose.nuxter.yml Dockerfile nuxter-start.sh \
  .env.production .env.staging \
  .output.production .output.staging \
  nuxter@77.37.87.199:~/nuxter/vue-ai-tools

ssh nuxter@77.37.87.199 "cd ~/nuxter/vue-ai-tools && ./nuxter-start.sh"
