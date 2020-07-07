from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import InterFaceManageClassification, InterFaceManageModule, InterFaceSet
from .interfaceManageSer import InterFaceManageClassificationSer, InterFaceManageModuleSer, \
    UpdateInterFaceManageModuleSer, DependIdSer, DependKeySer, ReplaceKeySer,\
    ReplacePositionSer,ParamsSer,BodySer,InterfaceNameSer,UrlSer,InterfaceAllSer,InterfaceSetSearchSer,TcpSer,IPSer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django_redis import get_redis_connection
import json
from easy.config.Status import *
from easy.common.interfaceRun import InterfaceRun


class InterfaceClassification(APIView):
    '''
        接口分类
    '''

    def get(self, request, *args, **kwargs):
        '''
            返回分类列表
        '''
        classification_list = InterFaceManageClassification.objects.filter().values_list('classification', flat=True)
        return Response(classification_list)

    def delete(self, request, *args, **kwargs):
        '''
            删除系统分类
        '''
        title = request.data
        if title:
            try:
                obj = InterFaceManageClassification.objects.filter(classification=title["title"])
                obj.delete()
                right_code["msg"] = "删除系统分类成功"
                return Response(right_code)
            except Exception as e:
                error_code["error"] = "删除系统分类失败"
        else:
            error_code["error"] = "系统分类不能为空"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        '''
            添加系统分类
        '''
        data = request.data
        try:
            serializer = InterFaceManageClassificationSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加系统分类成功"
                return Response(right_code)
            error_code["error"] = "添加系统分类保存数据库异常"
        except Exception as e:
            error_code["error"] = "添加系统分类失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class InterfaceModule(APIView):

    def get(self, request, *args, **kwargs):
        title = request.GET.get("title", "")
        obj = InterFaceManageModule.objects.filter(parent__classification=title)
        serializer = InterFaceManageModuleSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})

    def put(self, request, pk, *args, **kwargs):
        '''
            编辑模块
        '''
        data = request.data
        try:
            obj = InterFaceManageModule.objects.filter(id=pk).first()
            serializer = UpdateInterFaceManageModuleSer(obj, data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "编辑模块成功"
                return Response(right_code)
            else:
                error_code['error'] = '编辑模板保存数据库失败'
        except Exception as e:
            print(e)
            error_code["error"] = "编辑模块失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        '''
            添加模块
        '''
        data = request.data.copy()
        parent = data["parent"]
        parent_id = InterFaceManageClassification.objects.filter(classification=parent).first().id
        data["parent"] = parent_id
        try:
            serializer = InterFaceManageModuleSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加模块成功"
                return Response(right_code)
            else:
                error_code['error'] = '添加模块保存数据库失败'
        except Exception as e:
            print(e)
            error_code["error"] = "添加模块失败"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除系统分类
        '''
        try:
            obj = InterFaceManageModule.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除模块成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除模块失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class InterfaceSetList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            接口集列表
        '''
        parentId = request.GET.get("parentId", "")
        now_id = request.GET.get("id", "")
        interface_name = request.GET.get("interface_name","")
        obj = InterFaceSet.objects.filter(belong_module=parentId)
        if interface_name:
            obj = InterFaceSet.objects.filter(Q(belong_module=parentId) & Q(interface_name__contains=interface_name))

        if now_id:
            obj = InterFaceSet.objects.filter(Q(belong_module=parentId) & Q(id=now_id))
        serializer = InterfaceAllSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})

    def put(self, request, pk, *args, **kwargs):
        data = request.data
        obj = InterFaceSet.objects.filter(id=pk).first()
        if len(data) == 1:
            for i in data.keys():
                try:
                    if i == "depend_id":
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
                    elif i == "params":
                        serializer = ParamsSer(obj, data=data)
                    elif i == "body":
                        serializer = BodySer(obj, data=data)
                    elif i == "interface_name":
                        serializer = InterfaceNameSer(obj, data=data)
                    elif i == "url":
                        serializer = UrlSer(obj, data=data)
                    elif i == "tcp":
                        serializer = TcpSer(obj, data=data)
                    elif i == "ip":
                        serializer = IPSer(obj, data=data)
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
            try:
                serializer = InterfaceAllSer(obj, data=data)
                if serializer.is_valid():
                    serializer.save()
                    right_code["msg"] = "编辑成功"
                    return Response(right_code)
                else:
                    error_code["error"] = "保存数据到数据库失败"
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
            serializer = InterfaceAllSer(data=data)
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
            obj = InterFaceSet.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除接口成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除接口失败"
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
            return Response(right_code)
        except TypeError as e:
            error_code["error"] = str(e)
            return Response(error_code)


class InterfaceSetSearchList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            接口集列表
        '''
        search_dic = request.GET.get("search_dic","")
        if search_dic:
            kwargs = json.loads(search_dic)
            #处理多字段搜索
            obj = InterFaceSet.objects.filter(**kwargs)
        else:
            obj = InterFaceSet.objects.filter()
        serializer = InterfaceSetSearchSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})



