FROM ubuntu:18.04

WORKDIR /szdevops

RUN apt-get update && apt-get install -y jq
RUN apt-get install -y sysstat net-tools curl iproute2 iftop tcpdump lrzsz

COPY ./debugger .
