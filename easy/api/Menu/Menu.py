from easy.models import MainMenu
from .menuSer import  MenuAppendSer
from rest_framework.views import APIView
from rest_framework.response import Response


class MainMenuApi(APIView):
    '''
        菜单
    '''

    def get(self, request, *args, **kwargs):
        obj = MainMenu.objects.filter()
        menu_data = MenuAppendSer(obj, many=True).data
        return Response(menu_data)
