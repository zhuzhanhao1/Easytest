"""Easytest URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from easy.api import renderHtml

urlpatterns = [
    # django-restframework
    url(r'^api/(?P<version>\w+)/', include('easy.urls')),
    # 后台页面
    url(r'^admin/', admin.site.urls),
    # 返回页面
    url(r'^login/$', renderHtml.login_views),
    url(r'^dingding_login/$', renderHtml.dingding_login_views),
    url(r'^logout/$', renderHtml.logout_views),
    url(r'^index/$', renderHtml.index_views),
    url(r'^home/', renderHtml.home_views),
    url(r'^menuMange/', renderHtml.menu_manager_views),
    url(r'^interface_manager/', renderHtml.interface_manager_views),
    url(r'^interface_set/', renderHtml.interface_set_views),
    url(r'^interface_case_manage/', renderHtml.interface_case_views),
    url(r'^relevance_interface/', renderHtml.relevance_interface_views),
    url(r'^interface_search/', renderHtml.interface_search_views),
    url(r'^interface_case_set_manage/', renderHtml.interface_case_set_manage_views),
    url(r'^interface_case_search/', renderHtml.interface_case_search_views),
    url(r'^execute_plan/', renderHtml.execute_plan_views),
    url(r'^interface_test_report/', renderHtml.interface_test_report_views),

]
