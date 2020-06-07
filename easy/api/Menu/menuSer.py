from easy.models import MainMenu,ChildMenu
from rest_framework import serializers

class MainMenuSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = MainMenu
        fields = ('title', 'icon', 'href', 'spread','children')


class ChildMenuSer(serializers.ModelSerializer):
    '''
        子菜单
    '''
    class Meta:
        model = ChildMenu
        fields = "__all__"