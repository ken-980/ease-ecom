# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.2.0

FROM node:22-bullseye-slim

RUN corepack enable

RUN yarn set version 4.2.2

WORKDIR /usr/src/app

ENV NODE_ENV production

# Copy package.json so that package manager commands can be used.
COPY package.json .

COPY . .

RUN yarn install

# Expose the port that the application listens on.
EXPOSE 3000

#USER node
# Run the application.
CMD yarn deploy
