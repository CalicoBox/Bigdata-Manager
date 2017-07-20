# coding:utf-8

import json
from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout

def LoginCheck(request):
    user = request.user
    if user.is_active:
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
    return render(request, 'login.html')

@csrf_exempt
def login_views(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
        else:
            pass
    else:
        data["success"] = False
        return JsonResponse(data)

@csrf_exempt
def logout_views(request):
    logout(request)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
