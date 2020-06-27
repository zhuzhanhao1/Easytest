# Generated by Django 3.0.5 on 2020-06-27 16:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0025_auto_20200627_2347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='executeplancases',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='easy.ExecutePlan', verbose_name='执行计划id'),
        ),
        migrations.AlterField(
            model_name='executeplancases',
            name='relevance_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='easy.InterfaceCaseSet', verbose_name='关联用例集id'),
        ),
    ]
