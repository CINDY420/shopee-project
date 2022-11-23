FROM harbor.shopeemobile.com/shopee/nodejs-base:16

WORKDIR /usr/cell

COPY package.json yarn.lock ./
RUN yarn
RUN yarn add-ts-node

COPY . ./

WORKDIR /usr/cell/app
COPY package.json yarn.lock ./
RUN yarn









