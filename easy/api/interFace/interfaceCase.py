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
import jsonpath


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
        interface_id_list = []
        for id in id_list:
            interface_id_list = InterFaceCaseData.objects.filter(parent=id).values_list("interface_id",flat=True)
        print("关联的id_list"+str(interface_id_list))
        #获取用例依赖的关联结果集
        QuerySet = InterFaceSet.objects.filter(id__in=interface_id_list).values("id","url", "method", "headers","ip","tcp",
                                                                          "params", "body", "depend_id", "depend_key",
                                                                          "replace_key")
        #遍历用例关联的接口集
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
            #拼接请求的URL
            url = tcp + "://" + ip + "/" + url
            if depend_id:
                #依赖的id列表
                depend_id = depend_id.split(",")
                #替换的{jsonpath：0}的字典，和只包换[jsonpath]语法键的列表
                replace_jsonpath_dict = json.loads(replace_key)
                replace_jsonpath_list = [key for key in replace_jsonpath_dict]
                #依赖的{jsonpath：0}的字典或[{jsonpath：0},{jsonpath：0}]的列表，
                depend_jsonpath= json.loads(depend_key)
                #定义三个（替换结果，依赖结果，替换区域）列表
                depend_values = []
                replace_values = []
                replace_areas = []
                try:
                    for num in range(len(depend_id)):
                        print("依赖取值开开始。。。。")
                        dependId = InterFaceSet.objects.get(id=depend_id[num])
                        depend_result = json.loads(dependId.result)
                        # 获取需要替换的jsonpath[key]的结果，转为字典，字典的键放入一个列表存储。
                        if isinstance(depend_jsonpath,list):
                            depend_jsonpath_key_dict = depend_jsonpath[num]
                            depend_jsonpath_key_list = [key for key in depend_jsonpath_key_dict]
                        else:
                            depend_jsonpath_key_dict = depend_jsonpath
                            depend_jsonpath_key_list = [key for key in depend_jsonpath_key_dict]
                        # 通过jsonpath将依赖的值从依赖的接口返回结果中替换出来
                        depend_value = jsonpath.jsonpath(depend_result, depend_jsonpath_key_list[0])[depend_jsonpath_key_dict[depend_jsonpath_key_list[0]]]
                        # 如果替换后的内容仍为列表则再次索引第一个位子
                        if type(depend_value) is list:
                            depend_value = depend_value[0]
                        depend_values.append(depend_value)
                        print("所有依赖值的列表集" + str(depend_values))

                        # 替换区域的值，0是Query，1是body
                        replace_area = replace_jsonpath_dict[replace_jsonpath_list[num]]
                        replace_value = []
                        if replace_area == 0:
                            # 说明需要替换的位置在Query内,默认索引是0
                            replace_value = jsonpath.jsonpath(params, replace_jsonpath_list[num])[0]
                        elif replace_area == 1:
                            replace_value = jsonpath.jsonpath(body, replace_jsonpath_list[num])[0]
                        if isinstance(replace_value, list):
                            replace_value = replace_value[0]
                        replace_values.append(replace_value)
                        replace_areas.append(replace_area)
                        print("所有替换值的列表集" + str(replace_value))
                        print("所有替换值的区域列表集" + str(replace_areas))
                except Exception as e:
                    print("获取依赖结果值或获取请求中需要替换的值失败")
                    print(e)


                #字符串替换replace（需要替换的内容，新的内容）
                try:
                    params = json.dumps(params, ensure_ascii=False, sort_keys=True, indent=2)
                    body = json.dumps(body, ensure_ascii=False, sort_keys=True, indent=2)
                    for index in range(len(replace_areas)):
                        if replace_areas[index] == 0:
                            params = params.replace(replace_values[index], depend_values[index])
                        elif replace_areas[index] == 1:
                            body = body.replace(replace_values[index], depend_values[index])
                except Exception as e:
                    print("字符串替换异常")
                    print(e)

            #如果没有依赖的话，直接运行接口执行方法
            try:
                response_headers, response_body, duration, status_code = InterfaceRun().run_main(method=method, url=url, headers=headers, params=params, data=body)
            except Exception as e:
                print("request请求接口异常")
                print(e)
                # response = "异常的id为:" + str(id) + "," + e
            djson = json.dumps(response_body, ensure_ascii=False, sort_keys=True, indent=2)
            ResultTimeObj = InterFaceSet.objects.get(id=id)
            data = {"result": djson, "duration": duration}
            serializer = ResultTimeSer(ResultTimeObj, data=data)
            # 在获取反序列化的数据前，必须调用is_valid()方法进行验证，验证成功返回True，否则返回False
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(right_code)