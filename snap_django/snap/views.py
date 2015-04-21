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
def get_project(request):
    """


    :param request:
    :return:
    """

    project_name = request.GET.get('projectName', "demo")

    try:
        project_obj = Projects.objects.get(name=project_name)
    except ObjectDoesNotExist:
        response = HttpResponse("Project doesn't exist")
        return allow_cross_domain_requests(response)

    content = project_obj.content

    response = render(request, 'snap/render_xml.html', {'content': content}, content_type="application/xhtml+xml")

    return allow_cross_domain_requests(response)


def list_problems(request):

    problem_list = Projects.objects.all()

    response = render(request, 'snap/problems_list.html', {'problem_list': problem_list,
                                                           'default_launch_url': settings.DEFAULT_LAUNCH_URL,
                                                           })
    return allow_cross_domain_requests(response)


def launch_problem(request, *args, **kwargs):
    #return HttpResponse('problem name = {}'.format(kwargs['problem_name']))

    absolute_project_name_url = request.build_absolute_uri(reverse('snap:get_project'))
    project_name = kwargs['problem_name']
    absolute_project_name_url += '?projectName=' + quote(project_name)
    snap_host_url = settings.DEFAULT_LAUNCH_URL + '/snap#open:' + absolute_project_name_url
    return redirect(snap_host_url)

