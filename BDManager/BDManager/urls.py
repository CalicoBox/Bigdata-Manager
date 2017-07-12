"""BDManager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from login.views import LoginCheck, login_views, logout_views
from main.views import DefaultView
from usertag.views import TagList, RuleList
from dataknowledge.views import hivetablelist, tagmanage, timevariableList
from channel.views import DBtoHiveAdd, DBtoHiveModify, exportDB, exportDBList, exportDBModify, importDBList, importHiveHiveList, upload, uploadInfo, uploadList

from channel.apps import SearchUser, GetDBConnect
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', LoginCheck),
    url(r'^login_views', login_views),
    url(r'^main', DefaultView),
    url(r'^usertag/TagList', TagList, name='TagList'),
    url(r'^usertag/RuleList', RuleList, name='RuleList'),
    url(r'^dataknowledge/hivetablelist', hivetablelist, name='HiveTableList'),
    url(r'^dataknowledge/tagmanage', tagmanage, name='TagManage'),
    url(r'^dataknowledge/timevariableList', timevariableList, name='TimeVariableList'),
    url(r'^channel/DBtoHiveAdd', DBtoHiveAdd, name="DBtoHiveAdd"),
    url(r'^channel/DBtoHiveModify', DBtoHiveModify, name="DBtoHiveModify"),
    url(r'^channel/exportDB', exportDB, name="exportDB"),
    url(r'^channel/exportDBList', exportDBList, name="exportDBList"),
    url(r'^channel/exportDBModify', exportDBModify, name="exportDBModify"),
    url(r'^channel/importDBList', importDBList, name="importDBList"),
    url(r'^channel/importHiveHiveList', importHiveHiveList, name="importHiveHiveList"),
    url(r'^channel/upload', upload, name="upload"),
    url(r'^channel/uploadInfo', uploadInfo, name="uploadInfo"),
    url(r'^channel/uploadList', uploadList, name="uploadList"),

    #apps
    url(r'^channel/SearchUser', SearchUser, name="SearchUser"),
    url(r'^channel/GetDBConnect', GetDBConnect, name="GetDBConnect"),
]
