from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import InterFaceCase
from .interfaceManageSer import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django_redis import get_redis_connection
import json
from easy.config.Status import *
from easy.common.interfaceRun import InterfaceRun

class InterfaceCase(APIView):

    def get(self, request, *args, **kwargs):
        obj = InterFaceCase.objects.filter()
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