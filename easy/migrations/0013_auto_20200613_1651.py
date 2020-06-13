# Generated by Django 3.0.5 on 2020-06-13 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0012_auto_20200613_1637'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='interfacecase',
            name='parent',
        ),
        migrations.AddField(
            model_name='interfacecaseset',
            name='relevance_ids',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='关联用例id集合'),
        ),
    ]
