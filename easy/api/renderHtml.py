from django.shortcuts import render, redirect
from easy.models import InterFaceManageModule, InterFaceCase
from django.contrib import auth
import requests


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
        # if user_obj:
        #     print("当前登录用户已存在！")
        # else:
        #     password = make_password("admin")
        #     user = User.objects.create(
        #         username=pypinyin.slug(user_info["nick"], separator="") + str(random.randint(0, 9999)),
        #         password=password, first_name=user_info["nick"])
        #     userprofile = UserProfile.objects.create(user=user, openId=openid, unionid=unionid)
        #     print(userprofile)
        # user = UserProfile.objects.get(unionid=unionid)
        # user = User.objects.get(id=user.user_id)
        # request.session['username'] = user.username  # 登录成功后，用户登录信息存>放于session
        # request.session.set_expiry(86400)  # 设置登录过期时间
        # print(request.session)
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
    return render(request, 'home.html')


def interface_manager_views(request):
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
    return render(
        request, 'interfaceSet.html', {
            "parentId": parentId, "puisne_module": puisne_module})


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
    interface_case_name = InterFaceCase.objects.get(id=parentId)
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