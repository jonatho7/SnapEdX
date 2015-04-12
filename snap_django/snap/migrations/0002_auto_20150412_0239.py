# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('snap', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projects',
            name='content',
            field=models.TextField(max_length=16384),
            preserve_default=True,
        ),
    ]
