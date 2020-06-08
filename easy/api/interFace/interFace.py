from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import InterFaceManageClassification,InterFaceManageModule,InterFaceSet
from .interFaceSer import InterFaceManageClassificationSer,InterFaceManageModuleSer,UpdateInterFaceManageModuleSer,InterFaceSetSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django_redis import get_redis_connection
import json
from easy.config.Status import *

class InterFaceClassification(APIView):
    '''
        接口分类
    '''
    def get(self,request,*args,**kwargs):
        '''
            返回分类列表
        '''
        obj = InterFaceManageClassification.objects.filter()
        classification = [i.classification for i in obj]
        return Response(classification)


    def delete(self,request,*args,**kwargs):
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
        return Response(error_code)


    def post(self,request,*args,**kwargs):
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
        return Response(error_code)

class InterFaceModule(APIView):

    def get(self,request,*args,**kwargs):
        title = request.GET.get("title","")
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

    def put(self,request,pk,*args,**kwargs):
        '''
            编辑模块
        '''
        data = request.data
        try:
            obj = InterFaceManageModule.objects.filter(id=pk).first()
            serializer = UpdateInterFaceManageModuleSer(obj,data=data)
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

    def post(self,request,*args,**kwargs):
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


    def delete(self,request,pk,*args,**kwargs):
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
            return Response(error_code)

class InterFaceSetList(APIView):

    def get(self,request,*args,**kwargs):
        '''
            接口集列表
        '''
        parentId = request.GET.get("parentId","")
        now_id = request.GET.get("id","")
        obj = InterFaceSet.objects.filter(belong_module=parentId)
        if now_id:
            obj = InterFaceSet.objects.filter(Q(belong_module=parentId) & Q(id=now_id))
        serializer = InterFaceSetSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})
