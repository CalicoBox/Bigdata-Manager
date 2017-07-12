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
    cur.execute('show tables;')
    tables = cur.fetchmany(cur.execute("show tables;"))
    tables_info = list()
    for table in tables:
      tables_info.append(table)
    cur.close()
    conn.commit()
    conn.close()
    res['success'] = True
    res['tables'] = tables_info
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)
      
  