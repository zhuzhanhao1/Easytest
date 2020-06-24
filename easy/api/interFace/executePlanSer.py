from easy.models import ExecutePlan
from rest_framework import serializers


class ExecutePlanSer(serializers.ModelSerializer):
    '''
        主菜单
    '''
    class Meta:
        model = ExecutePlan
        # exclude = ("",)
        fields = "__all__"