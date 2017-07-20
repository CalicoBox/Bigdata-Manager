from __future__ import unicode_literals

import json
import os
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
    request.session['dbTable'] = table
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Mysql Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetHiveDB(request):
  conf = {'URL':'10.3.181.235', 'port':10000, 'auth_mechanism':'PLAIN'}
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
  conf = request.session['hiveConf']
  res = dict()
  try:
    conn=dbapi.connect(host=conf['URL'], port=conf['port'], database=DBName, auth_mechanism=conf['auth_mechanism'])
    cur=conn.cursor()
    cur.execute('show tables')
    tables = cur.fetchall()
    cur.close()
    conn.close()
    res['success'] = True
    res['hiveTables'] = tables
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Hive Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

def GetHiveTableDescription(request):
  tableName = request.GET["tableName"]
  DBName = request.GET["DBName"]
  conf = request.session['hiveConf']
  res = dict()
  try:
    conn=dbapi.connect(host=conf['URL'], port=conf['port'], database=DBName, auth_mechanism=conf['auth_mechanism'])
    cur=conn.cursor()
    cur.execute('desc '+tableName)
    tableDesc = cur.fetchall()
    cur.close()
    conn.close()
    res['success'] = True
    res['hiveTableDesc'] = tableDesc
    request.session['hiveDB'] = DBName
    request.session['hiveTable'] = tableName
    return JsonResponse(res)
  except MySQLdb.Error,e:
    err = "Hive Error %d: %s" % (e.args[0], e.args[1])
    res['success'] = False
    res['err'] = err
    return JsonResponse(res)

class switch(object):
  def __init__(self, value):
    self.value = value
    self.fall = False
  def __iter__(self):
    """Return the match method once, then stop"""
    yield self.match
    raise StopIteration
  def match(self, *args):
    """Indicate whether or not to enter a case suite"""
    if self.fall or not args:
      return True
    elif self.value in args: # changed for v1.5, see below
      self.fall = True
      return True
    else:
      return False


def DBtoHive(request):
  # conMode = request.GET['conMode']
  conMode = 'normal'
  importMode = ''

  sqoopConf = json.loads(request.GET['sqoop'])
  print(sqoopConf)
  DBConf = request.session['dbConf']
  DBTable = request.session['dbTable']
  hiveConf = request.session['hiveConf']
  hiveDB = request.session['hiveDB']
  hiveTable = request.session['hiveTable']
  res = dict()
  for case in switch(conMode):
    if case('normal'):
      shell = "sudo -u hive sqoop import --connect jdbc:mysql://"+DBConf['URL']+":"+DBConf['port']+"/"+DBConf['DBName']+" --username "+DBConf['account']+" --password "+DBConf['passwd']+" --table "+DBTable+" --hive-import --hive-table "+hiveTable+" --hive-database "+hiveDB+" --columns "+sqoopConf['columns']+" --where '"+sqoopConf['where']+"' --split-by "+sqoopConf['splitBy']
      print(shell)
      info = os.system(shell)
      print(info)
      res['success'] = True
      return JsonResponse(res)

    #Here is reservered to advanced operations
    if case('advanced'):
      for case_1 in switch(importMode):
        if case_1('overwrite'):
          break;
        if case_1('incremental'):
          break;
      break;
