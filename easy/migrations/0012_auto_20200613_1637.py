# Generated by Django 3.0.5 on 2020-06-13 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0011_auto_20200613_1629'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interfacecase',
            name='create_data',
            field=models.DateField(auto_now=True, null=True, verbose_name='创建时间'),
        ),
        migrations.AlterField(
            model_name='interfacecaseset',
            name='create_data',
            field=models.DateField(auto_now=True, null=True, verbose_name='创建时间'),
        ),
    ]