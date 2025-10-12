#!/bin/bash

# TODO: This may not be necessary if rsync doesn't delete the DB. Rsync also doesn't seem to wait for this to complete
ssh nuxter@77.37.87.199 \
  "cd ~/nuxter/vue-ai-tools && mv .output.production .output.production.old && mv .output.staging .output.staging.old"

rsync -avzre 'ssh' docker-compose.nuxter.yml Dockerfile nuxter-start.sh \
  .env.production .env.staging \
  .output.production .output.staging \
  nuxter@77.37.87.199:~/nuxter/vue-ai-tools

ssh nuxter@77.37.87.199 \
  "cd ~/nuxter/vue-ai-tools && \
   cp .output.production.old/server/db/sqlite.db .output.production/server/db/sqlite.db && \
   cp .output.staging.old/server/db/sqlite.db .output.staging/server/db/sqlite.db && \
   ./nuxter-start.sh"