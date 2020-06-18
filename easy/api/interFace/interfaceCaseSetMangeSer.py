from easy.models import InterfaceCaseSet,RelevanceCaseSet
from rest_framework import serializers

class InterfaceCaseSetMangeSer(serializers.ModelSerializer):
    '''
        主菜单分类
    '''
    class Meta:
        model = InterfaceCaseSet
        fields = "__all__"


class RelevanceCaseSetSer(serializers.ModelSerializer):
    '''
        主菜单分类
    '''
    class Meta:
        model = RelevanceCaseSet
        fields = "__all__"
