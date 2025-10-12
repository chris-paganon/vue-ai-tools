FROM node:20

EXPOSE 3000

ARG APP_ENV
COPY ./.output.${APP_ENV} /opt/nuxter/.output

WORKDIR /opt/nuxter/.output/server

CMD ["node", "index.mjs"]