# Generated by Django 3.0.3 on 2020-07-08 09:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('easy', '0030_auto_20200708_1548'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='executeplan',
            name='status',
        ),
    ]