#!/bin/bash
#首次登入阿里云镜像仓库成功后会有一个警告，意思你的密码以明文格式记录在/root/.docker/config.json
RegistryAddr="registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh"
#登录阿里云镜像库，这里已经登录过阿里云镜像库了，则不需要登录了
#docker login --username=${Username} ${Registry_Domain}  -p${Password}
#停止容器并删除容器
docker stop amberdata_zhuzh && docker rm amberdata_zhuzh
#删除之前的镜像
docker rmi ${RegistryAddr}/:1.0
#拉取镜像并实例化容器运行
docker run -d -p 8000:8000 \
      --name amberdata_zhuzh \
      --restart=always \
      -v /amberdata/Easytest:/usr/src/app \
      ${RegistryAddr}:1.0



