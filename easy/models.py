from django.db import models

# Create your models here.
class MainMenu(models.Model):
    """
        主菜单
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
        接口对应的系统分类管理
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


class InterFaceSet(models.Model):
    '''
        接口集
    '''
    interface_name = models.CharField(max_length=100,verbose_name="接口名称")
    identity = models.CharField(max_length=50,verbose_name="用户身份")
    url = models.CharField(max_length=550,verbose_name="访问路径")
    method = models.CharField(max_length = 20,verbose_name="请求方式")
    header = models.CharField(max_length=200,verbose_name="请求头",null=True,blank=True)
    params = models.TextField(verbose_name="请求参数",null=True,blank=True)
    body = models.TextField(verbose_name="请求体内容",null=True,blank=True)
    exceptres = models.TextField(verbose_name="期望结果",null=True,blank=True)
    result = models.TextField(verbose_name="执行结果",null=True,blank=True)
    # SET_NULL删除主表，置空此字段,CASCADE级联删除
    belong_module = models.ForeignKey(InterFaceManageModule, on_delete=models.CASCADE, verbose_name='所属模块的id')
    preprocessor = models.CharField(max_length=20,verbose_name="前置处理器",default=False)
    depend_id = models.CharField(max_length=20,verbose_name="依赖的id",null=True,blank=True)
    depend_key = models.CharField(max_length=500,verbose_name="依赖的key",null=True,blank=True)
    replace_key = models.CharField(max_length=500,verbose_name="替换的key",null=True,blank=True)
    replace_position = models.CharField(max_length=50,verbose_name="替换的内容区域", null=True,blank=True)
    sortid = models.IntegerField(verbose_name="排序号",null=True,blank=True)
    duration = models.FloatField(verbose_name="响应时长",null=True,blank=True)
    head = models.CharField(max_length=200, verbose_name="负责人",null=True,blank=True)

    def __str__(self):
        return self.interface_name

    class Meta:
        verbose_name_plural = '接口集管理'