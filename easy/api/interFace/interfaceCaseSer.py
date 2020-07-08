from easy.models import InterFaceCase
from rest_framework import serializers


class InterFaceCaseSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCase
        # exclude = ("",)
        fields = "__all__"

class DescriptionSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCase
        # exclude = ("",)
        fields = ("description",)

class PassRateSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCase
        # exclude = ("",)
        fields = ("pass_rate",)