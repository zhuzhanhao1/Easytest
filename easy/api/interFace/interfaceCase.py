from django.core.paginator import Paginator
from easy.models import InterFaceCase
from .interfaceCaseSer import InterFaceCaseSer,DescriptionSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *


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
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})

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