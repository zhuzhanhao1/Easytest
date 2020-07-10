# Generated by Django 3.0.3 on 2020-07-08 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0029_auto_20200705_1111'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='executeplanreport',
            name='pass_rate',
        ),
        migrations.AddField(
            model_name='executeplanreport',
            name='all_case_count',
            field=models.IntegerField(default=0, verbose_name='所有用例数'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='executeplanreport',
            name='all_interface_count',
            field=models.IntegerField(blank=True, null=True, verbose_name='所有接口数'),
        ),
        migrations.AddField(
            model_name='executeplanreport',
            name='fail_case_count',
            field=models.IntegerField(blank=True, null=True, verbose_name='失败用例数'),
        ),
        migrations.AddField(
            model_name='executeplanreport',
            name='fail_interface_count',
            field=models.IntegerField(blank=True, null=True, verbose_name='失败接口数'),
        ),
    ]