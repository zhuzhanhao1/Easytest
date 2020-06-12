from django.conf.urls import url

#导入api相关模块
from easy.api.Menu import Menu
from easy.api.interFace import interfaceManage


urlpatterns = [

    url(r'menu/$', Menu.MainMenuApi.as_view()),

    #接口分类管理
    url(r'interface_manager/get_classification/$', interfaceManage.InterfaceClassification.as_view()),
    url(r'interface_manager/add_classification/$', interfaceManage.InterfaceClassification.as_view()),
    url(r'interface_manager/del_classification/$', interfaceManage.InterfaceClassification.as_view()),
    url(r'interface_manager/puisne_module_list/$', interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/add_puisne_module/$', interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/update_puisne_module/(?P<pk>[0-9]+)/$', interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/del_puisne_module/(?P<pk>[0-9]+)/$', interfaceManage.InterfaceModule.as_view()),
    #接口集增删改查
    url(r'interface_set/list/$', interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/add_interface/$', interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/update_interface/(?P<pk>[0-9]+)/$', interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/del_interface/(?P<pk>[0-9]+)/$', interfaceManage.InterfaceSetList.as_view()),

    url(r'interface_set/debug_test/$', interfaceManage.RunInterfaceDebugTest.as_view()),
    url(r'interface_set/test/$', interfaceManage.RunInterfaceDebugTest.as_view()),

    url(r'interface_case/list/$', interfaceManage.InterfaceSetList.as_view()),
]

