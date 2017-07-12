from __future__ import unicode_literals

from django.db import models

# Create your models here.
class UserInfo(models.Model):
    id = models.IntegerField(primary_key=True)
    loginname = models.CharField(max_length=150)
    truename = models.CharField(max_length=60)
    groupname = models.CharField(max_length=80)
    email = models.CharField(max_length=254)

    def __unicode__(self):
        return self.loginname

    class Meta:
        managed = False
        # app_label = "usertag"
        db_table = 'v_userinfo_test'

# class DBName(models.Model):
#     id = models.IntegerField(primary_key=True)
#     loginname = models.CharField(max_length=150)
#     truename = models.CharField(max_length=60)
#     groupname = models.CharField(max_length=80)
#     email = models.CharField(max_length=254)

#     def __unicode__(self):
#         return self.dbname

#     class Meta:
#         managed = False
#         # app_label = "usertag"
#         db_table = 'v_dbname'