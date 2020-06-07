# Generated by Django 3.0.5 on 2020-06-07 15:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0004_auto_20200607_1408'),
    ]

    operations = [
        migrations.CreateModel(
            name='InterFaceSet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('interface_name', models.CharField(max_length=100, verbose_name='接口名称')),
                ('identity', models.CharField(max_length=50, verbose_name='用户身份')),
                ('url', models.CharField(max_length=550, verbose_name='访问路径')),
                ('method', models.CharField(max_length=20, verbose_name='请求方式')),
                ('header', models.CharField(blank=True, max_length=200, null=True, verbose_name='请求头')),
                ('params', models.TextField(blank=True, null=True, verbose_name='请求参数')),
                ('body', models.TextField(blank=True, null=True, verbose_name='请求体内容')),
                ('exceptres', models.TextField(blank=True, null=True, verbose_name='期望结果')),
                ('result', models.TextField(blank=True, null=True, verbose_name='执行结果')),
                ('preprocessor', models.CharField(default=False, max_length=20, verbose_name='前置处理器')),
                ('depend_id', models.CharField(blank=True, max_length=20, null=True, verbose_name='依赖的id')),
                ('depend_key', models.CharField(blank=True, max_length=500, null=True, verbose_name='依赖的key')),
                ('replace_key', models.CharField(blank=True, max_length=500, null=True, verbose_name='替换的key')),
                ('replace_position', models.CharField(blank=True, max_length=50, null=True, verbose_name='替换的内容区域')),
                ('sortid', models.IntegerField(blank=True, null=True, verbose_name='排序号')),
                ('duration', models.FloatField(blank=True, null=True, verbose_name='响应时长')),
                ('head', models.CharField(blank=True, max_length=200, null=True, verbose_name='负责人')),
                ('belong_module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='easy.InterFaceManageModule', verbose_name='CASCADE')),
            ],
            options={
                'verbose_name_plural': '接口流程管理',
            },
        ),
    ]
