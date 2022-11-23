FROM node:16 AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock swagger-tap.mjs ./
RUN yarn --frozen-lockfile
RUN set -eux; \
    mkdir -p /root/.config/configstore \
    && \
    mkdir -p /root/.config/insight-nodejs \
    && \
    chmod -R g+rwx /root /root/.config \
    && \
    chmod -R g+rwx /usr /usr/src /usr/src/app
ARG ENV="test"
RUN yarn swagger:$ENV
COPY . ./

RUN yarn build:$ENV

FROM nginx:1.17.10
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
