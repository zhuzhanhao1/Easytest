from django.core.paginator import Paginator
from easy.models import InterFaceCaseData
from .relevanceInterfaceSer import InterFaceCaseDataSer
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
        return Response(data={"code": 0, "msg": "", "count": len(serializer.data), "data": res})
