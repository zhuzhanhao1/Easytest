import json
from time import time
from django.core.paginator import Paginator
from easy.models import ExecutePlanExport
from .executePlanReportSer import ExecutePlanReportSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *



class ExecutePlanReportList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            任务计划列表
        '''
        planName = request.GET.get("plan_name", "")
        obj = ExecutePlanExport.objects.filter()
        # 如果有搜索内容
        if planName:
            obj = ExecutePlanExport.objects.filter(plan_name__contains=planName)
        serializer = ExecutePlanReportSer(obj, many=True)
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

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除任务计划
        '''
        try:
            obj = ExecutePlanExport.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除测试报告成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除测试报告失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)
