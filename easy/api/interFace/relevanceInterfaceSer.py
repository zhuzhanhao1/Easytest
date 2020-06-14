from easy.models import InterFaceCaseData, InterFaceSet
from rest_framework import serializers


class InterFaceCaseDataSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    # 获取关联表的数据
    relevance_interface_name = serializers.CharField(
        source='interface_id.interface_name')
    tcp = serializers.CharField(source='interface_id.tcp')
    ip = serializers.CharField(source='interface_id.ip')
    url = serializers.CharField(source='interface_id.url')
    method = serializers.CharField(source='interface_id.method')
    headers = serializers.CharField(source='interface_id.headers')
    params = serializers.CharField(source='interface_id.params')
    body = serializers.CharField(source='interface_id.body')
    preprocessor = serializers.CharField(source='interface_id.preprocessor')
    depend_id = serializers.CharField(source='interface_id.depend_id')
    depend_key = serializers.CharField(source='interface_id.depend_key')
    replace_key = serializers.CharField(source='interface_id.replace_key')
    replace_position = serializers.CharField(
        source='interface_id.replace_position')
    duration = serializers.CharField(source='interface_id.duration')
    result = serializers.CharField(source='interface_id.result')
    belong_module = serializers.CharField(source='interface_id.belong_module.id')

    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = (
            'id',
            "parent",
            "interface_id",
            "interface_name",
            "description",
            "relevance_interface_name",
            "tcp",
            "ip",
            'url',
            "method",
            "headers",
            "params",
            "body",
            "preprocessor",
            'depend_id',
            "depend_key",
            "replace_key",
            "replace_position",
            "head",
            "duration",
            "result",
            "belong_module"
        )


class DescriptionSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = ("description",)

class InterfaceNameSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = ("interface_name",)

class HeadSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = ("head",)

class AddRelevanceInterfaceSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = InterFaceCaseData
        # exclude = ("",)
        fields = "__all__"
