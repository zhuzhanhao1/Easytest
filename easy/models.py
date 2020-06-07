from django.db import models

# Create your models here.
class MainMenu(models.Model):
    """
    左侧一级菜单
    """
    title = models.CharField(max_length=50, verbose_name="标题")
    icon =  models.CharField(max_length=50, verbose_name="图标")
    href = models.CharField(max_length=100, verbose_name="链接")
    spread = models.BooleanField(default=False, verbose_name="默认不展开")
    children = models.TextField(verbose_name="子菜单",default=[])

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '主菜单'
        verbose_name_plural = '主菜单管理'


class ChildMenu(models.Model):
    """
    二级菜单
    """
    classification = models.ForeignKey(MainMenu, on_delete=models.CASCADE, verbose_name='所属分类')
    title = models.CharField(max_length=50, verbose_name="标题")
    icon =  models.CharField(max_length=50, verbose_name="图标")
    href = models.CharField(max_length=100, verbose_name="链接")
    spread = models.BooleanField(default=False, verbose_name="默认不展开")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '二级菜单'
        verbose_name_plural = '二级菜单管理'


class InterFaceManageClassification(models.Model):
    '''
        接口管理
    '''
    classification = models.CharField(max_length=50, verbose_name="系统分类标题")

    def __str__(self):
        return self.classification

    class Meta:
        verbose_name = '接口管理-接入系统'
        verbose_name_plural = '接口管理-接入系统'


class InterFaceManageModule(models.Model):
    '''
        模块管理
    '''
    parent = models.ForeignKey(InterFaceManageClassification, on_delete=models.CASCADE, verbose_name='下属模块')
    url = models.CharField(max_length=100, verbose_name="链接")
    puisne_module = models.CharField(max_length=50, verbose_name="下属模块标题")
    puisne_key = models.CharField(max_length=50, verbose_name="下属模块的键")

    def __str__(self):
        return self.puisne_module

    class Meta:
        verbose_name = '接口管理-下属模块'
        verbose_name_plural = '接口管理-下属模块'

