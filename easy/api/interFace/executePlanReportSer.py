from easy.models import ExecutePlanReport,InterFaceCaseData,InterfaceCaseSet,RelevanceCaseSet
from rest_framework import serializers


class ExecutePlanReportSer(serializers.ModelSerializer):
    '''
        报告列表
    '''
    plan_name = serializers.CharField(source="parent.plan_name")

    class Meta:
        model = ExecutePlanReport
        fields = ("parent","all_case_count","fail_case_count","fail_interface_count",
                  "all_interface_count","status","start_time","end_time","plan_name","id")


class ReportDetailTreeSer(serializers.ModelSerializer):
    '''
        报告详情树
    '''
    spread = serializers.SerializerMethodField()
    title = serializers.CharField(source="interface_case_set_name")
    children = serializers.SerializerMethodField()
    class Meta:
        model = InterfaceCaseSet
        fields = ("title","children","spread")
        # depth = 2

    def get_children(self, obj):
        queryset = obj.relevancecaseset_set.all()
        return [{"title": row.interface_case_name,
                 "id":RelevanceCaseSet.objects.filter(id=row.id).first().relevance_id.id
                 } for row in queryset]

    def get_spread(self,obj):
        return True


class InterFaceSetSer(serializers.ModelSerializer):
    '''
        报告列表
    '''
    result_state = serializers.SerializerMethodField()
    class Meta:
        model = InterFaceCaseData
        fields = ("id","interface_name","url","duration","result_state")

    def get_result_state(self, obj):
        queryset = obj.result
        print(type(queryset))
        if "message" and "error" in queryset:
            queryset = "fail"
        else:
            queryset = "success"
        return queryset