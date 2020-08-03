FROM python:3.7
ENV PYTHONUNBUFFERED 1
# 镜像作者
MAINTAINER zhuzh 971567069@qq.com

#RUN mkdir /code
#WORKDIR /code
#COPY pip.conf /root/.pip/pip.conf
#ADD . /code/
#RUN pip install --upgrade pip
#RUN pip install cryptography
#RUN pip install -r requirements.txt

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY pip.conf /root/.pip/pip.conf
COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip
RUN pip install -r /usr/src/app/requirements.txt
#RUN rm -rf /usr/src/app
#COPY . /usr/src/app
CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000"]



