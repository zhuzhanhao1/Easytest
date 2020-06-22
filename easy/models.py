from django.db import models

# Create your models here.


class MainMenu(models.Model):
    """
        主菜单
    """
    title = models.CharField(max_length=50, verbose_name="标题")
    icon = models.CharField(max_length=50, verbose_name="图标")
    href = models.CharField(max_length=100, verbose_name="链接")
    spread = models.BooleanField(default=False, verbose_name="默认不展开")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '主菜单'
        verbose_name_plural = '主菜单管理'


class ChildMenu(models.Model):
    """
        二级菜单
    """
    classification = models.ForeignKey(
        MainMenu,
        on_delete=models.CASCADE,
        verbose_name='所属分类')
    title = models.CharField(max_length=50, verbose_name="标题")
    icon = models.CharField(max_length=50, verbose_name="图标")
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
    parent = models.ForeignKey(
        InterFaceManageClassification,
        on_delete=models.CASCADE,
        verbose_name='下属模块')
    puisne_module = models.CharField(max_length=50, verbose_name="下属模块标题")
    description = models.CharField(max_length=255,verbose_name="描述",null=True,blank=True)
    create_data = models.DateField(auto_now=True,null=True,blank=True,verbose_name="创建时间")

    def __str__(self):
        return self.puisne_module

    class Meta:
        verbose_name = '接口管理-下属模块'
        verbose_name_plural = '接口管理-下属模块'


class InterFaceSet(models.Model):
    '''
        接口集
    '''
    interface_name = models.CharField(max_length=100, verbose_name="接口名称")
    tcp = models.CharField(max_length=20, verbose_name="传输协议", default="http")
    ip = models.CharField(max_length=50, verbose_name="访问路径")
    url = models.CharField(max_length=550, verbose_name="访问路径")
    method = models.CharField(max_length=20, verbose_name="请求方式")
    headers = models.CharField(max_length=200,verbose_name="请求头",null=True,blank=True)
    params = models.TextField(verbose_name="请求参数", null=True, blank=True)
    body = models.TextField(verbose_name="请求体内容", null=True, blank=True)
    # SET_NULL删除主表，置空此字段,CASCADE级联删除
    belong_module = models.ForeignKey(
        InterFaceManageModule,
        on_delete=models.CASCADE,
        verbose_name='所属模块的id')
    preprocessor = models.CharField(max_length=20,verbose_name="前置处理器",default=False)
    depend_id = models.CharField(max_length=20,verbose_name="依赖的id",null=True,blank=True)
    depend_key = models.CharField(max_length=500,verbose_name="依赖的key",null=True,blank=True)
    replace_key = models.CharField(max_length=500,verbose_name="替换的key",null=True,blank=True)
    replace_position = models.CharField(max_length=50,verbose_name="替换的内容区域",null=True,blank=True)
    duration = models.IntegerField(blank=True, null=True, verbose_name='响应时长')
    result = models.TextField(blank=True, null=True, verbose_name='执行结果')

    def __str__(self):
        return self.interface_name

    class Meta:
        verbose_name_plural = '接口集管理'


class InterFaceCase(models.Model):
    '''
        接口用例
    '''
    interface_case_name = models.CharField(max_length=50, verbose_name="接口用例名称")
    description = models.CharField(max_length=255,verbose_name="描述",null=True,blank=True)
    pass_rate = models.CharField(max_length=8, verbose_name="通过率", null=True, blank=True,default="100")
    create_data = models.DateField(auto_now=True,null=True,blank=True,verbose_name="创建时间")

    def __str__(self):
        return self.interface_case_name

    class Meta:
        verbose_name = '接口用例表'
        verbose_name_plural = '接口用例表'


class InterFaceCaseData(models.Model):
    '''
        接口用例里的数据
    '''
    parent = models.ForeignKey(InterFaceCase,on_delete=models.CASCADE,verbose_name='接口用例id')
    interface_id = models.ForeignKey(InterFaceSet,on_delete=models.CASCADE,verbose_name="关联接口id")
    interface_name = models.CharField(max_length=50, verbose_name="接口名称")
    description = models.CharField(max_length=255,verbose_name="描述",null=True,blank=True)
    head = models.CharField(max_length=20,verbose_name="负责人",null=True,blank=True)

    def __str__(self):
        return self.interface_name

    class Meta:
        verbose_name = '接口用例数据'
        verbose_name_plural = '接口用例数据'


class InterfaceCaseSet(models.Model):
    '''
        接口用例集
    '''
    interface_case_set_name = models.CharField(max_length=50, verbose_name="接口用例集名称")

    def __str__(self):
        return self.interface_case_set_name

    class Meta:
        verbose_name_plural = '接口用例集'


class RelevanceCaseSet(models.Model):
    '''
        接口用例集关联的用例
    '''
    parent = models.ForeignKey(InterfaceCaseSet, on_delete=models.CASCADE, verbose_name='接口集用例id')
    interface_case_name = models.CharField(max_length=50, verbose_name="关联用例名称")
    description = models.CharField(max_length=255,verbose_name="关联用例描述",null=True,blank=True)
    relevance_id = models.CharField(max_length=255,verbose_name="关联用例id")

    def __str__(self):
        return self.interface_case_name

    class Meta:
        verbose_name_plural = '关联用例名称'


class ExecutePlan(models.Model):
    '''
        执行计划
    '''
    plan_name = models.CharField(max_length=50, verbose_name="计划名称")
    description = models.CharField(max_length=255, verbose_name="计划描述", null=True, blank=True)
    ploy = models.CharField(max_length=50, verbose_name="策略")
    notification = models.BooleanField(verbose_name="消息通知")
    status = models.BooleanField(verbose_name="计划状态")
    start_time = models.DateTimeField(verbose_name="开始时间",null=True,blank=True)
    end_time = models.DateTimeField(verbose_name="结束时间", null=True, blank=True)

    def __str__(self):
        return self.plan_name

    class Meta:
        verbose_name_plural = '执行计划'