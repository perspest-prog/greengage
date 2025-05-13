ARG NODE_VERSION="18"
ARG ALPINE="3.21"

FROM node:${NODE_VERSION}-alpine${ALPINE} AS base

FROM base AS build

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app
COPY package.json  .

COPY --from=build /app/dist ./dist

RUN yarn install

CMD [ "yarn", "start" ]