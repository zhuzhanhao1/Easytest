from easy.models import ExecutePlanExport
from rest_framework import serializers


class ExecutePlanReportSer(serializers.ModelSerializer):
    '''
        执行计划列表
    '''
    plan_name = serializers.CharField(source="parent.plan_name")

    class Meta:
        model = ExecutePlanExport
        fields = ("parent","pass_rate","status","start_time","end_time","plan_name")
