from easy.models import ExecutePlan
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