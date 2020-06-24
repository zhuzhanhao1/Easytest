from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import InterfaceCaseSet,RelevanceCaseSet,InterFaceCase
from .interfaceCaseSetMangeSer import InterfaceCaseSetMangeSer,RelevanceCaseSetSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from easy.config.Status import *



class InterfaceCaseSetList(APIView):


    def get(self, request, *args, **kwargs):
        '''
            用例集列表
        '''
        classification_list = InterfaceCaseSet.objects.filter().values_list('interface_case_set_name', flat=True)
        return Response(classification_list)

    def delete(self, request, *args, **kwargs):
        '''
            删除用例集
        '''
        title = request.data
        if title:
            try:
                obj = InterfaceCaseSet.objects.filter(interface_case_set_name=title["title"])
                obj.delete()
                right_code["msg"] = "删除用例集成功"
                return Response(right_code)
            except Exception as e:
                error_code["error"] = str(e)
        else:
            error_code["error"] = "系统分用例集为空"
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        '''
            添加用例集
        '''
        data = request.data
        try:
            serializer = InterfaceCaseSetMangeSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加用例集成功"
                return Response(right_code)
            error_code["error"] = "添加用例集保存数据库异常"
        except Exception as e:
            error_code["error"] = str(e)
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class RelevanceCaseSetList(APIView):
    '''
        接口分类
    '''

    def get(self, request, *args, **kwargs):
        '''
            获取用例集关联用例列表
        '''
        title = request.GET.get("title", "")
        interface_case_name = request.GET.get("interface_case_name", "")
        obj = RelevanceCaseSet.objects.filter(parent__interface_case_set_name=title)
        if interface_case_name:
            obj = RelevanceCaseSet.objects.filter(Q(parent__interface_case_set_name=title) & Q(interface_case_name__contains=interface_case_name))
        serializer = RelevanceCaseSetSer(obj, many=True)
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
        '''
            添加用例集关联用例
        '''
        data = request.data
        relevance_ids = data.get("relevance_ids","")
        parent = data.get("parent","")
        parent_id = InterfaceCaseSet.objects.filter(interface_case_set_name=parent).first().id
        for id in json.loads(relevance_ids):
            dic = {}
            obj = InterFaceCase.objects.filter(id=id).first()
            dic["interface_case_name"] = obj.interface_case_name
            dic["description"] = obj.description
            dic["parent"] = parent_id
            dic["relevance_id"] = id
            print(dic)
            serializer = RelevanceCaseSetSer(data=dic)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加关联用例成功"
            else:
                error_code['error'] = '关联用例保存数据库失败'
                return Response(error_code)
        return Response(right_code)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除用例集关联用例
        '''
        try:
            obj = RelevanceCaseSet.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除用例集关联用例成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除用例集关联用例失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
