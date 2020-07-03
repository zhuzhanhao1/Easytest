from locust import HttpLocust, TaskSet, task, between
import json,os
from django_redis import get_redis_connection


class LocustTest(TaskSet):

    @classmethod
    def setup(cls):
        conn = get_redis_connection('default')
        locust_dic = conn.get("locust_dic")
        if not locust_dic:
            return
        cls.locust_dic = json.loads(locust_dic)
        # headers = {"content-type":"application/json"}
        # data = json.dumps(login["body"])
        # res = requests.post(login["url"],data=data,headers=headers)
        # response_body = res.json()
        # print(response_body)
        # cls.headers = {"content-type": "application/json", "accessToken": response_body["accessToken"]}


    def get(self,value):
        params = value.get("params","")
        params = json.loads(params) if params else None
        data = value.get("body", "")
        headers = json.loads(value.get("headers",""))
        with self.client.get(value["url"],headers=headers,params = params,data=data,catch_response=True) as response:
            print(response.text)
            if response.status_code == 200:
                response.success()
            else:
                response.failure(value["interface_name"]+"失败！！！")

    def post(self,value):
        params = value.get("params","")
        params = json.loads(params) if params else None
        data = value.get("body","")
        data = data if data else None
        headers = json.loads(value.get("headers", ""))
        with self.client.post(value["url"],headers=headers,params = params,data=data,catch_response=True) as response:
            print(response.text)
            if response.status_code == 200:
                response.success()
            else:
                response.failure(value["interface_name"]+"失败！！！")

    def put(self,value):
        params = value.get("params","")
        params = json.loads(params) if params else None
        data = value.get("body","")
        data = data if data else None
        headers = json.loads(value.get("headers", ""))
        with self.client.put(value["url"],headers=headers,params = params,data=data,catch_response=True) as response:
            print(response.text)
            if response.status_code == 200:
                response.success()
            else:
                response.failure(value["interface_name"]+"失败！！！")


    def delete(self,value):
        params = value.get("params","")
        params = json.loads(params) if params else None
        data = value.get("body","")
        data = data if data else None
        headers = json.loads(value.get("headers", ""))
        with self.client.delete(value["url"],headers=headers,params = params,data=data,catch_response=True) as response:
            print(response.text)
            if response.status_code == 200:
                response.success()
            else:
                response.failure(value["interface_name"]+"失败！！！")

    @task
    def data_source(self):
        print(self.locust_dic)
        for value in self.locust_dic.values():
            if value["method"] == "GET":
                self.get(value)
            elif value["method"] == "POST":
                self.post(value)
            elif value["method"] == "PUT":
                self.put(value)
            elif value["method"] == "DELETE":
                self.delete(value)



class WebsiteUser(HttpLocust):
    task_set = LocustTest #定义此 HttpLocust 的执行行为的 TaskSet 类
    wait_time = between(1, 3)

if __name__ == "__main__":
    os.system("locust -f locustTest.py --host=http://app.amberdata.cn/")
