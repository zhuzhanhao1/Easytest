import json,os
from django.core.paginator import Paginator
from django.db.models import Q
from easy.models import InterFaceCaseData,InterFaceSet
from .relevanceInterfaceSer import AddRelevanceInterfaceSer,DescriptionSer,\
    InterfaceNameSer,HeadSer,DependIdSer,DependKeySer,ReplaceKeySer,ReplacePositionSer,ResultTimeSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from django_redis import get_redis_connection
from ...common.interfaceRun import InterfaceRun


class InterfaceCaseData(APIView):

    def get(self, request, *args, **kwargs):
        parentId = request.GET.get("parentId","")
        id = request.GET.get("id","")
        result_detail = request.GET.get("result_detail","")
        if result_detail:
            result = InterFaceCaseData.objects.filter(id=result_detail).first().result
            right_code["msg"] = result
            return Response(right_code)
        obj = InterFaceCaseData.objects.filter(parent=parentId)
        if id:
            obj = InterFaceCaseData.objects.filter(Q(parent=parentId) & Q(id=id))
        serializer = AddRelevanceInterfaceSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(
            data={
                "code": 0,
                "msg": "",
                "count": len(
                    serializer.data),
                "data": res})

    def post(self ,request, *args, **kwargs):
        data = request.data
        relevance_ids = data.get("relevance_ids","")
        parent = data.get("parent","")
        for id in json.loads(relevance_ids):
            dic = {}
            obj = InterFaceSet.objects.filter(id=id).first()
            dic["interface_name"] = obj.interface_name
            dic["parent"] = parent
            dic["tcp"] = obj.tcp
            dic["ip"] = obj.ip
            dic["url"] = obj.url
            dic["method"] = obj.method
            dic["headers"] = obj.headers
            dic["params"] = obj.params
            dic["body"] = obj.body
            dic["preprocessor"] = obj.preprocessor
            print(dic)
            serializer = AddRelevanceInterfaceSer(data=dic)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加关联接口成功"
            else:
                error_code['error'] = '关联接口保存数据库失败'
                return Response(error_code)
        return Response(right_code)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除用例内接口数据
        '''
        try:
            obj = InterFaceCaseData.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除关联接口成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除关联接口失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        data = request.data
        print(pk)
        print(data)
        obj = InterFaceCaseData.objects.filter(id=pk).first()
        if len(data) == 1:
            for i in data.keys():
                try:
                    if i == "interface_name":
                        serializer = InterfaceNameSer(obj, data=data)
                    elif i == "description":
                        serializer = DescriptionSer(obj, data=data)
                    elif i == "head":
                        serializer = HeadSer(obj, data=data)
                    elif i == "depend_id":
                        serializer = DependIdSer(obj, data=data)
                    elif i == "depend_key":
                        serializer = DependKeySer(obj, data=data)
                    elif i == "replace_key":
                        serializer = ReplaceKeySer(obj, data=data)
                    elif i == "replace_position":
                        if data.get("replace_position") == '0' or data.get("replace_position") == '1' or data.get("replace_position") == '2':
                            serializer = ReplacePositionSer(obj, data=data)
                        else:
                            error_code['error'] = '必须是0，1，2其中之一'
                            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

                    if serializer.is_valid():
                        serializer.save()
                        right_code["msg"] = "编辑成功"
                        return Response(right_code)
                    else:
                        error_code['error'] = '保存数据到数据库失败'
                except Exception as e:
                    print(e)
                    error_code["error"] = str(e)
                return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = AddRelevanceInterfaceSer(obj, data=data)
            print(serializer)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "编辑成功"
                return Response(right_code)
            else:
                error_code['error'] = '保存数据到数据库失败'
                return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

class RunInterfaceDebugTest(APIView):

    def parameter_check(self, tcp, ip, url, method):
        """
        验证必传参数 method, url, headers
        """
        try:
            if not method or not url or not tcp or not ip:
                error_code["error"] = "必填参数有缺失"
                return error_code
            else:
                return right_code
        except Exception as e:
            error_code["error"] = "未知错误"
            return error_code

    def post(self, request, *args, **kwargs):
        '''
            接口测试
        '''
        datas = request.data
        debug_id = datas.get("debug_id","")
        method = datas.get("method", "")
        tcp = datas.get("tcp", "")
        ip = datas.get("ip", "")
        url = datas.get("url", "")
        headers = datas.get("headers", "")
        params = datas.get("params", "")
        body = datas.get("body", "")
        # 参数校验
        result = self.parameter_check(tcp,ip,url,method)
        print(result)
        if result["code"] == 1001:
            return Response(result)
        try:
            url = tcp + "://" + ip + "/" + url
            response_headers, response_body, duration, status_code = InterfaceRun().run_main(method, url, headers,
                                                                                             params, body)
            if not status_code:
                error_code["error"] = response_headers
                return Response(error_code)
            # response = json.dumps(response, ensure_ascii=False, sort_keys=True, indent=2)
            right_code["msg"] = "接口调试成功"
            right_code["response_headers"] = response_headers
            right_code["response_body"] = response_body
            right_code["duration"] = duration
            right_code["status_code"] = status_code
            #将单个接口执行结果的值保存到数据库
            obj = InterFaceCaseData.objects.filter(id=debug_id).first()
            try:
                djson = json.dumps(response_body, ensure_ascii=False, sort_keys=True, indent=2)
            except Exception as e:
                print("json序列化异常")
                print(e)
                djson = response_body
            dic = {"duration":duration,"result":djson}
            print(dic)
            ser = ResultTimeSer(obj,data=dic)
            if ser.is_valid():
                ser.save()
                return Response(right_code)
            else:
                error_code["error"] = "保存数据库失败"
                return Response(error_code)
        except TypeError as e:
            error_code["error"] = str(e)
            return Response(error_code)

class InterfaceCaseDataLocust(APIView):

    def get(self, request, *args, **kwargs):
        '''
        关闭蝗虫(性能测试端口)
        '''
        system = request.GET.get("system","")
        if system == "MacOS":
            locust_process = os.popen('lsof -i:8089').readlines()[-1]
            res = locust_process.split(" ")
            res_filter = list(filter(None, res))
            try:
                if not res_filter[1]:
                    error_code["error"] = "获取8089对应的进程号失败"
                    return Response(error_code)
                command = "kill -9 {}".format(res_filter[1])
                print(command)
                os.system(command)
                right_code["msg"] = "Successful closing locust"
                return Response(right_code)
            except Exception as e:
                print(e)
                error_code["error"] = "Failed closing locust"
            return Response(error_code)
        #如果是windows
        else:
            # 查找端口的pid
            try:
                find_port = 'netstat -aon | findstr 8089'
                result = os.popen(find_port)
                text = result.read()
                pid = text[-6:-1].strip()
                print(pid)
                if not pid:
                    error_code["error"] = "获取8089对应的进程号失败"
                    return Response(error_code)
            except Exception as e:
                print(e)
                error_code["error"] = "8089端口未打开"
                return Response(error_code)
            # 占用端口的pid
            try:
                find_kill = 'taskkill -f -pid %s' % pid
                # result = os.popen(find_kill)
                # print(result.read())
                os.system(find_kill)
                right_code["msg"] = "Successful closing locust"
                return Response(right_code)
            except Exception as e:
                print(e)
                error_code["error"] = "关闭8089对应的进程失败"
                return Response(error_code)

    def post(self,request, *args, **kwargs):
        '''
            开启蝗虫:
        '''
        data = request.data
        id_list =  json.loads(data["id"])
        system = data.get("system","")
        ip = data.get("ip","")
        print(id_list)
        if not id_list:
            error_code["error"] = "暂不支持将依赖的接口加入到Loucst中测试"
            return Response(error_code)
        #查询所有需要执行的对象集
        interface_id_list = InterFaceCaseData.objects.filter(id__in=id_list)
        print(interface_id_list)
        locust_dic = {}
        num = 1
        #通过遍历对象集获取对应接口的请求参数
        for obj in interface_id_list:
            dic = {}
            dic["method"] = obj.method
            dic["url"] = obj.url
            dic["params"] = obj.params
            dic["headers"] = obj.headers
            dic["body"] = obj.body
            dic["interface_name"] = obj.interface_name
            locust_dic[num] = dic
            num += 1
        print(locust_dic)
        conn = get_redis_connection('default')
        conn.set("locust_dic", json.dumps(locust_dic))
        #linux
        if system == "MacOS":
            os.system("nohup locust -f easy/common/locustTest.py --host=http://{}/ &".format(ip))
        #win
        elif system == "Windows":
            os.system("locust -f easy/common/locustTest.py --host=http://{}/".format(ip))
            right_code["msg"] = "Locust已经开启"
        return Response(right_code)

