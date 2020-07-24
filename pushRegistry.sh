#!/bin/bash
#共有网络，将镜像推送到Registry
docker tag zhuzh_web:latest registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0
docker push registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0

#VPC网络，将镜像推送到Registry
#docker tag jenkinsci/blueocean:latest registry-vpc.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0
#docker push registry-vpc.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:1.0