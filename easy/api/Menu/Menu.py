from django.core.paginator import Paginator
from django.db.models import Q
from django.http import Http404
from easy.models import MainMenu,ChildMenu
from .menuSer import MainMenuSer,ChildMenuSer
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
        id_list = [i.id for i in obj]
        main_menu_data = MainMenuSer(obj, many=True).data
        for id in id_list:
            query_set = ChildMenu.objects.filter(classification_id=id)
            if query_set:
                res = ChildMenuSer(query_set,many=True).data
                main_menu_data[id-1]["children"] = res
        return Response(main_menu_data)
