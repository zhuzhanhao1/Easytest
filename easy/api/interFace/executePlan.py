from time import time
from django.core.paginator import Paginator
from easy.models import ExecutePlan
from .executePlanSer import ExecutePlanSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from easy.common.interfaceRun import InterfaceRun
import json
import jsonpath
from django.utils.decorators import method_decorator
from dwebsocket import accept_websocket

class ExecutePlanList(APIView):

    def get(self, request, *args, **kwargs):
        obj = ExecutePlan.objects.filter()
        serializer = ExecutePlanSer(obj, many=True)
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
