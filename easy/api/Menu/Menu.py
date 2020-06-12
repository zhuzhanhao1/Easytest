from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import MainMenu,ChildMenu
from .menuSer import MainMenuSer,ChildMenuSer,MenuAppendSer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from django_redis import get_redis_connection
import json


class MainMenuApi(APIView):
    '''
        菜单
    '''
    def get(self,request,*args,**kwargs):
        obj = MainMenu.objects.filter()
        menu_data = MenuAppendSer(obj, many=True).data
        print(menu_data)
        return Response(menu_data)
