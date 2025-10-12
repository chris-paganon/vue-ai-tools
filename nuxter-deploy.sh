#!/bin/bash

rsync -avzre 'ssh' docker-compose.nuxter.yml Dockerfile nuxter-start.sh \
  .env.production .env.staging \
  .output.production .output.staging \
  nuxter@77.37.87.199:~/nuxter/vue-ai-tools

ssh nuxter@77.37.87.199 \
  "cd ~/nuxter/vue-ai-tools && \
   cp .output.production.old/server/db/sqlite.db .output.production/server/db/sqlite.db && \
   cp .output.staging.old/server/db/sqlite.db .output.staging/server/db/sqlite.db && \
   ./nuxter-start.sh"