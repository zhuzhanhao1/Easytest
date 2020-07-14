from django.conf.urls import url

# 导入api相关模块
from easy.api.Menu import Menu
from easy.api.interFace import interfaceManage, interfaceCase, \
    relevanceInterface,public,interfaceCaseSetMange,executePlan,executePlanReport


urlpatterns = [
    #左侧菜单
    url(r'menu/$', Menu.MainMenuApi.as_view()),
    #主菜单管理
    url(r'menu_manage/main_list/$', Menu.MenuManageMainList.as_view()),
    url(r'menu_manage/add_main_menu/$', Menu.MainMenuApi.as_view()),
    url(r'menu_manage/update_main_menu/(?P<pk>[0-9]+)/$', Menu.MenuManageMainList.as_view()),
    url(r'menu_manage/del_main_menu/(?P<pk>[0-9]+)/$', Menu.MenuManageMainList.as_view()),
    #子菜单管理
    url(r'menu_manage/children_list/$', Menu.MenuManageChildrenList.as_view()),
    url(r'menu_manage/add_children_menu/$', Menu.MenuManageChildrenList.as_view()),
    url(r'menu_manage/update_children_menu/(?P<pk>[0-9]+)/$', Menu.MenuManageChildrenList.as_view()),
    url(r'menu_manage/del_children_menu/(?P<pk>[0-9]+)/$', Menu.MenuManageChildrenList.as_view()),
    # 接口分类
    url(r'interface_manager/get_classification/$',interfaceManage.InterfaceClassification.as_view()),
    url(r'interface_manager/add_classification/$',interfaceManage.InterfaceClassification.as_view()),
    url(r'interface_manager/del_classification/$',interfaceManage.InterfaceClassification.as_view()),

    # 接口模块管理
    url(r'interface_manager/puisne_module_list/$',interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/add_puisne_module/$',interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/update_puisne_module/(?P<pk>[0-9]+)/$',interfaceManage.InterfaceModule.as_view()),
    url(r'interface_manager/del_puisne_module/(?P<pk>[0-9]+)/$',interfaceManage.InterfaceModule.as_view()),

    # 接口集增删改查
    url(r'interface_set/list/$', interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/add_interface/$',interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/update_interface/(?P<pk>[0-9]+)/$',interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/del_interface/(?P<pk>[0-9]+)/$',interfaceManage.InterfaceSetList.as_view()),
    url(r'interface_set/search/$',interfaceManage.InterfaceSetSearchList.as_view()),

    # 接口增删改查
    url(r'interface_case_manage/list/$', interfaceCase.InterfaceCase.as_view()),
    url(r'interface_case_manage/add_case/$', interfaceCase.InterfaceCase.as_view()),
    url(r'interface_case_manage/update_case/(?P<pk>[0-9]+)/$',interfaceCase.InterfaceCase.as_view()),
    url(r'interface_case_manage/del_case/(?P<pk>[0-9]+)/$',interfaceCase.InterfaceCase.as_view()),
    #接口运行open_locust
    url(r'interface_case_manage/run/$', interfaceCase.InterfaceCaseRun.as_view()),
    url(r'interface_case_manage/get_token/$', interfaceCase.InterfaceBacthUpdate.as_view()),
    url(r'interface_case_manage/bacth_update/$', interfaceCase.InterfaceBacthUpdate.as_view()),
    url(r'interface_case_manage/search/$', interfaceCase.InterfaceSetSearchList.as_view()),

    #接口用例关联接口
    url(r'relevance_interface/list/$',relevanceInterface.InterfaceCaseData.as_view()),
    url(r'relevance_interface/get_result_detail/$',relevanceInterface.InterfaceCaseData.as_view()),
    url(r'relevance_interface/add_interface/$',relevanceInterface.InterfaceCaseData.as_view()),
    url(r'relevance_interface/update_interface/(?P<pk>[0-9]+)/$',relevanceInterface.InterfaceCaseData.as_view()),
    url(r'relevance_interface/del_interface/(?P<pk>[0-9]+)/$',relevanceInterface.InterfaceCaseData.as_view()),
    url(r'relevance_interface/open_locust/$', relevanceInterface.InterfaceCaseDataLocust.as_view()),
    url(r'relevance_interface/close_locust/$', relevanceInterface.InterfaceCaseDataLocust.as_view()),
    url(r'relevance_interface/debug_test/$', relevanceInterface.RunInterfaceDebugTest.as_view()),

    #用例集
    url(r'interface_case_set_manage/list/$',interfaceCaseSetMange.InterfaceCaseSetList.as_view()),
    url(r'interface_case_set_manage/add_case_set/$',interfaceCaseSetMange.InterfaceCaseSetList.as_view()),
    url(r'interface_case_set_manage/del_case_set/$',interfaceCaseSetMange.InterfaceCaseSetList.as_view()),

    #用例集关联用例
    url(r'relevance_case_set/list/$',interfaceCaseSetMange.RelevanceCaseSetList.as_view()),
    url(r'relevance_case_set/add_case/$',interfaceCaseSetMange.RelevanceCaseSetList.as_view()),
    url(r'relevance_case_set/del_case/(?P<pk>[0-9]+)/$',interfaceCaseSetMange.RelevanceCaseSetList.as_view()),

    #执行任务
    url(r'excute_plan/list/$',executePlan.ExecutePlanList.as_view()),
    url(r'excute_plan/add_plan/$',executePlan.ExecutePlanList.as_view()),
    url(r'excute_plan/update_plan/(?P<pk>[0-9]+)/$',executePlan.ExecutePlanList.as_view()),
    url(r'excute_plan/del_plan/(?P<pk>[0-9]+)/$',executePlan.ExecutePlanList.as_view()),
    url(r'excute_plan/run/$', executePlan.ExecutePlanRun.as_view()),

    #执行任务管理接口集
    url(r'excute_plan_cases/list/$', executePlan.ExecutePlanCasesList.as_view()),
    url(r'excute_plan_cases/add_case/$', executePlan.ExecutePlanCasesList.as_view()),
    url(r'excute_plan_cases/update_case/(?P<pk>[0-9]+)/$', executePlan.ExecutePlanCasesList.as_view()),
    url(r'excute_plan_cases/del_case/(?P<pk>[0-9]+)/$', executePlan.ExecutePlanCasesList.as_view()),

    # 执行任务报告
    url(r'excute_plan_report/list/$', executePlanReport.ExecutePlanReportList.as_view()),
    url(r'excute_plan_report/del_report/(?P<pk>[0-9]+)/$', executePlanReport.ExecutePlanReportList.as_view()),
    # 报告详细
    url(r'report_detail/tree/$', executePlanReport.ReportDetail.as_view()),
    url(r'report_detail/list/$', executePlanReport.ReportDetail.as_view()),
    url(r'report_detail/echarts/$', executePlanReport.echartsReport.as_view()),

    #公共方法
    url(r'public/jsonpath/$',public.JsonPathGetValue.as_view()),
    url(r'public/export_report/$', public.ExportReport.as_view()),

]
