from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

from models import Projects
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.conf import settings
from django.core.urlresolvers import reverse
from urllib import quote
from django.shortcuts import redirect
from django.views.decorators.clickjacking import xframe_options_exempt
import json
from django.http import JsonResponse


def allow_cross_domain_requests(response):
    """
    Allows cross domain requests

    :param response:
    :return:
    """
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response


def test(request):
    """
    Hello there

    :rtype : object
    :param request:
    :return:
    """
    #response = render(request, 'snap/Snap-Demo.xml', content_type="application/xhtml+xml")
    response = render(request, 'snap/problems_list.html')
    return allow_cross_domain_requests(response)


@xframe_options_exempt
def get_project(request, *args, **kwargs):
    """

    kwargs:
        type = teacher (solved teacher's version)
        type = student (skeleton student version)
        type = test_cases (test values in json)
    :param request:
    :return:
    """

    problem_name = kwargs['problem_name']

    try:
        project_obj = Projects.objects.get(name=problem_name)
    except ObjectDoesNotExist:
        response = HttpResponse("Project doesn't exist")
        return allow_cross_domain_requests(response)

    content_type = kwargs['type']

    if content_type == 'teacher':
        content = project_obj.teacher_content
    elif content_type == 'student':
        content = project_obj.student_content
    elif content_type == 'test_cases':
        #NOTE The response for this type is JSON VALUES
        content = json.loads(project_obj.test_cases)
    else:
        response = HttpResponse("Project doesn't exist")
        return allow_cross_domain_requests(response)

    if content_type in ['teacher', 'student']:

        response = render(request, 'snap/render_xml.html', {'content': content}, content_type="application/xhtml+xml")

    else:
        # content type json
        response = JsonResponse(content)

    return allow_cross_domain_requests(response)


def list_problems(request):

    problem_list = Projects.objects.all()

    response = render(request, 'snap/problems_list.html', {'problem_list': problem_list,
                                                           'default_launch_url': settings.DEFAULT_LAUNCH_URL,
                                                           })
    return allow_cross_domain_requests(response)

'''
# No longer in use (corresponds to older version of models)
def launch_problem(request, *args, **kwargs):
    absolute_project_name_url = request.build_absolute_uri(reverse('snap:get_project'))
    project_name = kwargs['problem_name']
    absolute_project_name_url += '?projectName=' + quote(project_name)
    snap_host_url = settings.DEFAULT_LAUNCH_URL + '/snap#open:' + absolute_project_name_url
    return redirect(snap_host_url)
'''


def launch_teacher_version(request, *args, **kwargs):
    problem_name = kwargs['problem_name']
    content_type = kwargs['type']

    absolute_project_name_url = request.build_absolute_uri(reverse('snap:get_project',
                                                                   args=(problem_name, content_type)))
    snap_host_url = settings.DEFAULT_LAUNCH_URL + '/snap#open:' + absolute_project_name_url

    return redirect(snap_host_url)





