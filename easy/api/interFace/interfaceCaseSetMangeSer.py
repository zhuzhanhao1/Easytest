from easy.models import InterfaceCaseSet
from rest_framework import serializers

class InterfaceCaseSetMangeSer(serializers.ModelSerializer):
    '''
        主菜单分类
    '''
    class Meta:
        model = InterfaceCaseSet
        fields = "__all__"

