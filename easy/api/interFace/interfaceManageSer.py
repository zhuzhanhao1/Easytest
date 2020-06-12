from easy.models import InterFaceManageModule,InterFaceManageClassification,InterFaceSet
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


class InterFaceSetSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceSet
        fields = "__all__"

class DependIdSer(serializers.ModelSerializer):
    '''
        前置的id
    '''
    class Meta:
        model = InterFaceSet
        fields = ("depend_id",)

class DependKeySer(serializers.ModelSerializer):
    '''
        前置结果jsonpath
    '''
    class Meta:
        model = InterFaceSet
        fields = ("depend_key",)

class ReplaceKeySer(serializers.ModelSerializer):
    '''
        替换区域jsonpath
    '''
    class Meta:
        model = InterFaceSet
        fields = ("replace_key",)

class ReplacePositionSer(serializers.ModelSerializer):
    '''
        替换区域(params:0,body:1,all:2)
    '''
    class Meta:
        model = InterFaceSet
        fields = ("replace_position",)

class ParamsSer(serializers.ModelSerializer):
    '''
        请求Query
    '''
    class Meta:
        model = InterFaceSet
        fields = ("params",)

class BodySer(serializers.ModelSerializer):
    '''
        请求体
    '''
    class Meta:
        model = InterFaceSet
        fields = ("body",)

class InterfaceNameSer(serializers.ModelSerializer):
    '''
        接口名称
    '''
    class Meta:
        model = InterFaceSet
        fields = ("interface_name",)

class UrlSer(serializers.ModelSerializer):
    '''
        请求路径
    '''
    class Meta:
        model = InterFaceSet
        fields = ("url",)

class InterfaceAllSer(serializers.ModelSerializer):
    '''
        请求路径
    '''
    class Meta:
        model = InterFaceSet
        fields = ("interface_name","url","method","belong_module","params","preprocessor","body","depend_id","depend_key","replace_key","replace_position",)
