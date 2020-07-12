from easy.models import InterFaceCaseData
from rest_framework import serializers


class DescriptionSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = ("description",)

class InterfaceNameSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        fields = ("interface_name",)

class HeadSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        fields = ("head",)

class AddRelevanceInterfaceSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        fields = "__all__"

class HeadersSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        fields = ("headers",)

class IpSer(serializers.ModelSerializer):

    class Meta:
        model = InterFaceCaseData
        fields = ("ip",)

class ResultTimeSer(serializers.ModelSerializer):
    '''
        结果，响应时间
    '''
    class Meta:
        model = InterFaceCaseData
        fields = ("result","duration")


class DependIdSer(serializers.ModelSerializer):
    '''
        前置的id
    '''

    class Meta:
        model = InterFaceCaseData
        fields = ("depend_id",)

class DependKeySer(serializers.ModelSerializer):
    '''
        前置结果jsonpath
    '''
    class Meta:
        model = InterFaceCaseData
        fields = ("depend_key",)

class ReplaceKeySer(serializers.ModelSerializer):
    '''
        替换区域jsonpath
    '''
    class Meta:
        model = InterFaceCaseData
        fields = ("replace_key",)

class ReplacePositionSer(serializers.ModelSerializer):
    '''
        替换区域(params:0,body:1,all:2)
    '''
    class Meta:
        model = InterFaceCaseData
        fields = ("replace_position",)