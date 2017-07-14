from __future__ import unicode_literals

import json
from django.apps import AppConfig
from django.http import JsonResponse
from channel.models import UserInfo
import MySQLdb
from impala import dbapi


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
    cur.close()
    conn.close()
    res['success'] = True
    res['tables'] = tables
    request.session.set_expiry(0)
    request.session['dbConf'] = conf
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetTableDesc(request):
  table = request.GET['table']
  conf = request.session['dbConf']
  res = dict()
  try:
    conn=MySQLdb.connect(host=conf['URL'],user=conf['account'],passwd=conf['passwd'],db=conf['DBName'],port=int(conf['port']))
    cur=conn.cursor()
    tableDesc = cur.fetchmany(cur.execute('desc '+table+';'))
    cur.close()
    conn.close()
    res['success'] = True
    res['tableDesc'] = tableDesc
    request.session['table'] = table
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetHiveDB(request):
  conf = {'URL':'10.3.181.235', 'port':10000, 'auth_mechanism':'PLAIN', 'DBName':''}
  res = dict()
  try:
    conn=dbapi.connect(host=conf['URL'], port=conf['port'], auth_mechanism=conf['auth_mechanism'])
    cur=conn.cursor()
    cur.execute('show databases')
    databases = cur.fetchall()
    cur.close()
    conn.close()
    res['success'] = True
    res['hiveDBs'] = databases
    request.session.set_expiry(0)
    request.session['hiveConf'] = conf
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Hive Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetHiveTable(request):
  DBName = request.GET["DBName"]
  request.session['hiveConf']['DBName'] = DBName
  conf = request.session['hiveConf']
  res = dict()
  try:
    conn=dbapi.connect(host=conf['URL'], port=conf['port'], database=conf['DBName'], auth_mechanism=conf['auth_mechanism'])
    cur=conn.cursor()
    cur.execute('show tables')
    tables = cur.fetchall()
    cur.close()
    conn.close()
    res['success'] = True
    res['hiveTables'] = tables
    request.session['hiveConf'] = conf
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Hive Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetHiveTableDesc(request):
  tableName = request.GET["tableName"]
  conf = request.session['hiveConf']
  res = dict()
  try:
    conn=dbapi.connect(host=conf['URL'], port=conf['port'], database=conf['DBName'], auth_mechanism=conf['auth_mechanism'])
    cur=conn.cursor()
    cur.execute('desc '+tableName)
    tableDesc = cur.fetchall()
    cur.close()
    conn.close()
    res['success'] = True
    res['hiveTableDesc'] = tableDesc
    request.session['hiveTable'] = tableName
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Hive Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)