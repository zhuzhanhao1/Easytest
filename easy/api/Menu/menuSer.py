from easy.models import MainMenu, ChildMenu
from rest_framework import serializers


class MainMenuSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = MainMenu
        fields = ('title', 'icon', 'href', 'spread')

class MainMenuAllSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = MainMenu
        fields = ('title', 'icon', 'href', 'spread',"id")


class ChildMenuSer(serializers.ModelSerializer):
    '''
        子菜单
    '''
    class Meta:
        model = ChildMenu
        fields = "__all__"

class UpdatteChildMenuSer(serializers.ModelSerializer):
    '''
        子菜单
    '''
    class Meta:
        model = ChildMenu
        fields = ('title', 'icon', 'href', 'spread')


class MenuAppendSer(serializers.ModelSerializer):
    '''
        子菜单
    '''

    children = serializers.SerializerMethodField()

    class Meta:
        model = MainMenu
        fields = ('title', 'icon', 'href', 'spread', 'children')
        # 表示联表的深度
        # depth = 1

    def get_children(self, obj):
        queryset = obj.childmenu_set.all()
        return [{"title": row.title, "icon": row.icon,
                 "href": row.href, "spread": row.spread} for row in queryset]
