import json
from time import time
from django.core.paginator import Paginator
from easy.models import ExecutePlan, ExecutePlanCases, RelevanceCaseSet, \
    InterFaceCaseData, ExecutePlanReport
from .executePlanSer import ExecutePlanSer, PlanNameSer, \
    ExecutePlanCasesSer, DescriptionCaseSer,PlanPloySer,\
    ExecutePlanReporttSer,ReportStuatusSer,ReportCountSer
from .relevanceInterfaceSer import HeadersSer
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
from .interfaceManageSer import HeadersSer
from ...common.interfaceRun import InterfaceRun


class ExecutePlanList(APIView):

    def get(self, request, *args, **kwargs):
        '''
            任务计划列表
        '''
        planName = request.GET.get("plan_name", "")
        obj = ExecutePlan.objects.filter()
        # 如果有搜索内容
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
                    elif i == "ploy":
                        serializer = PlanPloySer(obj, data=data)
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
            任务计划下用例集列表
        '''
        id = request.GET.get("id", "")
        obj = ExecutePlanCases.objects.filter(parent_id=id)
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
            计划下添加用例集
        '''
        data = request.data
        print(data)
        try:
            serializer = ExecutePlanCasesSer(data=data)
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
            删除计划关联用例集
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
    #任务运行的次数
    num = 0

    '''
        继承运行接口用例的类
    '''

    def determine_ploy(self, ploy):
        '''
            校验ploy参数是否符合cron格式要求，要求是6位的格式
        '''
        if ploy:
            ploy_list = ploy.split(" ")
            print(ploy_list)
            if len(ploy_list) == 6:
                return ploy_list[0], ploy_list[1], ploy_list[2], ploy_list[3], ploy_list[4], ploy_list[5]
            return False, False, False, False, False, False

    def get(self, request, *args, **kwargs):
        '''
            接收前端参数，开始线程执行调度任务
        '''
        id = request.GET.get("id", "")
        ploy = request.GET.get("ploy", "")
        notification = request.GET.get("notification", "")
        start_date = request.GET.get("start_time", "")
        end_date = request.GET.get("end_time", "")
        admin_url = request.GET.get("admin_url", "")
        username = request.GET.get("username", "")
        password = request.GET.get("password", "")
        # DayofMonth没有，只支持week(1-53)个星期
        second, minute, hour, week, month, day_of_week = self.determine_ploy(ploy)
        if not second:
            error_code["error"] = "请输入合法的ploy"
            return Response(error_code)
        # 查询任务下所有的用例集
        case_set = ExecutePlanCases.objects.filter(parent=id).values_list("relevance_id", flat=True)
        print("查询任务下所有的用例集:"+str(case_set))
        if not case_set:
            error_code["error"] = "请您先在任务下添加用例集！"
            return Response(error_code)
        # 查询所有用例集下所有的用例
        cases = RelevanceCaseSet.objects.filter(parent__in=case_set).values_list("relevance_id", flat=True)
        print("查询所有用例集下所有的用例:" + str(cases))
        # 查询所有用例下所有的接口,此查询的结果列表，排序是乱的
        interface_id_list = InterFaceCaseData.objects.filter(parent__in=cases).values_list("id", flat=True).distinct()
        print("查询所有用例集下所有的接口:" + str(interface_id_list))
        # # 批量修改执行接口的所有请求头
        # token = self.get_token(interface_id_list,admin_url,username,password)
        # if "error" in token:
        #     return Response(token)
        # 实例化非阻塞模式的调度器
        scheduler = BackgroundScheduler()
        uid = str(uuid.uuid4())
        obj = ExecutePlan.objects.get(id=id)
        #保存报告信息
        dic = {
            "parent":id,
            "status":False,
            "all_case_count":len(cases),
            "start_time":start_date,
            "end_time":end_date
        }
        serializer = ExecutePlanReporttSer(data=dic)
        if serializer.is_valid():
            serializer.save()
        #获取最新一个报告的对象
        report_obj = ExecutePlanReport.objects.filter().last()
        scheduler.add_job(self.job_func,'cron',start_date=start_date,id=uid,month=month,week=week,day_of_week=day_of_week,
                          hour=hour,minute=minute,second=second,
                          args=(cases,end_date,scheduler,uid,notification,obj,interface_id_list,admin_url,username,password,report_obj))
        # 开启调度任务
        scheduler.start()
        job = str(scheduler.get_job(uid))
        print(str(job))
        #获取下次运行的时间节点
        task_notification = job.split(",")[-1][1:-1]
        right_code["msg"] = task_notification
        return Response(right_code)

    def job_func(self,cases,end_date,scheduler,uid,notification,obj,interface_id_list,admin_url,username,password,report_obj):
        '''
            调度执行任务
        '''
        print("任务结束时间为：" + str(end_date))
        locals_time = datetime.fromtimestamp(int(time()), pytz.timezone('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M:%S')
        print("当前时间为：" + str(locals_time))
        title = obj.plan_name
        # 如果当前时间大于结束的时间，则移除任务，且关闭调度器
        if locals_time >= end_date:
            # 移除正在进行的任务
            scheduler.remove_job(uid)
            try:
                if notification != "false":
                    DingNotice().send_text_bot("定时任务：" + title + "已结束，请查看测试报告")
                #将报告状态改为完成（True）
                serializer = ReportStuatusSer(report_obj, {"status": True})
                if serializer.is_valid():
                    serializer.save()
                scheduler.shutdown()
            except Exception as e:
                print(e)
            return
        # 在结束的时间内，遍历所有的用例并执行
        fail_case_count = 0
        fail_interface_count = 0
        all_interface_count = 0
        for i in cases:
            fail_interface = []
            id_list = InterFaceCaseData.objects.filter(parent=i).values_list("id", flat=True)
            # 如果用例下存在接口，则挨个运行
            if id_list:
                process_dict, status_code = InterfaceCaseRun().runcase(id_list[0], len(id_list))
                print("返回的状态码为:"+str(status_code))
                # 如果token过期了，则重新获取一次
                if status_code == 401:
                    token = self.get_token(interface_id_list, admin_url, username, password)
                    if "error" in token:
                        scheduler.remove_job(uid)
                        DingNotice().send_text_bot(title + "：任务下获取Token失败，请留意！！！")
                        return
                    print("任务下获取Token成功")
                for id in id_list:
                    # 调用接口运行类方法runcase()运行接口
                    all_interface_count += 1
                    process_dict, status_code = InterfaceCaseRun().runcase(id, len(id_list))
                    if status_code != 200:
                        fail_interface.append(id)
                        fail_interface_count += 1
                        interface_name = process_dict["interface_execute_now"]
                        DingNotice().send_text_bot(interface_name + "接口执行异常，请留意！！！")
                if len(fail_interface) > 0:
                    fail_case_count += 1
                    fail_interface.clear()
        count_dic = {
            "fail_case_count":fail_case_count,
            "fail_interface_count":fail_interface_count,
            "all_interface_count":all_interface_count
        }
        serializer = ReportCountSer(report_obj,count_dic)
        if serializer.is_valid():
            serializer.save()
        # 每次运行完一次任务，则清空success_id_list
        InterfaceCaseRun.success_id_list.clear()
        # 需要消息通知时，每次结束发送当前任务进度
        self.num += 1
        if notification != "false":
            DingNotice().send_text_bot(title + "：第" + str(self.num) + "次运行已完成，请查看测试报告")
        print("#" * 50 + "第" + str(self.num)  + "次(" + title + ")执行计划运行已完成，可查看测试报告" + "#" * 50)

    def get_token(self, interface_id_list, admin_url, username, password):
        '''
            获取token后，批量修改请求头的参数
        '''
        method = "POST"
        headers = '{"content-type":"application/json"}'
        data = {
            "loginName": username,
            "password": password
        }
        data = json.dumps(data)
        try:
            response_headers, response_body, duration, status_code = InterfaceRun().run_main(method, admin_url, headers, '', data)
            headers = {"content-type": "application/json","accessToken": response_body["accessToken"]}
            print(headers)
            #替换所有的请求头
            for pk in interface_id_list:
                obj = InterFaceCaseData.objects.filter(id=pk).first()
                try:
                    data_ser = {"headers": json.dumps(headers)}
                    serializer = HeadersSer(obj, data=data_ser)
                    if serializer.is_valid():
                        serializer.save()
                except Exception as e:
                    print(e)
            return headers
        except Exception as e:
            print(e)
            error_code["error"] = "执行任务前更新headers失败"
            return error_code
