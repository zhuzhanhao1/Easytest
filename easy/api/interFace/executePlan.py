from time import time
from django.core.paginator import Paginator
from easy.models import ExecutePlan,ExecutePlanCases,RelevanceCaseSet,InterFaceCaseData
from .executePlanSer import ExecutePlanSer,PlanNameSer,StuatusSer,ExecutePlanCasesSer,DescriptionCaseSer,ExecutePlanAllIDSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from easy.config.Status import *
from .interfaceCase import InterfaceCaseRun
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler   #非阻塞
import pytz
import uuid
from easy.common.notification import DingNotice

class ExecutePlanList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            任务计划列表
        '''
        planName = request.GET.get("plan_name","")
        obj = ExecutePlan.objects.filter()
        #如果有搜索内容
        if planName:
            obj = ExecutePlan.objects.filter(plan_name__contains=planName)
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

    def put(self, request, pk, *args, **kwargs):
        '''
            编辑任务计划
        '''
        data = request.data
        print(data)
        obj = ExecutePlan.objects.filter(id=pk).first()
        if len(data) == 1:
            for i in data.keys():
                try:
                    if i == "plan_name":
                        serializer = PlanNameSer(obj, data=data)
                        if serializer.is_valid():
                            serializer.save()
                            right_code["msg"] = "编辑成功"
                            return Response(right_code)
                        else:
                            error_code['error'] = '保存数据到数据库失败'
                except Exception as e:
                    print(e)
                    error_code["error"] = str(e)
        else:
            serializer = ExecutePlanSer(obj, data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "编辑任务计划成功"
                return Response(right_code)
            else:
                error_code['error'] = '保存数据到数据库失败'
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        '''
            添加任务计划
        '''
        data = request.data
        print(data)
        try:
            serializer = ExecutePlanSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加任务计划成功"
                return Response(right_code)
            else:
                error_code['error'] = '保存数据库失败'
        except Exception as e:
            print(e)
            error_code["error"] = str(e)
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除任务计划
        '''
        try:
            obj = ExecutePlan.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除任务计划成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除任务计划失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

class ExecutePlanCasesList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            任务计划列表
        '''
        planName = request.GET.get("plan_name","")
        obj = ExecutePlanCases.objects.filter()
        #如果有搜索内容
        if planName:
            obj = ExecutePlanCases.objects.filter(plan_name__contains=planName)
        serializer = ExecutePlanCasesSer(obj, many=True)
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

    def put(self, request, pk, *args, **kwargs):
        '''
            编辑计划关联用例集
        '''
        data = request.data
        print(data)
        obj = ExecutePlanCases.objects.filter(id=pk).first()
        if len(data) == 1:
            for i in data.keys():
                try:
                    if i == "description":
                        print(1)
                        serializer = DescriptionCaseSer(obj, data=data)
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
            添加任务计划
        '''
        data = request.data
        print(data)
        try:
            serializer =ExecutePlanCasesSer(data=data)
            if serializer.is_valid():
                serializer.save()
                right_code["msg"] = "添加计划关联用例集成功"
                return Response(right_code)
            else:
                error_code['error'] = '保存数据库失败'
        except Exception as e:
            print(e)
            error_code["error"] = str(e)
        return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        '''
            删除任务计划
        '''
        try:
            obj = ExecutePlanCases.objects.filter(id=pk)
            obj.delete()
            right_code["msg"] = "删除计划关联用例集成功"
            return Response(right_code)
        except Exception as e:
            print(e)
            error_code["error"] = "删除计划关联用例集失败"
            return Response(error_code, status=status.HTTP_400_BAD_REQUEST)

class ExecutePlanRun(InterfaceCaseRun):
    num = 0
    '''
        继承运行接口用例的类
    '''
    def determine_ploy(self,ploy):
        '''
            校验ploy参数是否符合cron格式要求
        '''
        if ploy:
            ploy_list = ploy.split(" ")
            print(ploy_list)
            if len(ploy_list) == 6:
                return ploy_list[0],ploy_list[1],ploy_list[2],ploy_list[3],ploy_list[4],ploy_list[5]
            return False,False,False,False,False,False

    def get(self,request,*args,**kwargs):
        '''
            接收前端参数，开始线程执行调度任务
        '''
        id = request.GET.get("id","")
        ploy = request.GET.get("ploy","")
        notification = request.GET.get("notification","")
        start_date = request.GET.get("start_time","")
        end_date = request.GET.get("end_time", "")
        print(start_date,end_date)
        # DayofMonth没有，只支持week(1-53)个星期
        second,minute,hour,week,month,day_of_week = self.determine_ploy(ploy)
        if not second:
            error_code["error"] = "请输入合法的ploy"
            return Response(error_code)
        #查询任务下所有的用例集
        case_set = ExecutePlanCases.objects.filter(parent=id).values_list("relevance_id", flat=True)
        #查询所有用例集下所有的用例
        cases = RelevanceCaseSet.objects.filter(parent__in=case_set).values_list("relevance_id", flat=True)
        #查询所有用例下所有的接口,此查询的结果列表，排序是乱的
        # query_set = InterFaceCaseData.objects.filter(parent__in=query_set).values_list("interface_id", flat=True)
        # 实例化非阻塞模式的调度器
        scheduler = BackgroundScheduler()
        uid = str(uuid.uuid4())
        obj = ExecutePlan.objects.get(id=id)
        scheduler.add_job(self.job_func, 'cron', start_date=start_date,id=uid,month=month,week=week,day_of_week=day_of_week,
                          hour=hour, minute=minute,second=second,args=(cases,end_date,scheduler,uid,notification,obj))
        scheduler.start()

        #将运行状态的标志改为true
        serializer = StuatusSer(obj,{"status":True})
        if serializer.is_valid():
            serializer.save()
        right_code["msg"] = "执行任务已开始"
        return Response(right_code)

    def job_func(self, cases, end_date, scheduler, uid, notification, obj):
        '''
            调度执行任务
        '''
        print("任务结束时间为：" + str(end_date))
        locals_time = datetime.fromtimestamp(int(time()), pytz.timezone('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S')
        print("当前时间为："+str(locals_time))
        title = obj.plan_name

        print("#" * 100)
        if locals_time >= end_date:
            id = scheduler.get_job(uid)
            print(id)
            #移除正在进行的任务
            scheduler.remove_job(uid)
            try:
                DingNotice().send_text_bot(title+"任务已结束，请查看测试报告")
                scheduler.shutdown()
            except Exception as e:
                print(e)
            #将运行状态的标志改为false
            serializer = StuatusSer(obj, {"status": False})
            if serializer.is_valid():
                serializer.save()
            return
        #遍历所有的用例
        for i in cases:
            id_list = InterFaceCaseData.objects.filter(parent=i).values_list("interface_id", flat=True)
            #如果用例下存在接口，则挨个运行
            if id_list:
                for id in id_list:
                    # 调用接口运行类方法runcase()运行接口
                    InterfaceCaseRun().runcase(id, len(id_list))
        if notification:
            self.num += 1
            DingNotice().send_text_bot(title + "第" + str(self.num) + "次运行已结束，请查看测试报告")

