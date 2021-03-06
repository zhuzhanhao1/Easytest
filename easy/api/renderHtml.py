from django.shortcuts import render, redirect
from easy.models import InterFaceManageModule, InterFaceCase, InterfaceCaseSet,InterFaceSet,ExecutePlan
from django.contrib import auth
import requests
from django.contrib.auth.decorators import login_required

def login_views(request):
    '''
        登录页
    '''
    return render(request, 'login.html')


def dingding_login_views(request):
    '''
    钉钉扫码登录
    '''
    if request.method == "GET":
        code = request.GET.get('code', )
        appId = 'dingoa6if6q5jqpwb0sndx'
        appSecret = 'bpipZUwfOxppbNHfIJ8gmwmFClBfOmBnteUWPM4mmmXXNXxRTx_NznlxpC8M0F_1'

        token = requests.get(
            'https://oapi.dingtalk.com/sns/gettoken?appid={appId}&appsecret={appSecret}'.format(appId=appId,
                                                                                                appSecret=appSecret))
        access_token = token.json()["access_token"]

        tmp_auth_code = requests.post(
            "https://oapi.dingtalk.com/sns/get_persistent_code?access_token={access_token}".format(
                access_token=access_token), json={
                "tmp_auth_code": code})
        tmp_code = tmp_auth_code.json()
        print(tmp_code)

        openid = tmp_code['openid']
        persistent_code = tmp_code['persistent_code']
        sns_token_request = requests.post(
            "https://oapi.dingtalk.com/sns/get_sns_token?access_token={access_token}".format(
                access_token=access_token), json={
                "openid": openid, "persistent_code": persistent_code})

        sns_token = sns_token_request.json()['sns_token']
        print(sns_token)

        user_info_request = requests.get(
            'https://oapi.dingtalk.com/sns/getuserinfo?sns_token={sns_token}'.format(sns_token=sns_token))
        user_info = user_info_request.json()['user_info']
        print(user_info)
        return redirect('/index/')
    else:
        return render(request, 'login.html')


def logout_views(request):
    # 这个相当于把这个requets里面的user给清除掉，清除掉session_id,注销掉用户
    auth.logout(request)
    # 删除Redis缓存的所有数据
    # get_redis_connection("default").flushall()
    request.session.flush()
    # 将session的数据都删除,并且cookies也失效
    return redirect('/login/')


def index_views(request):
    '''
        主页面
    '''
    return render(request, 'index.html')

# 以下都是内嵌的iframe
def home_views(request):
    '''
        首页
    '''
    case_coount = InterFaceCase.objects.filter().count()
    case_set_coount = InterfaceCaseSet.objects.filter().count()
    interface_coount = InterFaceSet.objects.filter().count()
    plan_coount = ExecutePlan.objects.filter().count()
    dic = {
        "case_coount":case_coount,
        "case_set_coount": case_set_coount,
        "interface_coount": interface_coount,
        "plan_coount": plan_coount,
    }
    return render(request, 'home.html',dic)

def menu_manage_views(request):
    '''
        接口管理
    '''
    return render(request, 'menuManage.html')

def interface_manage_views(request):
    '''
        接口管理
    '''
    return render(request, 'interfaceManage.html')


def interface_set_views(request):
    '''
        接口集
    '''
    parentId = request.GET.get("parentId", "")
    puisne_module = InterFaceManageModule.objects.get(id=parentId)
    return render(request, 'interfaceBase.html', {"parentId": parentId, "puisne_module": puisne_module})


def interface_case_views(request):
    '''
        接口用例
    '''
    return render(request, 'interfaceCaseManage.html')


def relevance_interface_views(request):
    '''
        接口用例
    '''
    parentId = request.GET.get("parentId", "")
    interface_case_name = InterFaceCase.objects.get(id=parentId).interface_case_name
    return render(
        request, 'relevanceInterface.html', {
            "parentId": parentId, "interface_case_name": interface_case_name})


def interface_search_views(request):
    '''
        接口检索
    '''
    parentId = request.GET.get("parentId", "")
    return render(request, 'interfaceSearch.html', {"parentId": parentId})


def interface_case_set_manage_views(request):
    '''
        接口用例集管理
    '''
    return render(request, 'interfaceCaseSetManage.html')


def interface_case_search_views(request):
    '''
        接口检索
    '''
    parentId = request.GET.get("parentId", "")
    return render(request, 'interfaceCaseSearch.html', {"parentId": parentId})

def execute_plan_views(request):
    '''
        接口用例集管理
    '''
    return render(request, 'executePlan.html')

def interface_test_report_views(request):
    '''
        测试报告
    '''
    return render(request, 'executePlanReport.html')

def report_detail_views(request):
    '''
        报告详情
    '''
    parentId = request.GET.get("parentId", "")
    reportId = request.GET.get("reportId", "")
    plan_name = request.GET.get("plan_name", "")
    start_time = request.GET.get("start_time", "")
    end_time = request.GET.get("end_time", "")
    dic = {
        "parentId":parentId,
        "reportId":reportId,
        "plan_name":plan_name,
        "start_time":start_time,
        "end_time":end_time
    }
    return render(request, 'reportDetail.html', dic)

def echart_report_views(request):
    '''
        内容ifame-报表
    '''
    return render(request, 'pyechartReport.html')

def fail_views(request):
    '''
        主页面
    '''
    return render(request, '404.html')

