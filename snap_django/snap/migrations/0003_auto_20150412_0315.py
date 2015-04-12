# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('snap', '0002_auto_20150412_0239'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='projects',
            options={'verbose_name': 'project name'},
        ),
    ]
