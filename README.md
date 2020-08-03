# Easytest

镜像仓库：registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh

docker login --username=zhuzhanaho registry.cn-hangzhou.aliyuncs.com

docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:[镜像版本号]

docker push registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:[镜像版本号]

docker pull registry.cn-hangzhou.aliyuncs.com/zhuzhanhao/zhuzh:[镜像版本号]

## 一、概念释义
### WSGI

WSGI 是一个Web服务器（如nginx）与应用服务器（如uWSGI）通信的一种规范（协议）。官方定义是，the Python Web Server Gateway Interface。从名字就可以看出来，这东西是一个Gateway，也就是网关。网关的作用就是在协议之间进行转换。

在生产环境中使用WSGI作为python web的服务器。Python Web服务器网关接口，是Python应用程序或框架和Web服务器之间的一种接口，被广泛接受。WSGI没有官方的实现, 因为WSGI更像一个协议，只要遵照这些协议，WSGI应用(Application)都可以在任何服务器(Server)上运行。
### uWSGI

uWSGI 实现了WSGI的所有接口，是一个快速、自我修复、开发人员和系统管理员友好的服务器。把 HTTP 协议转化成语言支持的网络协议。uWSGI代码完全用C编写，效率高、性能稳定。

### uwsgi
（注意：此处为小写，是另一个东西，和 uWSGI 不一样）
uwsgi是一种线路协议，不是通信协议，常用于在uWSGI服务器与其他网络服务器的数据通信。uwsgi协议是一个uWSGI服务器自有的协议，它用于定义传输信息的类型。

#### 小结：
WSGI    -->  网关、接口
uWSGI  -->  一种服务
uwsgi    -->  线路协议

## 二、启动停止重启

uWSGI 通过 xxx.ini 启动后会在相同目录下生成一个 xxx.pid 的文件，里面只有一行内容是 uWSGI 的主进程的进程号。

#### 启动：
uwsgi --ini xxx.ini
#### 重启：
uwsgi --reload xxx.pid
#### 停止：
uwsgi --stop xxx.pid


#### mysql用8.0以上的版本需要进入容器执行此命令
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';


####docker部署
借鉴与：https://juejin.im/post/6844903993613746183

Redis 容器：缓存服务

Mysql 容器：数据存储

Django（Gunicorn）容器：处理动态请求

Nginx 容器：反向代理，处理静态资源
####配置NGINX和WEBSOCKET
https://www.nginx.com/blog/websocket-nginx/

容器依赖关系：Django 容器依赖 Redis 容器和 Mysql 容器，Nginx 容器依赖Gunicorn 容器。

####启动项目
运行项目：docker-compose up --build
停止项目：docker-compose down