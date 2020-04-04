//角色类型
var roleType = undefined;
//角色类型码值
var roleTypeCode = undefined;
//编辑时的行索引
var rowIndex = undefined;
//选中的要进行业绩分配的数据
var acctData = undefined;

var oldTable;

var deleteIds = [];

var filedNameArray = ['key','acctId','bizType','custName','custId','cerNum','orgName', 'check', 'Number','cerTypeDesc'];
$(function () {



    getBizTypeCd();
    document.getElementById('bizTypeCds').options.selectedIndex = '0';
    $('#bizTypeCds').selectpicker('refresh');


    $('#bizTypeCds').on('changed.bs.select',function(a,b,c,d){
        if(!$(this).selectpicker('val')){
            //必选
            document.getElementById('bizTypeCds').options.selectedIndex = '0';
            $('#bizTypeCds').selectpicker('refresh');
            layer.msg("业务类型必选",{icon:3});
        }
    });
    TableObj.relationAddTable();
    //业绩分配-添加
    $('#relationMark_add').click(function () {
        var length = $("#relationMarkTable").bootstrapTable("getData").length;
        //var addtRcrdTm = getSystemDate("yyyy-MM-dd hh:mm:ss");
        $("#relationMarkTable").bootstrapTable("insertRow", {
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
            }
        });

    });

    //业绩分配-删除
    $('#relationMark_del').click(function () {
        var length = $("#relationMarkTable").bootstrapTable("getData").length;
        var checklist = $('#relationMarkTable').bootstrapTable('getSelections');
        var ids = [];
        $.each(checklist, function (index, item) {
            ids.push(item.number);
            if (item.addtRcrdId != undefined && item.addtRcrdId != null && item.addtRcrdId != '') {
                deleteIds.push(item.addtRcrdId);
            }
        });
        $("#relationMarkTable").bootstrapTable("remove", {
            field: 'number',
            values: ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#relationMarkTable"));

    });
    //业绩分配-保存
    $('#relationMark_save').click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($('#relationMarkTable'));
        if (validateError != null) {
            layer.msg(validateError, {icon: 2});
            return;
        }

        var addData = [];
        var tableData = $('#relationMarkTable').bootstrapTable("getData");
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
        var data = {
            'addData': addData,
            'acctData': acctArray,
            'operType': '2',
            'approvalFlag': '0'
        };
        var index;
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
                    $('#relationApproval').modal('show');
                    TableObj.relationApproval();
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        });

    });
    //审批通过
    $('#relationApproval_btn').click(function () {

        var checklist = $('#relationApprovalTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("至少选择一条记录", {icon: 3});
        } else {
            var array = new Array();
            var arrayTmp = new Array();
            var object = new Object();
            for(var i=0;i<checklist.length;i++){
                var acctId= checklist[i]['acctId'];
                var bizTypeCd = checklist[i]['bizTypeCd'];
                var key = acctId + '::' + bizTypeCd;
                if(arrayTmp.indexOf(key)<0){
                    arrayTmp.push(key);
                    array.push(checklist[i]);
                }

            }
            object['acctData']=array;
            var index;
            $.ajax({
                url: portal.bp() + './json/ok.json',
                type: 'post',
                cache: false,
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(object),
                success: function (data) {
                    if (data.code == '200') {
                        layer.msg("提交审批成功", {icon: 1});
                        $('#relationApproval').modal('hide');
                    } else {
                        layer.msg(data.message, {icon: 2});
                    }
                },
                beforeSend:function(XMLHttpRequest){
                    index = layerLoad();
                },
                complete:function(XMLHttpRequest){
                    layerClose(index);
                }
            });
        }
    });
    /* $('#relationMark').on('hidden.bs.modal', function () {
     });*/


});


//创建表格
var TableObj = {
    //查询页表格
    relationAddTable: function () {
        var columns = [
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'acctId',
                title: '账号编号',
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
                field: '',
                title: '操作',
                clickToSelect: false,
                events: operateEvents,
                formatter: function (value, row, index) {
                    return '<a id="todo_edit"  class="oper-mid" ><b style="color: #0e9aef">修改</b></a>';
                }
            }
        ];

        $('#relationTable').bootstrapTable({
            url: portal.bp() + './json/relation/relation_edit/selectRelInoByPageNoBizType.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height:getTableHeight(document),
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'acctId': $('#acctId').val(),
                    'custName': $('#custName').val(),
                    'cerNum': $('#cerNum').val(),
                    'empId': $('#empId').val(),
                    'bizTypeCds':$('#bizTypeCds').val()

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
            columns: columns
        });
    },

    //业绩分配表
    relationMarkTableObj: function () {
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
                    //mode: 'inline',
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
                        };

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
                        if (v == null || v == '' || v==undefined) {
                            return '关联比例必填项';
                        }
                        var r = /^\+?[1-9][0-9]*$/;

                        if(!r.test(v)){

                            return '关联比例必须是大于0小于等于100的整数';
                        }


                        var floatFormat = parseFloat(v);
                        if (floatFormat > 100 || floatFormat < 0) {
                            return '关联比例必须是大于0小于等于100的整数';
                        }
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
                    if(value){
                         dt = new Date(value);
                    }else{
                        dt = new Date();
                    }
                    return dt.Format("yyyy-MM-dd");
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
        $('#relationMarkTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_index/selectAllAcctInfo.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            height:600,
            "queryParamsType": "limit",
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
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
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
            onPreBody:function () {
                $(document).on('pre-body.bs.table', function () {
                    layer.closeAll('loading');
                });
            },
            onLoadSuccess: function (data) {
                initBootStrapTablevalidateEdit($("#relationMarkTable"));
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#relationMarkTable").bootstrapTable("resetView");
                /*   if(row.addtRcrdId!=null&&row.addtRcrdId!=''){
                       //修改
                       $.each(oldTable.rows,function(index,item){
                           if(item.addtRcrdId===row.addtRcrdId){
                               if(eval("item."+field)===eval("row."+field)){
                                   $el.removeClass('update-cell-data');
                                   //修改标志
                                   if(row.updateCell==undefined||row.updateCell==null){
                                       row.updateCell = {};
                                   }
                                   delete row.updateCell[field];
                               }else{
                                   $el.addClass('update-cell-data');
                                   //修改标志
                                   if(row.updateCell==undefined||row.updateCell==null){
                                       row.updateCell = {};
                                   }
                                   row.updateCell[field] = '1';
                               }
                           }
                       });
                   }*/
            },
            columns: columns,
        });
    },
    //relationApprovalTable
    relationApproval: function () {
        var columns = [
            {
                field: 'check',
                checkbox: true
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
                title: '账号编号',
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
                field: 'relaRoleDesc',
                title: '关联角色类型',
            },
            {
                field: 'empId',
                title: '员工ID',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'relaRatioDesc',
                title: '关联比例(%)',
            }
        ];

        $('#relationApprovalTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_add/selectApprovalInfoByAcctIds.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
           // height:getTableHeight(document),
            contentType: "application/json;charset=UTF-8",
            queryParams: function (params) {
                var acctDataCopy = JSON.parse(JSON.stringify(acctData));
                acctDataCopy.relaStatus = '05';
                acctDataCopy.oprType = '2';
                var array = new Array();
                array.push(acctDataCopy);
                var paramObject = new Object();
                paramObject['acctData'] = array;
                paramObject['oprType'] = '2';

                var paramStr = JSON.stringify(paramObject);
                return paramStr;

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
            onLoadSuccess:function (res) {
                mergeCell(res.rows, 'key', 1, '#relationApprovalTable');
                resizeTables();
            }
        });
    }

};

window.operateEvents = {
    "click #todo_edit": function (e, value, row, index) {
        acctData = row;
        if (row.bizTypeCd == null || row.bizTypeCd == undefined) {
            return;
        }
        var index;
        $.ajax({
            url: portal.bp() + './json/relation/relation_index/selectRoleCusType.json',
            type: 'post',
            async: false,
            cache: false,
            dataType:'json',
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
            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        });
        $('#relationMark').modal('show');
        TableObj.relationMarkTableObj();
    }
}

//查询
function query() {
    $('#relationTable').bootstrapTable('destroy');
    TableObj.relationAddTable();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    //$('#bizTypeCds').selectpicker('refresh');
    document.getElementById('bizTypeCds').options.selectedIndex = '0';
    $('#bizTypeCds').selectpicker('refresh');
}

//初始化机构选择列表
function getOrgList(item) {
    $.ajax({
        url: portal.bp() + '/org/allValidOrgForGroup',
        type: "get",
        cache: false,
        success: function (data) {
            var html = undefined;
            var list = data.data;
            $.each(list, function (key, value) {
                html += '<optgroup label="' + key + '">';
                $.each(value, function (index, item) {
                    html += '<option value="' + item.orgId + '">' + item.orgName + '</option>';
                })
                html += '</optgroup>';
            });

            $('#' + item).html(html);
            $('#' + item).selectpicker('refresh');
        }
    });

}

function mergeCell(data, fieldName, colspan, target) {

    if (data.length == 0) {
        return;
    }

    if (data.length == 1) {
        $(target).bootstrapTable('updateCell', {index: 0, field: 'Number', value: 1});
        return;
    }


    numArr = [];
    var value = data[0][fieldName];
    var num = 0;
    for (var i = 0; i < data.length; i++) {
        if (value != data[i][fieldName]) {
            numArr.push(num);
            value = data[i][fieldName];
            num = 1;
            continue;
        }
        num++;
    }
    if (num > 1) {
        numArr.push(num);
    }

    var flag = false;


    var merIndex = 0;
    for (var i = 0; i <= numArr.length; i++) {

        if (merIndex >= data.length) {
            break;
        }
        $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        merIndex += numArr[i];
    }
    var merIndex = 0;
    for (var i = 0; i < numArr.length; i++) {
        mergeTool(target, merIndex, filedNameArray, colspan, numArr[i]);
        merIndex += numArr[i];
    }


}

function mergeTool(target, merIndex, filedNameArray, colspan, rowspan) {
    for (var j = 0; j < filedNameArray.length; j++) {
        $(target).bootstrapTable('mergeCells', {
            index: merIndex,
            field: filedNameArray[j],
            colspan: colspan,
            rowspan: rowspan
        });
    }
};
function getBizTypeCd() {
    var html = "";
    $.ajax({
        url: portal.bp() + './json/relation/getBizTypeCd.json?r=' + Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
            var col = data.data;
            $.each(col, function (index, item) {
                html += "<option value='" + item.encode + "'>" + item.name + "</option>"
            });
        }
    });

    $("#bizTypeCds").html("").append(html).selectpicker('refresh');
};
