# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('snap', '0003_auto_20150412_0315'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projects',
            old_name='content',
            new_name='student_content',
        ),
        migrations.AddField(
            model_name='projects',
            name='teacher_content',
            field=models.TextField(default='Fill something', max_length=16384),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='projects',
            name='test_cases',
            field=models.TextField(default='Fill something', max_length=4096),
            preserve_default=False,
        ),
    ]
