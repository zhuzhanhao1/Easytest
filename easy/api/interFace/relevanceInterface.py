import json
from django.core.paginator import Paginator
from easy.models import InterFaceCaseData,InterFaceSet
from .relevanceInterfaceSer import InterFaceCaseDataSer,AddRelevanceInterfaceSer,\
    DescriptionSer,InterfaceNameSer,HeadSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *


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