from __future__ import unicode_literals

import json
from django.apps import AppConfig
from django.http import JsonResponse
from channel.models import UserInfo
import MySQLdb


class ChannelConfig(AppConfig):
  name = 'channel'

def SearchUser(request):
  name = request.GET['loginName']
  result = UserInfo.objects.filter(truename__regex="^" + name).values()
  result_dict = dict()
  for index in range(len(result)):
    result_dict[index] = result[index]
  return JsonResponse(result_dict)

def GetDBConnect(request):
  conf_str = request.POST['conf']
  conf = json.loads(conf_str)
  res = dict()
  try:
    conn=MySQLdb.connect(host=conf['URL'],user=conf['account'],passwd=conf['passwd'],db=conf['DBName'],port=int(conf['port']))
    cur=conn.cursor()
    tables = cur.fetchmany(cur.execute("show tables;"))
    tables_info = list()
    for table in tables:
      tables_info.append(table)
    cur.close()
    conn.close()
    res['success'] = True
    res['tables'] = tables_info
    request.session.set_expiry(0)
    request.session['dbconf'] = conf
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetTableDesc(request):
  table = request.GET['table']
  conf = request.session['dbconf']
  res = dict()
  try:
    conn=MySQLdb.connect(host=conf['URL'],user=conf['account'],passwd=conf['passwd'],db=conf['DBName'],port=int(conf['port']))
    cur=conn.cursor()
    tableDesc = cur.fetchmany(cur.execute('desc '+table+';'))
    tableDesc_info = list()
    for elem in tableDesc:
      tableDesc_info.append(elem)
    cur.close()
    conn.close()
    res['success'] = True
    res['tableDesc'] = tableDesc_info
    request.session['table'] = table
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)
  