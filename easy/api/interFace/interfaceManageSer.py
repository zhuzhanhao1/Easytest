from easy.models import InterFaceManageModule,InterFaceManageClassification,InterFaceSet
from rest_framework import serializers

class InterFaceManageClassificationSer(serializers.ModelSerializer):
    '''
        主菜单分类
    '''
    class Meta:
        model = InterFaceManageClassification
        fields = "__all__"


class InterFaceManageModuleSer(serializers.ModelSerializer):
    '''
        主菜单模块
    '''
    class Meta:
        model = InterFaceManageModule
        fields = "__all__"

class UpdateInterFaceManageModuleSer(serializers.ModelSerializer):
    '''
        主菜单更新模块
    '''
    class Meta:
        model = InterFaceManageModule
        fields = ("url","puisne_module","puisne_key")



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

class IPSer(serializers.ModelSerializer):
    '''
        请求ip
    '''
    class Meta:
        model = InterFaceSet
        fields = ("ip",)


class TcpSer(serializers.ModelSerializer):
    '''
        请求tcp
    '''
    class Meta:
        model = InterFaceSet
        fields = ("tcp",)




class InterfaceAllSer(serializers.ModelSerializer):
    '''
        接口集字段
    '''
    class Meta:
        model = InterFaceSet
        fields = "__all__"


class InterfaceSetSearchSer(serializers.ModelSerializer):
    '''
        搜索内的字段
    '''
    belong_module = serializers.CharField(source="belong_module.puisne_module")
    classification = serializers.CharField(source="belong_module.parent.classification")
    class Meta:
        model = InterFaceSet
        fields = ("id","interface_name","url","method","belong_module","classification")


class HeadersSer(serializers.ModelSerializer):
    '''
        请求头
    '''
    class Meta:
        model = InterFaceSet
        fields = ("headers",)
