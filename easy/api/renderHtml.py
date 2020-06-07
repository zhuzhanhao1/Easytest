from django.shortcuts import render



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
    return render(request, 'processApi.html')