ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app
COPY . .
RUN rm -rf node_modules package-lock.json dist yarn.lock
RUN ls -la

FROM base as build

ENV CI=true
ENV YARN_ENABLE_SCRIPTS=false

# RUN yarn install --frozen-lockfile
# Remove dependências de desenvolvimento
RUN YARN_ENABLE_SCRIPTS=false yarn install --frozen-lockfile --production=true --ignore-scripts

RUN yarn build

FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/
# COPY --from=build /app/yarn.lock /app/
COPY --from=build /app/node_modules /app/node_modules

CMD [ "yarn", "start" ]

EXPOSE 8070
