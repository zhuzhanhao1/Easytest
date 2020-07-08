from easy.models import ExecutePlan,ExecutePlanCases,ExecutePlanReport
from rest_framework import serializers


class ExecutePlanSer(serializers.ModelSerializer):
    '''
        执行计划列表
    '''
    class Meta:
        model = ExecutePlan
        fields = "__all__"

class PlanNameSer(serializers.ModelSerializer):
    '''
        执行计划名称
    '''
    class Meta:
        model = ExecutePlan
        fields = ("plan_name",)

class PlanPloySer(serializers.ModelSerializer):
    '''
        执行计划策略
    '''
    class Meta:
        model = ExecutePlan
        fields = ("ploy",)

class ExecutePlanCasesSer(serializers.ModelSerializer):
    '''
        执行计划管理接口集
    '''
    class Meta:
        model = ExecutePlanCases
        fields = "__all__"


class DescriptionCaseSer(serializers.ModelSerializer):
    '''
        执行计划用例集描述
    '''
    class Meta:
        model = ExecutePlanCases
        fields = ("description",)


class ExecutePlanAllIDSer(serializers.ModelSerializer):
    '''
        暂放，深度查询
    '''
    class Meta:
        model = ExecutePlanCases
        depth = 1
        fields = "__all__"

class ExecutePlanReporttSer(serializers.ModelSerializer):
    '''
        执行计划用例集描述
    '''
    class Meta:
        model = ExecutePlanReport
        fields = "__all__"

class ReportStuatusSer(serializers.ModelSerializer):
    '''
        运行状态
    '''
    class Meta:
        model = ExecutePlanReport
        fields = ("status",)


class ReportCountSer(serializers.ModelSerializer):
    '''
        成功失败个数
    '''
    class Meta:
        model = ExecutePlanReport
        fields = ("fail_case_count","fail_interface_count","all_interface_count")