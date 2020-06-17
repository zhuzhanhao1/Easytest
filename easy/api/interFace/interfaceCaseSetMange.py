from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import InterfaceCaseSet
from .interfaceCaseSetMangeSer import InterfaceCaseSetMangeSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from easy.config.Status import *



class InterfaceCaseSetClassification(APIView):
    '''
        接口分类
    '''

    def get(self, request, *args, **kwargs):
        '''
            返回分类列表
        '''
        classification_list = InterfaceCaseSet.objects.filter().values_list('interface_case_set_name', flat=True)
        return Response(classification_list)

    def delete(self, request, *args, **kwargs):
        '''
            删除系统分类
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
            添加系统分类
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




