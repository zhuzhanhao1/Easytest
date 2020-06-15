from time import time
from django.core.paginator import Paginator
from easy.models import InterFaceCase, InterFaceCaseData, InterFaceSet
from .interfaceCaseSer import InterFaceCaseSer, DescriptionSer
from .interfaceManageSer import ResultTimeSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from easy.common.interfaceRun import InterfaceRun
import json


class InterfaceCase(APIView):

    def get(self, request, *args, **kwargs):
        obj = InterFaceCase.objects.filter()
        serializer = InterFaceCaseSer(obj, many=True)
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

    def put(self, request, pk, *args, **kwargs):
        data = request.data
        obj = InterFaceCase.objects.filter(id=pk).first()
        for i in data.keys():
            try:
                if i == "interface_case_name":
                    serializer = InterFaceCaseSer(obj, data=data)
                elif i == "description":
                    serializer = DescriptionSer(obj, data=data)
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

    def post(self, request, *args, **kwargs):
        '''
            添加接口
        '''
        data = request.data
        try:
            serializer = InterFaceCaseSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加接口成功"
                return Response(right_code)
            else:
                error_code['error'] = '接口保存数据库失败'
        except Exception as e:
            print(e)
            error_code["error"] = str(e)
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除系统分类
        '''
        try:
            obj = InterFaceCase.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除用例成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除用例失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class InterfaceCaseRun(APIView):
    num_progress = 0
    failed_num = 0
    failed_ids = []

    def clear_num_progress(self):
        InterfaceCaseRun.num_progress = 0
        return

    def get(self, request, *args, **kwargs):

        '''
        流程进度
        '''
        try:
            print('show_api----------' + str(InterfaceCaseRun.num_progress))
            # 当进度百分百的时候，需要吧全局变量初始化，以便下次请求的时候进度条是重0开始，否则默认都是百分之百了
            if InterfaceCaseRun.num_progress == 100:
                InterfaceCaseRun.num_progress = 0
                return Response(100)
            # 当进度不是百分之百的时候，返回当前进度
            else:
                return Response(InterfaceCaseRun.num_progress)
        except Exception as e:
            return Response(100)

    def post(self, request, *args, **kwargs):
        '''
        执行流程接口
        '''
        datas = request.data
        id_list = json.loads(datas["id_list"])
        for id in id_list:
            interface_id_list = InterFaceCaseData.objects.filter(parent=id).values_list("interface_id",flat=True)
        print("关联的id_list"+str(interface_id_list))
        QuerySet = InterFaceSet.objects.filter(id__in=interface_id_list).values("id","url", "method", "headers","ip","tcp",
                                                                          "params", "body", "depend_id", "depend_key",
                                                                          "replace_key", "replace_position")
        print(QuerySet)
        # depend_key = [{'$..id': 1}, {'$..schemeName': 1}]
        # replace_key = {"$.metadataSchemeId": 1, "$.metadataSchemeName": 1}

        for obj in QuerySet:
            id = obj.get("id","")
            url = obj.get("url","")
            method = obj.get("method", "")
            ip = obj.get("ip", "")
            tcp = obj.get("tcp","")
            headers = obj.get("headers", "")
            params = obj.get("params", "")
            body = obj.get("body", "")
            depend_id = obj.get("depend_id", "")
            depend_key = obj.get("depend_key", "")
            replace_key = obj.get("replace_key", "")
            replace_position = obj.get("replace_position", "")
            #拼接请求的URL
            url = tcp + "://" + ip + "/" + url
            if depend_id:
                pass
            else:
                try:
                    starttime = time()

                    response = InterfaceRun().run_main(method, url, headers, params, body)
                    endtime = time()
                    runtime = int(round(endtime - starttime, 3)*1000)  # 接口执行的消耗时间
                    print("接口执行的消耗时间:" + str(runtime))
                    djson = json.dumps(response,ensure_ascii=False, sort_keys=True, indent=2)
                    print(djson)
                except Exception as e:
                    print("异常的id为:" + str(id) + "," + e)
                    # response = "异常的id为:" + str(id) + "," + e
                id = InterFaceSet.objects.get(id=id)
                data = {"result": djson, "duration": runtime}
                serializer = ResultTimeSer(id, data=data)
                # 在获取反序列化的数据前，必须调用is_valid()方法进行验证，验证成功返回True，否则返回False
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(right_code)