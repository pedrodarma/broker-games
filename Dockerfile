ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json dist _website yarn.lock
RUN ls -la

FROM base as build

ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_USERNAME
ARG REDIS_PASSWORD

ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_USERNAME=${REDIS_USERNAME}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

RUN ls -la
RUN yarn install --frozen-lockfile
RUN ls -la
RUN yarn build
RUN ls -la

# Remove dependências de desenvolvimento
RUN yarn install --frozen-lockfile --production=true

FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/
COPY --from=build /app/yarn.lock /app/
COPY --from=build /app/node_modules /app/node_modules

CMD [ "yarn", "start" ]

EXPOSE 8070
