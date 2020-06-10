import requests,json
import sys,os
# cur_path = os.path.dirname(os.path.realpath(__file__))
# cur_path_parent = os.path.dirname(os.path.realpath(cur_path))
# sys.path.append(cur_path_parent)
from time import time

class InterfaceRun():

    def get(self,url,headers,params):
        res = requests.get(url, params=params, headers=headers)
        return res


    def post(self,url,headers,params,data):
        if data:
            res = requests.post(url, params=params, data=json.dumps(data), headers=headers)
        else:
            res = requests.post(url, params=params, headers=headers)
        return res



    def delete(self,url,headers,params,data):
        if data:
            res = requests.delete(url, params=params, data=json.dumps(data), headers=headers)
        else:
            res = requests.delete(url, params=params, headers=headers)
        return res


    def put(self,url,headers,params,data):
        if data:
            res = requests.put(url, params=params, data=json.dumps(data), headers=headers)
        else:
            res = requests.put(url, params=params, headers=headers)
        return res



    def uploadfile(self,url,headers,params,data):
        params = json.loads(params)
        headers = json.loads(headers)
        params = params if any(params) == True else None
        headers = headers if any(headers) == True else None
        print(data['path'])
        print(type(data['path']))
        print(params)
        print(type(params))
        files = {"file": open(data['path'], "rb")}
        r = requests.post(url, params=params, files=files, headers=headers)
        try:
            json_response = r.json()
            return json_response
        except Exception as e:
            print("转换字典失败",e)
            print(r.text)
            return r.text



    def run_main(self,method,url,headers,params,data):
        params = json.loads(params) if any(params) == True else None
        headers = json.loads(headers) if any(headers) == True else None
        data = json.loads(data) if any(data) == True else None

        strat_time = time()
        if method == "GET":
            res = self.get(url,headers,params)

        elif method == 'POST':
            res = self.post(url,headers,params,data)

        elif method == 'DELETE':
            res = self.delete(url, headers,params,data)

        elif method == 'PUT':
            res = self.put(url,headers, params,data)

        elif method == "FILE":
            res = self.uploadfile(url,headers,params,data)

        end_time = time()
        duration = int(round(end_time - strat_time, 3) * 1000)
        response_headers = res.headers
        status_code = res.status_code
        try:
            response_body = res.json()
            return response_headers,response_body,duration,status_code
        except Exception as e:
            print(method+"请求出错",e)
            return response_headers,res.text,duration,status_code




if __name__ == "__main__":
    method = "PUT"
    url = 'http://amberdata.cn/transferapi/v2/transfer_form/update_transfer_form'
    headers = '{"Content-Type": "application/json", "accessToken": "90e83f1becfeddf8234a2690336c86e8"}'
    params = '{"id": "/档案移交/J010/2018/83ab27ef-8444-461d-a47d-08235fd9c2b1"}'
    data ={}
    a = InterfaceRun()
    b = a.run_main(method,url=url,headers=headers,params=params,data=data)
