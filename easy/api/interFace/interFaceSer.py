from easy.models import InterFaceManageModule,InterFaceManageClassification
from rest_framework import serializers

class InterFaceManageClassificationSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceManageClassification
        fields = "__all__"


class InterFaceManageModuleSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceManageModule
        fields = "__all__"

class UpdateInterFaceManageModuleSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceManageModule
        fields = ("url","puisne_module","puisne_key")