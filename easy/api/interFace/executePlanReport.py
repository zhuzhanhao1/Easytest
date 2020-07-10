from django.core.paginator import Paginator
from easy.models import ExecutePlanReport,ExecutePlanCases,ExecutePlan,InterfaceCaseSet,InterFaceCaseData,InterFaceSet
from .executePlanReportSer import ExecutePlanReportSer,ReportDetailTreeSer,InterFaceSetSer
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
        obj = ExecutePlanReport.objects.filter().order_by("-id")
        # 如果有搜索内容
        if planName:
            obj = ExecutePlanReport.objects.filter(plan_name__contains=planName).order_by("-id")
        serializer = ExecutePlanReportSer(obj, many=True)
        pageindex = request.GET.get('page', 1)  # 页数
        pagesize = request.GET.get("limit", 10)  # 每页显示数量
        pageInator = Paginator(serializer.data, pagesize)
        # 分页
        contacts = pageInator.page(pageindex)
        res = []
        for contact in contacts:
            res.append(contact)
        return Response(data={"code": 0,"msg": "","count": len(serializer.data),"data": res})

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除任务计划
        '''
        try:
            obj = ExecutePlanReport.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除测试报告成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除测试报告失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)


class ReportDetail(APIView):

    def get(self, request, *args, **kwargs):
        '''
            任务计划列表
        '''
        #报告的id
        parentId = request.GET.get("parentId","")
        id = request.GET.get("id","")
        if parentId:
            #查询出执行计划的id
            id = ExecutePlan.objects.filter(id=parentId).first().id
            #查询出执行任务下所有的接口集id
            ids = ExecutePlanCases.objects.filter(parent=id).values_list("relevance_id",flat=True)
            #查询出相关联所有接口集
            obj = InterfaceCaseSet.objects.filter(id__in=ids)
            #返回树格式
            menu_data = ReportDetailTreeSer(obj, many=True).data
            return Response(menu_data)
        elif id:
            ids = InterFaceCaseData.objects.filter(parent=id).values_list("interface_id",flat=True)
            print(ids)
            obj = InterFaceSet.objects.filter(id__in=ids)
            print(obj)
            serializer = InterFaceSetSer(obj, many=True)
            pageindex = request.GET.get('page', 1)  # 页数
            pagesize = request.GET.get("limit", 10)  # 每页显示数量
            pageInator = Paginator(serializer.data, pagesize)
            # 分页
            contacts = pageInator.page(pageindex)
            res = []
            for contact in contacts:
                res.append(contact)
            return Response(data={"code": 0,"msg": "","count": len(serializer.data),"data": res})


class echartsReport(APIView):

    def get(self, request, *args, **kwargs):
        reportId = request.GET.get("reportId", "")
        flag = request.GET.get("id", "")
        if flag == "cases":
            obj = ExecutePlanReport.objects.filter(id=reportId).first()
            all_case_count = obj.all_case_count
            fail_case_count= obj.fail_case_count
            if all_case_count and fail_case_count:
                data = [{"name": '成功', "y": all_case_count - fail_case_count}, {"name": '失败', "y": fail_case_count}]
            else:
                data = [{"name": '未执行完',"y": 100}]
        elif flag =="interface" :
            obj = ExecutePlanReport.objects.filter(id=reportId).first()
            all_interface_count = obj.all_interface_count
            fail_interface_count= obj.fail_interface_count
            if all_interface_count and fail_interface_count:
                data = [{"name": '成功',"y": all_interface_count-fail_interface_count}, {"name": '失败',"y": fail_interface_count}]
            else:
                data = [{"name": '未执行完',"y": 100}]
        else:
            obj = ExecutePlanReport.objects.filter().order_by("-id")[0:10]
            data = []
            if obj:
                for i in obj:
                    all_case_count = i.all_case_count
                    fail_case_count = i.fail_case_count
                    if not fail_case_count:
                        fail_case_count = 0
                    pass_rate = int((all_case_count - fail_case_count) / all_case_count * 100)
                    data.append(pass_rate)
        return Response(data)
