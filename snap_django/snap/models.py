from django.db import models

# Create your models here.



class Projects(models.Model):
    name = models.CharField(max_length=256)
    content = models.TextField(max_length=16384)

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


