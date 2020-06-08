from django.shortcuts import render
from easy.models import InterFaceManageModule


def index_views(request):
    '''
        首页
    '''
    return render(request, 'index.html')

def home_views(request):
    '''
        首页iframe
    '''
    return render(request, 'search.html')


def interface_manager_views(request):
    '''
        接口管理
    '''
    return render(request, 'interfaceManage.html')

def interface_set_views(request):
    '''
        接口管理
    '''
    parentId = request.GET.get("parentId","")
    puisne_module = InterFaceManageModule.objects.get(id=parentId).puisne_module
    print(parentId)
    return render(request, 'processApi.html',{"parentId":parentId,"puisne_module":puisne_module})