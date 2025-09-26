ARG BASE_IMAGE_TAG=latest
FROM rudi/microservice:$BASE_IMAGE_TAG

RUN apt-get update && apt-get -y install ghostscript

ADD rudi-microservice-konsent-facade.jar /opt/rudi/microservice.jar