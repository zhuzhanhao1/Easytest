from easy.models import ExecutePlan,ExecutePlanCases
from rest_framework import serializers


class ExecutePlanSer(serializers.ModelSerializer):
    '''
        执行计划列表
    '''
    class Meta:
        model = ExecutePlan
        # exclude = ("",)
        fields = "__all__"

class PlanNameSer(serializers.ModelSerializer):
    '''
        执行计划名称
    '''
    class Meta:
        model = ExecutePlan
        # exclude = ("",)
        fields = ("plan_name",)

class DescriptionSer(serializers.ModelSerializer):
    '''
        执行计划描述
    '''
    class Meta:
        model = ExecutePlan
        fields = ("description",)

class ExecutePlanCasesSer(serializers.ModelSerializer):
    '''
        执行计划管理接口集
    '''
    class Meta:
        model = ExecutePlanCases
        # exclude = ("",)
        fields = "__all__"


class DescriptionCaseSer(serializers.ModelSerializer):
    '''
        执行计划描述
    '''
    class Meta:
        model = ExecutePlanCases
        fields = ("description",)


class ExecutePlanAllIDSer(serializers.ModelSerializer):
    '''
        执行计划列表
    '''
    class Meta:
        model = ExecutePlanCases
        depth = 2
        # exclude = ("",)
        fields = "__all__"
