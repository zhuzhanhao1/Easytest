from django.contrib import admin
from .models import MainMenu, ChildMenu, InterFaceManageClassification,\
    InterFaceManageModule, InterFaceSet, InterFaceCase, InterfaceCaseSet, \
    InterFaceCaseData,RelevanceCaseSet,ExecutePlan


@admin.register(MainMenu)
class MainMenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'icon', 'href', 'spread')  # 在后台列表下显示的字段
    search_fields = ('title',)


@admin.register(ChildMenu)
class ChildMenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'classification', 'title', 'icon', 'href', 'spread')
    search_fields = ('title',)


@admin.register(InterFaceManageClassification)
class InterFaceManageClassificationAdmin(admin.ModelAdmin):
    list_display = ("classification",)


@admin.register(InterFaceManageModule)
class InterFaceManageModuleAdmin(admin.ModelAdmin):
    list_display = ("parent", "description", "puisne_module", "create_data")


@admin.register(InterFaceSet)
class InterFaceSetAdmin(admin.ModelAdmin):
    list_display = (
        "interface_name",
        "tcp",
        "ip",
        "url",
        "method",
        "headers",
        "params",
        "body",
        "belong_module",
        "preprocessor")


@admin.register(InterFaceCase)
class InterFaceCaseAdmin(admin.ModelAdmin):
    list_display = ("description", "interface_case_name", "create_data")


@admin.register(InterfaceCaseSet)
class InterFaceSetCaseAdmin(admin.ModelAdmin):
    list_display = ("interface_case_set_name",)


@admin.register(InterFaceCaseData)
class InterFaceCaseDataAdmin(admin.ModelAdmin):
    list_display = ("parent",  "interface_name", "description")

@admin.register(RelevanceCaseSet)
class RelevanceCaseSetAdmin(admin.ModelAdmin):
    list_display = ("parent", "relevance_id", "interface_case_name", "description")


@admin.register(ExecutePlan)
class ExecutePlanAdmin(admin.ModelAdmin):
    list_display = ("plan_name", "description", "ploy", "notification",  "start_time", "end_time")
