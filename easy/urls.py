from django.conf.urls import url

#导入api相关模块
from easy.api.Menu import Menu
from easy.api.interFace import interFace


urlpatterns = [
    url(r'menu/$', Menu.MainMenuApi.as_view()),

    url(r'interface_manager/get_classification/$', interFace.InterfaceClassification.as_view()),
    url(r'interface_manager/add_classification/$', interFace.InterfaceClassification.as_view()),
    url(r'interface_manager/del_classification/$', interFace.InterfaceClassification.as_view()),

    url(r'interface_manager/puisne_module_list/$', interFace.InterfaceModule.as_view()),
    url(r'interface_manager/add_puisne_module/$', interFace.InterfaceModule.as_view()),
    url(r'interface_manager/update_puisne_module/(?P<pk>[0-9]+)/$', interFace.InterfaceModule.as_view()),
    url(r'interface_manager/del_puisne_module/(?P<pk>[0-9]+)/$', interFace.InterfaceModule.as_view()),

    url(r'interface_set/list/$', interFace.InterfaceSetList.as_view()),
    url(r'interface_set/debug_test/$', interFace.RunInterfaceDebugTest.as_view()),
]

