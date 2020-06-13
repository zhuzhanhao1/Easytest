from django.shortcuts import render
from easy.models import InterFaceManageModule,InterFaceCase

def login_views(request):
    '''
        登录页
    '''
    return render(request, 'login.html')

def index_views(request):
    '''
        主页面
    '''
    return render(request, 'index.html')

#以下都是内嵌的iframe
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
    parentId = request.GET.get("parentId","")
    puisne_module = InterFaceManageModule.objects.get(id=parentId)
    return render(request, 'interfaceSet.html',{"parentId":parentId,"puisne_module":puisne_module})

def interface_case_views(request):
    '''
        接口用例
    '''
    return render(request, 'interfaceCase.html')

def relevance_interface_views(request):
    '''
        接口用例
    '''
    parentId = request.GET.get("parentId","")
    interface_case_name = InterFaceCase.objects.get(id=parentId)
    return render(request, 'relevanceInterface.html',{"parentId":parentId,"interface_case_name":interface_case_name})