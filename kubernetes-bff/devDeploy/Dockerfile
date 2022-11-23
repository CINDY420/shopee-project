FROM node:14 AS builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn build

RUN npm prune --production

FROM node:14
WORKDIR /usr/src/app
# copy from build image
COPY --from=builder /usr/src/app/config ./config
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD node ./dist/main.js
