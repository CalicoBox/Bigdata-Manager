/**
 * Created by user on 16/6/20.
 * Edited by OJJ on 17/7/17.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    $("#addUserBut").click(function () {
        
    })    

    var channelAdd = {

        quickTimeOut: "",

        partKey: "",

        hiveTerminated: "",

        init: function () {
            this.initEvent();
            this.getHiveDB();
        },

        initEvent: function () {
            var _this = this;
            // $(".zifenpianfa .fa").click(function () {
            //     var type = $(this).attr("data-type");
            //     var selectRadio = $("input[name='optionsRadios']:checked");
            //     if (selectRadio.length == 0 && type != "add") {
            //         $.showModal({
            //             content: "请先在选择一个字段",
            //             title: "提示信息"
            //         });
            //         return;
            //     }

            //     var $tr = selectRadio.parents("tr");
            //     if (type == "add") {
            //         var strObj = $("#zifenpian").find("tr").eq(0).clone();
            //         strObj.find(".tableInput").attr("data-flag", "false");
            //         $("#zifenpian").append(strObj);
            //     } else if (type == "del") {
            //         if (selectRadio.length >= 1) {
            //             $tr.remove();
            //         }
            //     }
            // });

            $("#yuanElm").delegate("tr", "click", function () {
                var $this = $(this);
                if ($this.hasClass("active")) {
                    $this.removeClass("active");
                } else {
                    $this.addClass("active");
                }
            });
            $("#selectedElm").delegate("tr", "click", function () {
                var $this = $(this);
                if ($this.hasClass("active")) {
                    $this.removeClass("active");
                } else {
                    $this.addClass("active");
                }
            });

            $("#yuanElmAll").click(function () {
                var trs = $("#yuanElm tr");
                for (var i = 0; i < trs.length; i++) {
                    if (!trs.eq(i).hasClass("active")) {
                        trs.addClass("active");
                        return;
                    }
                }
                trs.removeClass("active");
            });
            $("#selectedElmAll").click(function () {
                var trs = $("#selectedElm tr");
                for (var i = 0; i < trs.length; i++) {
                    if (!trs.eq(i).hasClass("active")) {
                        trs.addClass("active");
                        return;
                    }
                }
                trs.removeClass("active");
            });
            $("#selectedElmUp").click(function () {
                var actives = $("#selectedElm tr.active");
                if (actives.length <= 0) {
                    return;
                } else {
                    var active = actives.eq(0);
                    if (active.index() != 0) {
                        active.prev().before(actives);
                    }
                }
            });
            $("#selectedElmDown").click(function () {
                var actives = $("#selectedElm tr.active");
                if (actives.length <= 0) {
                    return;
                } else {
                    var active = actives.eq(actives.length - 1);
                    if (active.next().length > 0) {
                        active.next().after(actives);
                    }
                }
            });
            $("#toRight").click(function () {
                var trs = $("#yuanElm tr.active");
                var hiveElmLength = $("#hiveElm tr").length;
                for (var i = 0; i < trs.length; i++) {
                    var selectedElmLength = $("#selectedElm tr").length;
                    if (selectedElmLength < hiveElmLength) {
                        $("#selectedElm").append(trs.eq(i));
                    }
                }
            });
            $("#toLeft").click(function () {
                var trs = $("#selectedElm tr.active");
                $("#yuanElm").append(trs);
            });

            $("#gaoji").click(function () {
                if ($("input[name='gaoji']:checked").length <= 0) {
                    $("#gaojiConfig").hide();
                    $("#shujuliang").removeAttr("disabled");
                } else {
                    $("#gaojiConfig").show();
                    $("#shujuliang").attr("disabled", "disabled");
                }
            });

            $(".fenquType").click(function () {
                var fenquType = $("input[name='fenquType']:checked");
                if (fenquType.val() == 0) {
                    $("#fenqubiaodashi").show();
                    $("#dongtaifenduDiv").hide();
                } else {
                    $("#fenqubiaodashi").hide();
                    $("#dongtaifenduDiv").show();
                }
            });

            $(".myuserUl").delegate("li a", "click", function () {
                $(".myuserUl li a").removeClass("active");
                $(this).addClass("active");
                var loginName = $(this).attr("data-loginName");
                var id = $(this).attr("data-id");
                if ($(".selectUsers").find("a[data-id=" + id + "]").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-id="' + id + '" data-loginName="' + loginName + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + loginName
                        + '</a>');
                }
            });
            $("#hiveDBMenu").delegate("li a", "click", function () {
                alert("choice hiveDB");
                // $(this).parents("ul").siblings("input").val($(this).val());
            });
            //////////////////////
            //模糊框关闭：清空
            //////////////////////
            $(".modal").on('hidden.bs.modal', function () {
                $(this).find("input").val("");   
            })
            //////////////////////
            //搜索提示框关闭：选定
            //////////////////////
            $("#hiveDBMenu").on('hidden.bs.dropdown', function () {
                alert("dropdown hide");
                // alert($(this).siblings("#hiveDB").val());
            })
            //////////////////////
            //添加联系人
            //////////////////////
            $("#addUserBut").click(function () {
                $("#userModal").modal("toggle");
            });

            $("#quickSearchName").keyup(function (e) {
                var e = e || window.event;
                var value = $(this).val();
                if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 46 && e.keyCode != 8) {
                    _this.quickTimeOut = setTimeout(function () {
                        _this.getUser(value);
                    }, 200)
                }
            });
            $("#quickSearchName").keydown(function (e) {
                var e = e || window.event;
                clearTimeout(_this.quickTimeOut);
            });
            $("#addFuzeren").click(function () {
                var selectUsers = $(".selectUsers a");
                var userIds = [], userLoginNames = [];
                for (var i = 0; i < selectUsers.length; i++) {
                    userIds.push(selectUsers.eq(i).attr("data-id"));
                    userLoginNames.push(selectUsers.eq(i).attr("data-loginName"));
                }
                $("#userNames").val(userLoginNames.join(", ")).attr("data-id", userIds.join(","));
                $("#userModal").modal("hide");
            });

            $(".selectUsers").delegate('.badge', "click", function () {
                $(this).parent().remove();
            });
            /////////////////////
            //选择数据源
            ////////////////////
            $("#confDBInfoBtn").click(function () {
                $("#addDBModal").modal("toggle");
            });
            $("#tryConnectBtn").click(function () {
                var DBConf = {};
                DBConf.DBName = $("#DBName").val();
                DBConf.URL = $("#URL").val();
                DBConf.port = $("#port").val();
                DBConf.account = $("#account").val();
                DBConf.passwd = $("#passwd").val();
                _this.getDB(DBConf);
            });
            $("#addDB").click(function () {
                if ($("#tryConnectBtn").attr("value") == "success") {
                    $("#dbjiancheng").val($("#DBName").val());
                    $("#addDBModal").modal("hide");
                } else {
                    $("#addDBModal").modal("hide");
                }
            });
            ///////////////////
            //选取源数据字段
            ///////////////////
            $("#zifenpian").delegate(".choiceTableBtn", "click", function () {
                _this.getTable($(this).val());
            });

            ///////////////////
            //查找hive数据库
            ////////////////////
            $("#hiveDB").focusin(function () {
                $("#hiveDBMenu").dropdown();
            });
            $("#hiveDB").focusout(function () {
                $("#hiveDBMenu").hide();
            });

            $("#saveInfo").click(function () {
                _this.saveInfo();
            });
        },

        saveInfo: function () {
            debugger;
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name: "taskName", label: "任务名"},
                    {name: "userNames", label: "负责人"},
                    {name: "dbjiancheng", label: "DB简称"},
                    {name: "hiveDB", label: "Hive库"},
                    {name: "hivebiao", label: "Hive表"},
                    {name: "desc", label: "描述"}
                ]
            );

            if (verifyFlag) {
                var sqoop = {};
                sqoop.sqoopName = $("#taskName").val();
                sqoop.administrator = $("#userNames").val();
                sqoop.dbAbbr = $("#dbjiancheng").val();
                var zifenpian = $("#zifenpian").find("tr");

                var childSqoop = [];
                for (var i = 0; i < zifenpian.length; i++) {
                    var inputs = zifenpian.eq(i).find("input[type=text]");
                    if (inputs.eq(1).val() == "") {
                        showTip("DB第" + (i + 1) + "行表不能为空");
                        return;
                    }
                    if (i == 0) {
                        sqoop.connect = inputs.eq(0).val();
                        sqoop.table = inputs.eq(1).val();
                        sqoop.rdbmsDbId = inputs.eq(1).attr("data-kuId");
                        sqoop.rdbmsTabId = "1";//该字段没用
                        sqoop.driver = zifenpian.eq(i).find("input[type=hidden]").eq(0).val();
                        sqoop.username = zifenpian.eq(i).find("input[type=hidden]").eq(1).val();
                        sqoop.password = zifenpian.eq(i).find("input[type=hidden]").eq(2).val();
                    } else {
                        var sq = {};
                        sq.connect = inputs.eq(0).val();
                        sq.table = inputs.eq(1).val();
                        sq.rdbmsDbId = inputs.eq(1).attr("data-kuId");
                        sq.rdbmsTabId = "1";//该字段没用
                        sq.driver = zifenpian.eq(i).find("input[type=hidden]").eq(0).val();
                        sq.username = zifenpian.eq(i).find("input[type=hidden]").eq(1).val();
                        sq.password = zifenpian.eq(i).find("input[type=hidden]").eq(2).val();
                        childSqoop.push(sq);
                    }
                }
                sqoop.sqoops = childSqoop;
                sqoop.hiveDbName = $("#hiveDB").val();
                sqoop.hiveDbId = $("#hiveDB").attr("data-value");
                sqoop.hiveTable = $("#hivebiao").val();
                sqoop.hiveTabId = $("#hivebiao").attr("data-value");
                sqoop.fieldsTerminatedBy = _this.hiveTerminated;


                var columnMappers = [];
                var selectedElmTrs = $("#selectedElm tr"), hiveElmTrs = $("#hiveElm tr");
                if (selectedElmTrs.length != hiveElmTrs.length) {
                    showTip("源字段和hive表字段必须一一对应.")
                    return;
                }
                for (var k = 0; k < selectedElmTrs.length; k++) {
                    var ColumnMapper = {};
                    ColumnMapper.sColName = selectedElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.sColType = selectedElmTrs.eq(k).find("td").eq(1).html();
                    ColumnMapper.tColName = hiveElmTrs.eq(k).find("td").eq(0).html();
                    ColumnMapper.tColType = hiveElmTrs.eq(k).find("td").eq(1).html();
                    columnMappers.push(ColumnMapper);
                }
                sqoop.columnMappers = columnMappers;

                sqoop.splitBy = $("#qiefenziduan").val();
                if ($.trim(sqoop.splitBy) == "") {
                    showTip("数据切分字段不能为空.")
                    return;
                }

                if ($("#gaoji").is(":checked")) {
                    sqoop.numMappers = $("#gaojiConfig").val();
                    if ($.trim(sqoop.numMappers) == "") {
                        showTip("数据量高级不能为空.")
                        return;
                    }
                } else {
                    sqoop.numMappers = $("#shujuliang").val();
                }
                sqoop.reduceNumber = $("#shujuliang").val();

                if (this.partKey != "") {
                    var fenquType = $("input[name='fenquType']:checked").val();
                    if (fenquType == 0) {
                        sqoop.partVal = $("#fenqubds").val();
                        sqoop.partType = 0;
                        if ($.trim(sqoop.partVal) == "") {
                            showTip("分区表达式不能为空.")
                            return;
                        }
                    } else {
                        sqoop.partVal = $("#fenquziduan").val();
                        if ($.trim(sqoop.partVal) == "") {
                            showTip("选择分区字段不能为空.")
                            return;
                        }
                        sqoop.partType = 1;
                    }
                    sqoop.partKey = _this.partKey;
                } else {
                    sqoop.partType = 2;
                }

                sqoop.where = $("#where").val();
                sqoop.describe = $("#desc").val();

                sqoop.sqoopType = "import";
                sqoop.compressionCodec = "com.hadoop.compression.lzo.LzopCodec";
                showloading(true);
                $.ajax({
                    type: "POST",
                    url: "/sentosa/transform/sqoop/saveSqoop",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(sqoop),
                    success: function (result) {
                        showloading(false);
                        if (result && result.success) {
                            debugger;
                            location.href = "importDBList.html";
                        } else {
                            $.showModal({content: "保存失败:"+result.err});
                        }
                    },
                    error: function (a, b, c) {
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        getHiveDB: function (DBName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/channel/GetHiveDB",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        hiveDBs_str = "";
                        hiveDBs = result.hiveDBs;
                        for (elem in hiveDBs) {
                            hiveDBs_str += hiveDBs[elem] + " ";
                        }
                        $("#hiveDB").bind('keyup', {hiveDBs: hiveDBs_str}, function (e) {
                            var e = e || window.event;
                            var value = $(this).val();
                            var reg = new RegExp(value+"[a-zA-Z0-9_-]*","g");
                            _this.setHiveDBCandidate(e.data.hiveDBs.match(reg));
                        })
                    } else {
                        $.showModal({content: "查询失败:"+result.err});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setHiveDBCandidate: function (data) {
            $("#hiveDBMenu").dropdown('toggle');
            $("#hiveDBMenu").empty();
            for (elem in data) {
                $("#hiveDBMenu").append('<li><a href="#">'+data[elem]+'</a></li>');
            }
        },
        getHivebiao: function (id) {
            var _this = this;
            $("#hivebiao").val("");
            $("#hiveElm").html("");
            $("#selectedElm").html("");
            _this.hiveTerminated = "";
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/table/list",
                data: {
                    dbId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        $("#hivebiao").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#hivebiao").changeValue(function () {
                            var value = $(this).attr("data-value");
                            _this.hiveTerminated = $(this).next().find("li.selected").attr("data-hiveTerminated");
                            _this.getHiveTableElm(value);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },


        // getDB: function () {
        //     var _this = this;
        //     showloading(true);
        //     $.ajax({
        //         type: "get",
        //         url: "/sentosa/metadata/group/all",
        //         data: {
        //             //groupId:$("#leftKu").find("i.text-light-blue").parent().attr("data-id")
        //         },
        //         success: function (result) {
        //             showloading(false);
        //             if (result && result.success) {
        //                 var dat = result.pairs.dat;
        //                 $("#dbjiancheng").quickSearch({
        //                     data: dat,
        //                     text: "name",
        //                     value: "id",
        //                     width: "400px"
        //                 });
        //                 $("#dbjiancheng").changeValue(function () {
        //                     var id = $(this).attr("data-value");
        //                     var isMulti = $(this).next().find("li.selected").attr("data-isMulti");
        //                     if (isMulti == "1") {
        //                         $(".zifenpianfa").hide();
        //                     } else {
        //                         $(".zifenpianfa").show();
        //                     }
        //                     _this.getKu(id);
        //                 });
        //             } else {
        //                 $.showModal({content: "查询失败"});
        //             }
        //         },
        //         error: function (a, b, c) {
        //             showloading(false);
        //             alert(a.responseText);
        //         }
        //     });
        // },

        // getKu: function (id) {
        //     var _this = this;
        //     showloading(true);
        //     $.ajax({
        //         type: "get",
        //         url: "/sentosa/metadata/group/db/list",
        //         data: {
        //             groupId: id
        //         },
        //         success: function (result) {
        //             showloading(false);
        //             if (result && result.success) {
        //                 var dat = result.pairs.dat;
        //                 _this.setKutable(dat);
        //             } else {
        //                 $.showModal({content: "查询失败"});
        //             }
        //         },
        //         error: function (a, b, c) {
        //             showloading(false);
        //             alert(a.responseText);
        //         }
        //     });
        // },

        // setKutable: function (dat) {
        //     var zifenpian = $("#zifenpian");
        //     zifenpian.html("");
        //     $("#yuanElm").html("");
        //     $("#selectedElm").html("");
        //     for (var i = 0; i < dat.length; i++) {
        //         zifenpian.append('<tr>'
        //             + '<td style="width:36px;">'
        //             + '<div class="radio">'
        //             + '<label>'
        //             + '<input type="radio" name="optionsRadios">'
        //             + '</label>'
        //             + '</div>'
        //             + '</td>'
        //             + '<td>'
        //             + '<div class="col-sm-12 input-group-sm">'
        //             + '<input type="text" class="form-control" value="' + dat[i].jdbcUrl + '" placeholder="" readonly>'
        //             + '</div>'
        //             + '</td>'
        //             + '<td>'
        //             + '<div class="col-sm-12 input-group-sm">'
        //             + '<input type="text" class="form-control tableInput" data-flag="false" data-kuId="' + dat[i].id + '" placeholder="">'
        //             + '<input type="hidden" value="' + dat[i].driverType + '" placeholder="">'
        //             + '<input type="hidden" value="' + dat[i].userName + '" placeholder="">'
        //             + '<input type="hidden" value="' + dat[i].password + '" placeholder="">'
        //             + '<span class="glyphicon glyphicon-search quickSearchIcon"></span>'
        //             + '</div>'
        //             + '</td>'
        //             + '</tr>');
        //     }
        // },
        // getTableElm: function (tableName, dbId) {
        //     var _this = this;
        //     showloading(true);
        //     $.ajax({
        //         type: "get",
        //         url: "/sentosa/metadata/db/outer/column/list",
        //         data: {
        //             tableName: tableName,
        //             dbId: dbId
        //         },
        //         success: function (result) {
        //             showloading(false);
        //             if (result && result.success) {
        //                 var dat = result.pairs.dat;
        //                 $("#fenquziduan").quickSearch({
        //                     data: dat,
        //                     text: "name",
        //                     value: "isPartition",
        //                     width: "400px"
        //                 });
        //                 _this.setTableElm(dat);
        //             } else {
        //                 $.showModal({content: "查询失败"});
        //             }
        //         },
        //         error: function (a, b, c) {
        //             showloading(false);
        //             alert(a.responseText);
        //         }
        //     });
        // },

        getHiveTableElm: function (tableId) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/table/column/list",
                data: {
                    tableId: tableId,
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        _this.setHiveTableElm(dat);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setHiveTableElm: function (dat) {
            $("#hiveElm").empty();
            $("#selectedElm").empty();
            this.partKey = "";
            for (var i = 0; i < dat.length; i++) {
                if (dat[i].isPartition == 0) {
                    var str = '<tr>'
                        + '<td>' + dat[i].name + '</td>'
                        + '<td>' + dat[i].type + '</td>'
                        + '</tr>';
                    $("#hiveElm").append(str);
                } else if (dat[i].isPartition == 1) {
                    this.partKey = dat[i].name;
                }
            }
            if (this.partKey != "") {
                $(".fenquOperate").show();
            } else {
                $(".fenquOperate").hide();
            }
        },
        getUser: function (loginName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/channel/SearchUser",
                global: false,
                data: {
                    loginName: $.trim(loginName)
                },
                success: function (result) {
                    showloading(false);
                    if (result) {
                        _this.setUserDig(result);
                    } else {
                        $.showModal({conent: "查询联系人失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setUserDig: function (data) {
            $(".myuserUl").empty();
            for (var elem in data) {
                var userinfo = data[elem];
                $(".myuserUl").append('<li><a data-id="' + userinfo.id + '" data-loginName="' + userinfo.loginname + '" data-trueName="' + userinfo.truename + '" href="javascript:void(0);">' + userinfo.truename + '  ' + userinfo.email + ' ' + userinfo.groupname + '</a></li>');
            }
        },
        getDB: function (conf) {
            var _this = this;
            showloading(true);
            var conf_json = JSON.stringify(conf)
            $.ajax({
                type: "post",
                url: "/channel/GetDBConnect",
                global: false,
                data: {
                    conf: conf_json,
                },
                success: function (result) {
                    showloading(false);
                    if (result.success) {
                        $("#tryConnectBtn").attr({class:"btn btn-success", value:"success"});
                        $("#tryConnectBtn").text("通过");
                        _this.setTables(result.tables);
                    } else {
                        $("#addDBModal .modal-body").append('<div class="alert alert-danger" role="alert" >'+result.err+'</div>');
                        _this.quickTimeOut = setTimeout(function () {
                            $("#addDBModal .alert-danger").remove();
                        }, 5000)
                        $("#tryConnectBtn").attr({class:"btn btn-danger", value:"fail"});
                        $("#tryConnectBtn").text("请重试");
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setTables: function (data) {
            $("#zifenpian").empty();
            var temp_str = "";
            for (var elem in data) {
                var table = data[elem];
                $("#zifenpian").append('<tr><td><div class="input-group"><span class="input-group-addon"><input class="choiceTableBtn" type="radio" name="optionsRadios" value="'+table+'"></span><input type="text" class="form-control text-center" data-kuId="1" placeholder="" readonly="readonly" value="'+table+'"><span class="input-group-addon"><span class="glyphicon glyphicon-align-justify seeTableDescBtn"></span></span></div></td></tr>');
            }
            alert(temp_str);
        },
        getTable: function (table) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/channel/GetTableDesc",
                data: {
                    table: table,
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        _this.setTableElm(result.tableDesc);
                    } else {
                        $.showModal({content: "查询失败"+result.err});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setTableElm: function (desc) {
            $("#yuanElm").empty();
            $("#selectedElm").empty();
            for (var elem in desc) {
                var field = desc[elem][0];
                var fieldType = desc[elem][1];
                $("#yuanElm").append('<tr>'+'<td>'+ field+'</td>'+'<td>'+fieldType+'</td>'+'</tr>');
            }
        },

    }
    channelAdd.init();
});
