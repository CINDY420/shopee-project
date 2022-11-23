# ksc-console

Console for ksc

## how to deploy to live

docker login -u shopee-jenkins -p Java123Fucker harbor.shopeemobile.com

### build docker

1. git check branch ***
2. docker build -f ./Dockerfile -t console:version --build-arg=ENV=live .
3. docker tag console:version harbor.shopeemobile.com/shopee/ksc-console:console-version
3. docker push harbor.shopeemobile.com/shopee/ksc-console:console-version

### deploy

1. git clone https://git.garena.com/shopee/sz-devops/ecp/batch/ksc-config
2. git check branch feature-×××
3. cd deploy/yaml/live/managerCluster
4. find ksc-console.yaml
5. change "GIT_REVISION" and "IMAGE_NAME"
