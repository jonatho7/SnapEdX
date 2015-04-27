__author__ = 'vivekbharathakupatni'

from django.conf.urls import patterns, url
from snap import views


urlpatterns = patterns('',
                       url(r'^test/?$', views.test, name='test'),
                       url(r'^getProject/(?P<problem_name>[\w\.]+)/(?P<type>[\w]+)/?$',  views.get_project,
                           name='get_project'),
                       url(r'^getProblemsList/?$',  views.list_problems, name='list_problems'),
                       url(r'^launch/(?P<problem_name>[\w\.]+)/(?P<type>[\w]+)/?$', views.launch_teacher_version,
                           name='launch_teacher_version'),
                       #url(r'^launch/(?P<problem_name>[\w\.]+)/?$', views.launch_problem, name='launch_problem'),

                       )

