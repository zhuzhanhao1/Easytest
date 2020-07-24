#!/bin/bash

#阿里云镜像库
#RegistryAddr="registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh"
#公司私服库地址
RegistryAddr="mvn.docworks.cn:9082/zhuzh"
#docker tag zhuzh_web:latest ${RegistryAddr}:1.0

#共有网络，将镜像推送到Registry
docker push ${RegistryAddr}:1.0

#VPC网络，将镜像推送到Registry
#docker tag jenkinsci/blueocean:latest registry-vpc.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0
#docker push registry-vpc.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0