from easy.models import InterFaceCaseData
from rest_framework import serializers


class InterFaceCaseDataSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = "__all__"

class DescriptionSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = ("description",)