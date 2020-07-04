import json,os
from django.core.paginator import Paginator
from easy.models import InterFaceCaseData,InterFaceSet
from .relevanceInterfaceSer import InterFaceCaseDataSer,AddRelevanceInterfaceSer,\
    DescriptionSer,InterfaceNameSer,HeadSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from django_redis import get_redis_connection




class InterfaceCaseData(APIView):

    def get(self, request, *args, **kwargs):
        parentId = request.GET.get("parentId")
        obj = InterFaceCaseData.objects.filter(parent=parentId)
        serializer = InterFaceCaseDataSer(obj, many=True)
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
            interface_name = InterFaceSet.objects.filter(id=id).first().interface_name
            dic["interface_name"] = interface_name
            dic["interface_id"] = id
            dic["parent"] = parent
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
            删除系统分类
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
        obj = InterFaceCaseData.objects.filter(id=pk).first()
        for i in data.keys():
            try:
                if i == "interface_name":
                    serializer = InterfaceNameSer(obj, data=data)
                elif i == "description":
                    serializer = DescriptionSer(obj, data=data)
                elif i == "head":
                    serializer = HeadSer(obj, data=data)
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
        data = request.data
        id_list =  json.loads(data["id"])
        system = data.get("system","")
        ip = data.get("ip","")
        print(id_list)
        if not id_list:
            error_code["error"] = "暂不支持将依赖的接口加入到Loucst中测试"
            return Response(error_code)
        interface_id_list = InterFaceCaseData.objects.filter(id__in=id_list).values_list("interface_id", flat=True)
        print(interface_id_list)
        locust_dic = {}
        num = 1
        for id in interface_id_list:
            dic = {}
            obj = InterFaceSet.objects.get(id=id)
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
            os.system("nohup locust -f easy/common/locustTest.py --host={} &".format(ip))
        #win
        elif system == "Windows":
            os.system("locust -f easy/common/locustTest.py --host={}".format(ip))
            right_code["msg"] = "Locust已经开启"
        return Response(right_code)

