var acctData;
//角色类型码值
var roleTypeCode = undefined;
var array = new Array();
var arrayTmp = new Array();
var orgId;
var empId;
var bizTypeCds;
var relaRoleIds;
var acctId;
var custName;
var cerNum;
var relaStatus = '04';
var exportColumns =[
    {'field':'ACCT_ID', 'title': '账户编号'},
    {'field':'BIZ_TYPE', 'title': '业务类型'},
    {'field':'CUST_NAME', 'title': '客户名称'},
    {'field':'CUST_ID', 'title': '客户编号'},
    {'field':'CER_NUM', 'title': '客户证件号'},
    {'field':'CER_TYPE_DESC', 'title': '证件类型'},
    {'field':'ORG_NAME', 'title': '所属机构'},
    {'field':'RELA_ROLE_DESC', 'title': '关联角色'},
    {'field':'EMP_NAME', 'title': '员工姓名'},
    {'field':'RELA_RATIO_DESC', 'title': '关联比例'},
    {'field':'RELA_STATUS_DESC', 'title': '关联状态'}
];
var relaStatusRes;
var bizTypeCdRes;
$(function () {

    relaStatusList = $.param.getRelationStatusList();
    bizTypeCdList = getBizTypeCd();
    var initExistFlag = bizTypeCdsInit !== '' && bizTypeCdsInit !== undefined
        &&  bizTypeCdsInit !=null && relaStatusInit !== '' && relaStatusInit !== undefined
        && relaStatusInit != null;

    var relaStatusContains = false;
    $.each(relaStatusList, function (index, item) {
        if(relaStatusInit===item.encode){
            relaStatusContains = true;
        }
        relaStatusRes += "<option value='" + item.encode + "'>" + item.name + "</option>"
    });
    var bizTypeCdContains = false;
    $.each(bizTypeCdList, function (index, item) {
        if(bizTypeCdsInit===item.encode){
            bizTypeCdContains = true;
        }
        bizTypeCdRes += "<option value='" + item.encode + "'>" + item.name + "</option>"
    });

    var initFlag = initExistFlag
        && relaStatusList !== ''
        && relaStatusList != null
        && relaStatusList != undefined
        && relaStatusList.length > 0
        && bizTypeCdList !== ''
        && bizTypeCdList != null
        && bizTypeCdList !== undefined
        && bizTypeCdList.length > 0
        && relaStatusContains
        && bizTypeCdContains;

    //获取机构列表
    getOrgList();
    //获取业务类型


    //获取关联角色
    $("#relaRoleIds").html("").append($.param.getSelectOptionOrder("AB0003")).selectpicker('refresh');
    //根据不同角色获取关联状态

    $("#relaStatus").html("").append(relaStatusRes).selectpicker('refresh');
    $("#bizTypeCds").html("").append(bizTypeCdRes).selectpicker('refresh');
    if(!initFlag){

        document.getElementById('bizTypeCds').options.selectedIndex = '0';
        $("#relaStatus").selectpicker('val', '04:07');
    }else{
        $("#bizTypeCds").selectpicker('val', bizTypeCdsInit);
        $("#relaStatus").selectpicker('val', relaStatusInit);
    }


    $('#bizTypeCds').selectpicker('refresh');
    $('#relaStatus').selectpicker('refresh');

   // bizTypeCds = $('#bizTypeCds').val();
/*
    $('#relationApproval_btn').attr("style", "display:none");

    $('#batchDelete').attr("style", "display:none");*/

  //  TableObj.relationSearchPageTable();
    query();

    $('#bizTypeCds').on('changed.bs.select', function (a, b, c, d) {
        if (!$(this).selectpicker('val')) {
            //必选
            document.getElementById('bizTypeCds').options.selectedIndex = '0';
            $('#bizTypeCds').selectpicker('refresh');
            layer.msg("业务类型必选", {icon: 3});
        }
    });

    //业绩分配-添加
    $('#relationMark_add').click(function () {
        var length = $("#relationMarkTableInIndex").bootstrapTable("getData").length;
        //var addtRcrdTm = getSystemDate("yyyy-MM-dd hh:mm:ss");
        $("#relationMarkTableInIndex").bootstrapTable("insertRow", {
            index: length,
            row: {
                isAdd: true,
                relaRoleId: '',
                empId: '',
                empName: '',
                belongOrgId: '',
                belongOrgName: '',
                relaRatio: '',
                effDt: '',
                relationStatus: '0'
            },
        });

    });

    //业绩分配-删除
    $('#relationMark_del').click(function () {
        var length = $("#relationMarkTableInIndex").bootstrapTable("getData").length;
        var checklist = $('#relationMarkTableInIndex').bootstrapTable('getSelections');
        var ids = [];
        $.each(checklist, function (index, item) {
            ids.push(item.number);
            if (item.addtRcrdId != undefined && item.addtRcrdId != null && item.addtRcrdId != '') {
                deleteIds.push(item.addtRcrdId);
            }
        });
        $("#relationMarkTableInIndex").bootstrapTable("remove", {
            field: 'number',
            values: ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#relationMarkTableInIndex"));

    });


    //批量删除
    $('#batchDelete').click(function () {
        var checklist = $('#relationTable').bootstrapTable('getSelections');
        if (checklist == null || checklist.length <= 0) {
            layer.msg("至少选择一条数据", {icon: 2});
            return;
        }
        var text = '确认删除' + checklist.length + '条数据吗?';
        layer.confirm(text, {
            btn: ['确定', '取消'] //按钮
        }, function () {
            $.ajax({
                url: portal.bp() + '/relation/todo_del_process',
                type: 'post',
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(checklist),
                success: function (data) {
                    if (data.code == '200') {
                        layer.msg("批量删除成功", {icon: 1});
                        TableObj.relationSearchPageTable();
                    } else {
                        layer.msg(data.message, {icon: 2});
                    }
                }
            });
        }, function () {

        });
    });
    //业绩分配-保存
    $('#relationMark_save').click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($('#relationMarkTableInIndex'));
        if (validateError != null) {
            layer.msg(validateError, {icon: 2});
            return;
        }

        //acctData=row;
        var addData = [];
        var tableData = $('#relationMarkTableInIndex').bootstrapTable("getData");
        $.each(tableData, function (index, item) {
            //新增数据
            addData.push(item);
        });
        if (addData.length == 0) {
            layer.msg("没有新增数据，无需保存", {icon: 3});
            return;
        }
        var acctArray = new Array();
        acctArray.push(acctData);
        var relaVal = relaStatus;
        var oprtype;
        if (relaVal == '07' || relaVal == '05' || relaVal == '04' || relaVal == '04:07') {
            oprtype = '2';
        } else if (relaVal == '02') {
            oprtype = '1';
        } else {
            layer.msg('该条记录无法编辑', {icon: 2});
        }
        var data = {
            'addData': addData,
            'acctData': acctArray,
            'operType': oprtype,
            'approvalFlag': '0',
            'relaStatus':acctData.relaStatus
        };
        $.ajax({
            url: portal.bp() + './json/ok.json',
            type: 'post',
            cache: false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == '200') {
                    layer.msg("保存成功", {icon: 1});
                    $('#relationMark').modal('hide');
                    TableObj.relationSearchPageTable();
                } else {
                    var msg = data.message;

                    if (data.message == null || data.message == undefined) {
                        msg = '保存失败';
                    }
                    layer.msg(msg, {icon: 2});
                }
            }
        });

    });
    //审批通过
    $('#relationApproval_btn').click(function () {

        if (relaStatus != '02' && relaStatus != '05' && relaStatus != '08') {
            return;
        }
        var checklist = $('#relationTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("至少选择一条记录", {icon: 3});
        } else {
            var object = new Object();
            object['acctData'] = array;
            var index;
            $.ajax({
                url: portal.bp() + '/relation/workflowPass',
                type: 'post',
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(object),
                success: function (data) {
                    if (data.code == '200') {
                        layer.msg("提交审批成功", {icon: 1});
                        arrayTmp = [];
                        array = [];
                        TableObj.relationSearchPageTable();
                    } else {
                        layer.msg(data.message, {icon: 2});
                    }
                },
                beforeSend: function (XMLHttpRequest) {
                    index = layerLoad();
                },
                complete: function (XMLHttpRequest) {
                    layerClose(index);
                }
            });
        }
    });
    //导出
    $('#batchExport').click(function(){

        //ajax将数据传回后台，生成excel文件，并返回excel文件名称
        //组装查询参数

        $.ajax({
            url:portal.bp() + '/relation/relationSelectExport',
            type: 'post',
            cache: false,
            async: false,
            contentType: "application/x-www-form-urlencoded",
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            },
            //dataType: "json",
            data: {
                'orgId': orgId,
                'empId': empId,
                'bizTypeCds': bizTypeCds,
                'relaRoleIds': relaRoleIds,
                'acctId': acctId,
                'custName': custName,
                'cerNum': cerNum,
                'relaStatus':relaStatus,
                'keys' : arrayTmp,
                 'tableHead':JSON.stringify(exportColumns)
            }
        }).done(
            function (res) {
                if(res.code == '200'){
                    var pathName = res.data;
                    //根据获得的excel名称，下载对应的excel
                    downloadByFileName(pathName);
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            }
        );
    });
    //绑定审批历史
    $("#show_history").click(function(){
        var checklist = $('#relationTable').bootstrapTable('getSelections');

        if(checklist==null||checklist.length ==0){
            layer.msg('请选择一条数据',{icon:3});
            return;
        }

        if(checklist.length !=1){
            layer.msg('仅能选择一条数据',{icon:3});
            return;
        }

        var selectData = checklist[0];
        if('01' ==relaStatus){
            return;
        }
        showRelationWorkFlowHistory(selectData);
    });
});


//创建表格
var TableObj = {
    //查询页表格
    relationSearchPageTable: function () {
        var columns = [];
        columns = [
            {
                field: 'check',
                checkbox: true,
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'acctId',
                title: '账户编号',
            }, {
                field: 'bizType',
                title: '业务类型',
            }, {
                field: 'custName',
                title: '客户名称',
            }, {
                field: 'custId',
                title: '客户编号'

            },
            {
                field: 'cerNum',
                title: '客户证件号'

            },
            {
                field: 'cerTypeDesc',
                title: '证件类型',
            },
            {
                field: 'orgName',
                title: '所属机构',
            },
            {
                field: 'relaRatioDesc',
                title: '关联详情',
            },
            {
                field: 'relaStatusDesc',
                title: '关联状态',
            },
            {
                field: '',
                title: '操作',
                clickToSelect: false,
                events: operateEvents,
                formatter: function (value, row, index) {
                    var existIs = row.relaStatus != null && row.relaStatus != undefined;
                    if (!existIs) {
                        return;
                    }

                    if (row.relaStatus == '04' || row.relaStatus == '07') {
                        var html = "";
                        if (hasUpdatePermiss) {
                            html += '<a id="todo_edit"  class="oper-left"><b>编辑</b></a>'
                                + '<span class="oper-mid" >|</span>';
                        }
                        if (hasDelPermiss) {
                            html += '<a id="todo_delete" class="oper-right"><b>删除</b></a>';
                        }
                        return html;
                    } else if (row.relaStatus == '02' || row.relaStatus == '05') {
                        var html = "";
                        if (hasUpdatePermiss) {
                            html += '<a id="todo_edit"  class="oper-left"><b>编辑</b></a>';
                        }
                        if (hasDelPermiss) {
                            html += '<a id="todo_delete_process" class="oper-right"><b>删除</b></a>';
                        }
                        return html;
                    } else if(row.relaStatus == '03' || row.relaStatus == '06'
                        || row.relaStatus == '09'){
                        var html = "";
                       /* if (hasDelPermiss) {
                            html += '<a id="todo_goBack" onclick="" class="oper-right"><b>撤销</b></a>';
                        }*/

                        if(row.initpersionTag=='1' && row.initpersionisgobackTag=='1'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
                            //非结束节点、任务发起人，可撤回

                                html += '<span class="oper-mid" ></span><a id="todo_goBack" class="oper-left" ><b>撤回</b></a>';

                        }

                        // 非结束节点
                        //是最新处理人、到达该节点是通过，可撤回
                        if(row.initpersionisgobackTag=='0'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
                            if(row.procerpersionTag=='1'&&row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='1') {
                                    html += '<span class="oper-mid" ></span><a id="todo_goBack" class="oper-left" ><b>撤回</b></a>';
                            }
                        }
                        return html;
                    }else if(row.relaStatus == '08'){
                        var html = "";
                        if (hasDelPermiss) {
                            html += '<a id="todo_delete_process" class="oper-right"><b>删除</b></a>';
                        }
                        return html;

                    }else {
                        return "";
                    }


                }
            }
        ];


        $('#relationTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_index/selectByPage.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            height: getTableHeight(document),
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    /* 'orgId': $('#orgId').val(),
                     'empId': $('#empId').val(),
                     'bizTypeCds': $('#bizTypeCds').val(),
                     'relaRoleIds': $('#relaRoleIds').val(),
                     'acctId': $('#acctId').val(),
                     'custName': $('#custName').val(),
                     'cerNum': $('#cerNum').val(),
                     'relaStatus': $('#relaStatus').val()*/
                    'orgId': orgId,
                    'empId': empId,
                    'bizTypeCds': bizTypeCds,
                    'relaRoleIds': relaRoleIds,
                    'acctId': acctId,
                    'custName': custName,
                    'cerNum': cerNum,
                    'relaStatus':relaStatus
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (data) {
                $('#relationTable').bootstrapTable('checkBy', {
                    field: "key",
                    values: arrayTmp
                });
                resizeTables();
            },
            onCheck: function (row, $element) {
                var acctId = row.acctId;
                var bizTypeCd = row.bizTypeCd;

                var key = row.key;
                if (arrayTmp.indexOf(key) < 0) {
                    arrayTmp.push(key);
                    array.push(row);
                }


            },
            onUncheck: function (row, $element) {

                var key = row.key;
                if (arrayTmp.indexOf(key) >= 0) {
                    arrayTmp.splice(arrayTmp.indexOf(key), 1);
                    if(array.indexOf(row) >=0){
                        array.splice(array.indexOf(row), 1);
                    }
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].key;
                        if (arrayTmp.indexOf(key) < 0) {
                            arrayTmp.push(key);
                            array.push(rows[i]);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].key;
                        if (arrayTmp.indexOf(key) >= 0) {
                            arrayTmp.splice(arrayTmp.indexOf(key), 1);
                            if(array.indexOf(rows[i]) >=0){
                                array.splice(array.indexOf(rows[i]), 1);
                            }
                        }
                    }
                }

            }
        });
    },
    //业绩分配表
    relationMarkInIndexTableObj: function () {
        var columns = [
            {
                field: 'check',
                checkbox: true
            },
            {
                field: 'number',
                title: '序号',
                align: "center",
                valign: "middle",
                formatter: function (value, row, index) {
                    row.number = index + 1;
                    return index + 1;
                }
            },
            {
                field: 'relaRoleId',
                title: '关联角色',
                align: "center",
                valign: "middle",
                editable: {
                    type: 'select',
                    title: '关联角色',
                    source: $.param.getEditableJsonByParentIdByType('AB0006'),
                    // mode: 'inline',
                    placement: 'top',
                    emptytext: "空",
                    validate: function (value) {

                        if (value == null || value == '') {
                            return "关联角色必选";
                        }
                    }
                },
            },
            {
                field: 'empId',
                title: '员工ID',
                align: "center",
                valign: "middle",
                editable: {
                    type: 'text',
                    title: '员工ID',
                    //mode: 'inline',
                    placement: 'top',
                    emptytext: "空",
                    validate: function (value) {

                        if (!value) {
                            return '员工ID必填项';
                        }
                        //根据员工ID查询员工信息更新员工姓名和员工所属机构
                        var user = undefined;
                        var acctArray = new Array();
                        acctArray.push(acctData);
                        var queryParam={
                            'acctData':  acctArray,
                            'empNum':value
                        };
                        var res = $.param.validEmpNum(queryParam);
                        if(res.code =='401'){
                            return res.message;
                        }

                        if (res.code != 200 ) {
                            return '校验失败';
                        }
                        user = res.data;
                        if (user == null || user == undefined) {
                            return '该员工不存在';
                        }

                        disableSiblingsAndSetValue($(this), "empName", user.empName);
                        disableSiblingsAndSetValue($(this), "belongOrgName", user.belongOrgDesc);
                        disableSiblingsAndSetValue($(this), "belongOrgId", user.belongOrgId);

                    }
                }
            },
            {
                field: 'empName',
                title: '员工姓名',
                align: "center",
                valign: "middle",
                editable: {
                    type: 'text',
                    emptytext: "空",
                    disable: true

                }
            },
            {
                field: 'belongOrgName',
                title: '员工所属机构',
                align: "center",
                valign: "middle",
                editable: {
                    type: 'text',
                    emptytext: "空",
                    disable: true
                }

            },
            {
                field: 'relaRatio',
                title: '关联比例',
                align: "center",
                valign: "middle",
                editable: {
                    type: 'text',
                    title: '关联比例',
                    //mode: 'inline',
                    placement: 'top',
                    emptytext: "空",
                    validate: function (v) {
                        if (v == null || v == '' || v == undefined) {
                            return '关联比例必填项';
                        }
                        var r = /^\+?[1-9][0-9]*$/;

                        if (!r.test(v)) {

                            return '关联比例必须是大于0小于等于100的整数';
                        }


                      /*  var floatFormat = parseFloat(v);
                        if (floatFormat > 100 || floatFormat < 0) {
                            return '关联比例必须是大于0小于等于100的整数';
                        }*/

                    }
                }
            },
            {
                field: 'effDt',
                title: '生效日期',
                align: "center",
                valign: "middle",
                formatter: function (value, row, index) {
                    var dt;
                    if (value) {
                        dt = new Date(value);
                        return dt.Format("yyyy-MM-dd");
                    } else {
                        return '';
                    }


                },
                editable: {
                    type: 'date',
                    title: '生效日期',
                    //mode:'inline',
                    placement: 'left',
                    format: 'yyyy-mm-dd',
                    emptytext: "空",
                    validate: function (value) {
                        if (value == null || value == '') return "生效日期必填";
                    },
                }
            }
        ];
        $('#relationMarkTableInIndex').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_index/selectAllAcctInfo.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            //"queryParamsType": "limit",
            queryParams: function (params) {
                return {
                    'acctId': acctData.acctId,
                    'cerNum': acctData.cerNum,
                    'bizTypeCd': acctData.bizTypeCd,
                    'custId': acctData.custId,
                    'orgId': acctData.orgId,
                    'relaStatus': acctData.relaStatus,
                };
            },
            contentType: "application/x-www-form-urlencoded",
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            //pageNum: 1,      //初始化加载第一页，默认第一页
            //pageSize: 5,      //每页的记录行数（*）
            //pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    oldTable = JSON.parse(JSON.stringify(res.data));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            rowStyle: function (row, index) {
                if (row.isAdd) {
                    return {classes: 'info'};
                } else {
                    return {};
                }
            },
            onPreBody: function () {
                $(document).on('pre-body.bs.table', function () {
                    layer.closeAll('loading');
                });
            },
            onLoadSuccess: function (data) {
                initBootStrapTablevalidateEdit($("#relationMarkTableInIndex"));
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#relationMarkTableInIndex").bootstrapTable("resetView");

            },
            columns: columns,

        });
    }

};

window.operateEvents = {
    "click #todo_edit": function (e, value, row, index) {

        var checklist = $('#relationTable').bootstrapTable('getSelections');
        if (checklist != null && checklist.length >= 2) {
            layer.msg('只能对当前数据进行操作', {icon: 3});
            return;
        }

        if (checklist != null && checklist.length == 1 && checklist[0]['acctId'] != row.acctId) {
            layer.msg('只能对当前数据进行操作', {icon: 3});
            return;
        }
        acctData = row;
        if (row.bizTypeCd == null || row.bizTypeCd == undefined) {
            return;
        }
        $.ajax({
            url: portal.bp() + './json/relation/relation_index/selectRoleCusType.json',
            type: 'post',
            async: false,
            cache: false,
            data: {
                'bizTypeCd': row.bizTypeCd
            },
            success: function (data) {
                if (data.code == '200' && data.data != null && data.data != undefined
                    && data.data != '') {
                    roleTypeCode = data.data;

                } else {
                    layer.msg(res.message, {icon: 2});
                    return;
                }
            }
        });
        $('#relationMark').modal('show');
        TableObj.relationMarkInIndexTableObj();


    },
    "click #todo_delete": function (e, value, row, index) {
        var checklist = $('#relationTable').bootstrapTable('getSelections');
        if (checklist != null && checklist.length >= 2) {
            layer.msg('只能对当前数据进行操作', {icon: 3});
            return;
        }

        if (checklist != null && checklist.length == 1 && checklist[0]['acctId'] != row.acctId) {
            layer.msg('只能对当前数据进行操作', {icon: 3});
            return;
        }
        layer.confirm("是否确认删除该条记录", {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var acctArray = new Array();
            row.oprType = '0';
            acctArray.push(row);
            var data = {
                'acctData': acctArray,
                'operType': '0',
                'approvalFlag': '0'
            };
            $.ajax({
                url: portal.bp() + './json/ok.json',
                type: 'post',
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(data),
                success: function (data) {
                    if (data.code == '200') {
                        layer.msg("删除已保存成功", {icon: 1});
                        TableObj.relationSearchPageTable();
                    } else {
                        layer.msg(data.message, {icon: 2});
                    }
                }
            });


        }, function () {

        });
    },
    //todo_goBack
    "click #todo_goBack": function (e, value, row, index) {
        relationWorkflowGoback(row.taskNum,row.relaStatus,row.bizTypeCd,row.acctId);
    },
        //关联状态为保存未提交时，删除
    "click #todo_delete_process":function (e, value, row, index) {
        if(row==null){
            return;
        }
        var paramArray = new Array();
        paramArray.push(row);
        $.ajax({
            url: portal.bp() + '/relation/todo_del_process',
            type: 'post',
            cache: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:  JSON.stringify(paramArray),
            success: function (data) {
                if (data.code == '200') {
                    layer.msg("删除已保存成功", {icon: 1});
                    TableObj.relationSearchPageTable();
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            }

        })

    }
}

//查询
function query() {
    relaStatus = $('#relaStatus').val();
    orgId = $('#orgId').val();
    empId = $('#empId').val();
    bizTypeCds = $('#bizTypeCds').val();
    relaRoleIds = $('#relaRoleIds').val();
    acctId = $('#acctId').val();
    custName = $('#custName').val();
    cerNum = $('#cerNum').val();
    switch (relaStatus) {
        case '02':
        case '05':
        case '08':
            $('#relationApproval_btn').attr("style", "display:inline");
            $('#show_history').attr("style", "display:inline");
            $('#batchDelete').attr("style", "display:inline");
            break;
        case '03:06:09':
        case '04:07':
        case '10':
            $('#relationApproval_btn').attr("style", "display:none");
            $('#show_history').attr("style", "display:inline");
            $('#batchDelete').attr("style", "display:none");
            break;
        default:
            $('#relationApproval_btn').attr("style", "display:none");
            $('#show_history').attr("style", "display:none");
            $('#batchDelete').attr("style", "display:none");
    }
    arrayTmp = [];
    array = [];
    TableObj.relationSearchPageTable();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder();
    $('#bizTypeCds').selectpicker('refresh');
    $('#orgId').selectpicker('refresh');
    $('#relaRoleIds').selectpicker('refresh');
    $('#relaStatus').selectpicker('refresh');

    $('#bizTypeCds').selectpicker('val', '01').selectpicker('refresh').change();
    $('#relaStatus').selectpicker('val', '04:07').selectpicker('refresh').change();

}

//获取机构列表
function getOrgList() {
    $.ajax({
        url: portal.bp() + './json/relation/relation_index/validOrgNotFFBSForGroup.json',
        type: "get",
        data: {'menuId': '1100'},
        cache: false,
        dataType:'json',
        success: function (data) {
            var html;
            var list = data.data;
            $.each(list, function (key, value) {
                html += '<optgroup label="' + key + '">';
                $.each(value, function (index, item) {
                    html += '<option value="' + item.orgId + '">' + item.orgName + '</option>';
                });
                html += '</optgroup>';
            })
            $('#orgId').html(html);
            $('#orgId').selectpicker('refresh');
        }
    });
}
function getBizTypeCd() {
    var bizTypeList = "";
    $.ajax({
        url: portal.bp() + './json/relation/getBizTypeCd.json?r=' + Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
             bizTypeList = data.data;
        }
    });

    return bizTypeList;
}
function showRelationWorkFlowHistory(data) {
   var acctId= data.acctId == null || data.acctId == undefined || data.acctId ==''?'':data.acctId;
   var bizTypeCd= data.bizTypeCd ==null ||data.bizTypeCd ==undefined ||data.bizTypeCd==''?'':data.bizTypeCd ;
   var taskNum= data.taskNum == null || data.taskNum == undefined || data.taskNum =='' ?'':data.taskNum;
   var oprType= data.oprType == null || data.oprType == undefined || data.oprType =='' ?'':data.oprType;
   var relaStatusTmp= data.relaStatus == null || data.relaStatus == undefined || data.relaStatus =='' ?'':data.relaStatus;
        layer.open({
            type:2,
            title:'审批详情',
            shadeClose:true,
            shade:0.8,
            area:['700px','520px'],
            content:portal.bp() + "./relation/approval_History.html?acctId="+acctId+"&"+
                "bizTypeCd="+bizTypeCd+'&'+"relaStatus="+relaStatusTmp+"&"+"taskNum="+taskNum+"&oprType="+oprType
        });
};
//撤销
function relationWorkflowGoback(taskNum,relaStatus,bizTypeCd,acctId){
    var res = false;
    $.ajax({
        url: portal.bp() + '/relation/goback?r='+Math.random(),
        type: 'POST',
        async: false,
        data:{"taskNum":taskNum,
            "relaStatus":relaStatus,
            "bizTypeCd":bizTypeCd,
            "acctId":acctId
            },
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
            TableObj.relationSearchPageTable();
            res = true;
        } else {
            layer.msg(data.message, {icon: 2});
        }
    })
};
