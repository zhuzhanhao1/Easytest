from easy.models import InterFaceCase
from rest_framework import serializers


class InterFaceManageClassificationSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCase
        exclude = ("",)