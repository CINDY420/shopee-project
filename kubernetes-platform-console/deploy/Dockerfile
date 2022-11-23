FROM harbor.shopeemobile.com/kubernetes-platform/node:14 AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
ARG ENV="dev"
RUN yarn build:$ENV

FROM harbor.shopeemobile.com/kubernetes-platform/nginx:latest
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
