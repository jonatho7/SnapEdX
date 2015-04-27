from django.db import models
import json
from django.core.exceptions import ValidationError
# Create your models here.


def validate_json(value):
    try:
        _ = json.loads(value)
    except Exception as e:
        #print(e)
        raise ValidationError('{} is not json.'.format(value))


class Projects(models.Model):
    name = models.CharField(max_length=256)
    teacher_content = models.TextField(max_length=16384)
    student_content = models.TextField(max_length=16384)
    test_cases = models.TextField(max_length=4096, help_text="key must be enclosed within double quotes",
                                  validators=[validate_json])

    class Meta:
        """
        Meta options for the class
        """
        verbose_name = 'project name'

    def __str__(self):
        """

        representation of the object
        :return:
        """
        return self.name


