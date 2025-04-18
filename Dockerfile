ARG NODE_VERSION="18"
ARG ALPINE="3.21"

FROM node:${NODE_VERSION}-alpine${ALPINE} AS base

FROM base AS build

WORKDIR /app
COPY package.json .

COPY . .
RUN yarn install
RUN yarn run build

FROM base AS production

ENV TOKEN=${TOKEN}

WORKDIR /app
COPY package.json  .

RUN yarn install --production
COPY --from=build /app/dist ./dist

CMD [ "node", "dist/index.js" ]