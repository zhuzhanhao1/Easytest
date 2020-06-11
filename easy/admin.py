from django.contrib import admin
# Register your models here.

from .models import MainMenu,ChildMenu,InterFaceManageClassification,InterFaceManageModule,InterFaceSet

@admin.register(MainMenu)
class MainMenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'title','icon','href','spread','children')  # 在后台列表下显示的字段
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