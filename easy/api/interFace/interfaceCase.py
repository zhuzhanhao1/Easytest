from django.core.paginator import Paginator
from easy.models import InterFaceCase, InterFaceCaseData, InterFaceSet
from .interfaceCaseSer import InterFaceCaseSer, DescriptionSer
from .interfaceManageSer import ResultTimeSer,HeadersSer,IPSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from easy.common.interfaceRun import InterfaceRun
import json
import jsonpath
from django.utils.decorators import method_decorator
from dwebsocket import accept_websocket

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
    process_num = 0
    success_id_list = []

    def runcase(self,id,all_num):
        '''
            运行接口
        '''
        QuerySet = InterFaceSet.objects.get(id=id)
        id = QuerySet.id
        url = QuerySet.url
        method = QuerySet.method
        ip = QuerySet.ip
        tcp = QuerySet.tcp
        headers = QuerySet.headers
        params = QuerySet.params
        body = QuerySet.body
        depend_id = QuerySet.depend_id
        depend_key = QuerySet.depend_key
        replace_key = QuerySet.replace_key
        # 发送消息
        self.process_num += 1
        num_progress = int(self.process_num / all_num * 100)
        process_dict = {"num_progress": num_progress, "interface_execute_now": QuerySet.interface_name}
        print(process_dict)
        # 拼接请求的URL
        url = tcp + "://" + ip + "/" + url
        if depend_id:
            params = json.loads(params) if any(params) else ""
            body = json.loads(body) if any(body) else ""
            # 依赖的id列表
            depend_id = depend_id.split(",")
            # 替换的{jsonpath：0}的字典，和只包换[jsonpath]语法键的列表
            replace_jsonpath_dict = json.loads(replace_key)
            replace_jsonpath_list = [key for key in replace_jsonpath_dict]
            # 依赖的{jsonpath：0}的字典或[{jsonpath：0},{jsonpath：0}]的列表，
            depend_jsonpath = json.loads(depend_key)
            # 定义三个（替换结果，依赖结果，替换区域）列表
            depend_values = []
            replace_values = []
            replace_areas = []
            try:
                for num in range(len(depend_id)):
                    if int(depend_id[num]) not in self.success_id_list:
                        print("流程依赖的接口" + str(depend_id[num]) + "出错了")
                        error_code["error"] = "sorry我所依赖的序号为" + depend_id[num] + "的接口出错了哦"
                        continue

                    print("依赖取值开开始。。。。")
                    dependId = InterFaceSet.objects.get(id=depend_id[num])
                    depend_result = json.loads(dependId.result)
                    # 获取需要替换的jsonpath[key]的结果，转为字典，字典的键放入一个列表存储。
                    if isinstance(depend_jsonpath, list):
                        depend_jsonpath_key_dict = depend_jsonpath[num]
                        depend_jsonpath_key_list = [key for key in depend_jsonpath_key_dict]
                    else:
                        depend_jsonpath_key_dict = depend_jsonpath
                        depend_jsonpath_key_list = [key for key in depend_jsonpath_key_dict]
                    # 通过jsonpath将依赖的值从依赖的接口返回结果中替换出来
                    depend_value = jsonpath.jsonpath(depend_result, depend_jsonpath_key_list[0])[
                        depend_jsonpath_key_dict[depend_jsonpath_key_list[0]]]
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

            # 字符串替换replace（需要替换的内容，新的内容）
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

        # 如果没有依赖的话，直接运行接口执行方法
        try:
            response_headers, response_body, duration, status_code = InterfaceRun().run_main(method=method,
                                                                                             url=url,
                                                                                             headers=headers,
                                                                                             params=params,
                                                                                             data=body)
            print(status_code)
        except Exception as e:
            print("request请求接口异常")
            print(e)
        try:
            djson = json.dumps(response_body, ensure_ascii=False, sort_keys=True, indent=2)
            ResultTimeObj = InterFaceSet.objects.get(id=id)
            data = {"result": djson, "duration": duration}
            serializer = ResultTimeSer(ResultTimeObj, data=data)
            # 在获取反序列化的数据前，必须调用is_valid()方法进行验证，验证成功返回True，否则返回False
            if serializer.is_valid():
                serializer.save()
                # 保存成功后，将成功的id存入列表
                if int(status_code) == 200:
                    self.success_id_list.append(id)
                print(self.success_id_list)
                print("*" * 100)
            else:
                print("保存数据库失败，这里之后用日志替换打印")
        except Exception as e:
            pass
        # 将状态码一并返回
        return process_dict,status_code

    @method_decorator(accept_websocket)
    def get(self, request, *args, **kwargs):
        '''
        执行流程接口
        '''
        try:
            if request.is_websocket():
                print("websocket连接已建立")
                for message in request.websocket:
                    id_list = json.loads(message.decode())
                    print(id_list)
                    # 获取用例依赖的关联结果集
                    interface_id_list = InterFaceCaseData.objects.filter(parent__in=id_list).values_list("interface_id",flat=True)
                    print("关联的id_list" + str(interface_id_list))
                    all_num = len(interface_id_list)
                    for id in interface_id_list:
                        process_dict,status_code = self.runcase(id,all_num)
                        process_dict["status_code"] = status_code
                        request.websocket.send(str.encode(json.dumps(process_dict)))
        except Exception as e:
            print(e)
        right_code["msg"] = "接口用例运行结束"
        return Response(right_code)

class InterfaceBacthUpdate(APIView):

    def get(self, request, *args, **kwargs):
        '''
            获取token并返回页面重载
        '''
        url = request.GET.get("admin_url","")
        username = request.GET.get("username", "")
        password = request.GET.get("password", "")
        method = "POST"
        headers = '{"content-type":"application/json"}'
        data = {
            "loginName": username,
            "password": password
        }
        data = json.dumps(data)
        try:
            response_headers, response_body, duration, status_code = InterfaceRun().run_main(method,url,headers,'',data)
            right_code["msg"] = "获取AccessToken成功"
            res = {"content-type":"application/json","accessToken":response_body["accessToken"]}
            right_code["data"] = json.dumps(res,ensure_ascii=False, sort_keys=True, indent=2)
            return Response(right_code)
        except Exception as e:
            error_code["error"] = str(e)
            return Response(error_code)

    def post(self,request,*args,**kwargs):
        '''
            批量修改IP或headers
        '''
        data = request.data
        key = data.get("key","")
        value = data.get("value","")
        id_list = json.loads(data["id_list"])
        #如果勾选了多选框修改
        if not id_list:
            id_list = InterFaceCase.objects.filter().values_list("id", flat=True)
        interface_id_list = InterFaceCaseData.objects.filter(parent__in=id_list).values_list("interface_id", flat=True).distinct()
        print(interface_id_list)
        #如果未勾选多选框修改

        for pk in interface_id_list:
            obj = InterFaceSet.objects.filter(id=pk).first()
            try:
                if key == "headers":
                    data_ser = {"headers":value}
                    serializer = HeadersSer(obj, data=data_ser)
                elif key == "ip":
                    data_ser = {"ip": value}
                    serializer = IPSer(obj, data=data_ser)
                if serializer.is_valid():
                    serializer.save()
                else:
                    error_code['error'] = '保存数据到数据库失败'
                    return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                error_code["error"] = str(e)
                return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
        right_code["msg"] = "批量修改成功"
        return Response(right_code)

class InterfaceSetSearchList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            接口集列表
        '''
        search_dic = request.GET.get("search_dic","")
        if search_dic:
            kwargs = json.loads(search_dic)
            #处理多字段搜索
            obj = InterFaceCase.objects.filter(**kwargs)
        else:
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
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})




