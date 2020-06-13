from django.contrib import admin
from .models import MainMenu,ChildMenu,InterFaceManageClassification,\
    InterFaceManageModule,InterFaceSet,InterFaceCase,InterfaceCaseSet,InterFaceCaseData

@admin.register(MainMenu)
class MainMenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'title','icon','href','spread')  # 在后台列表下显示的字段
    search_fields = ('title',)

@admin.register(ChildMenu)
class ChildMenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'classification','title','icon','href','spread')
    search_fields = ('title',)


@admin.register(InterFaceManageClassification)
class InterFaceManageClassificationAdmin(admin.ModelAdmin):
    list_display = ("classification",)


@admin.register(InterFaceManageModule)
class InterFaceManageModuleAdmin(admin.ModelAdmin):
    list_display = ("parent","url","puisne_module","puisne_key")


@admin.register(InterFaceSet)
class InterFaceSetAdmin(admin.ModelAdmin):
    list_display = ("interface_name","url","method","headers","params","body","belong_module","preprocessor")


@admin.register(InterFaceCase)
class InterFaceCaseAdmin(admin.ModelAdmin):
    list_display = ("description","interface_case_name","create_data")


@admin.register(InterfaceCaseSet)
class InterFaceSetCaseAdmin(admin.ModelAdmin):
    list_display = ("interface_case_set_name","create_data")


@admin.register(InterFaceCaseData)
class InterFaceCaseDataAdmin(admin.ModelAdmin):
    list_display = ("parent","interface_id","interface_name","description")
