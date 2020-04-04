var filedNameArray = ['key', 'acctId', 'bizType', 'custName', 'custId', 'cerNum', 'orgName', 'check', 'number', 'cerTypeDesc', 'importRstDesc'];
var exportFlag = false;
var resultSearch = '';
var resultSearchSuccess = '';
var resultSearchFailed = '';
var checkKey = [];
$(function () {

    //$("#bizTypeCds").html("").append($.param.getSelectOptionOrderByName("AB0004")).selectpicker('refresh');
    getBizTypeCd();
    document.getElementById('bizTypeCds').options.selectedIndex = '0';
    $('#bizTypeCds').selectpicker('refresh');
    //$("#bizTypeCds").selectpicker('val','33');
    $('#bizTypeCds').on('changed.bs.select', function (a, b, c, d) {
        if (!$(this).selectpicker('val')) {
            //必选
            document.getElementById('bizTypeCds').options.selectedIndex = '0';
            $('#bizTypeCds').selectpicker('refresh');
            layer.msg("业务类型必选", {icon: 3});
        }
    });
    TableObj.relationBatchEditFactory(true);
    TableObj.importFailedTableEditFactory();
    TableObj.importSuccessTableEditFactory();
    TableObj.importDescTableFactory();

    $('#errorTable_export').click(function () {

        window.open(portal.bp() + '/relation/exportExcel?oprType=2')

    });
    //提交审批
    $('#successTable_approval').click(function () {
        var checklist = $('#importSuccessEditTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("至少选择一条记录", {icon: 3});
        } else {
            var array = new Array();
            var arrayTmp = new Array();
            var object = new Object();
            for (var i = 0; i < checklist.length; i++) {

                var acctId= checklist[i]['acctId'];
                var bizTypeCd = checklist[i]['bizTypeCd'];
                var key = acctId + '::' + bizTypeCd;
                if(arrayTmp.indexOf(key)<0){
                    arrayTmp.push(key);
                    checklist[i]['oprType'] = '2';
                    array.push(checklist[i]);
                }
            }
            object['acctData'] = array;
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
                        layer.msg("提交审批成功", {icon: 1,time:1000});
                        TableObj.importSuccessTableEditFactory();
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

    $('#batchEditTable_refresh').click(function () {
        checkKey = [];
        exportFlag = true;
        TableObj.relationBatchEditFactory();

    });
    $('#successTable_refresh').click(function () {
        TableObj.importSuccessTableEditFactory();
    });
    $('#errorTable_refresh').click(function () {
        TableObj.importFailedTableEditFactory();
    });
    //导出
    $('#batchEditExp').click(function () {
        if (exportFlag) {
            batchExport();
        }
    });
});

function importEditfuc() {

    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE") >= 1) {
        //IE浏览器
        var fileName = $("#uploadExcel").val();
        if (fileName == undefined || fileName == null || fileName == '') {
            layer.msg('请选择文件', {icon: 3});
            return;
        }
        var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        if (fileType != '.xls' && fileType != '.xlsx') {
            layer.msg('文件格式必须为xls或xlsx', {icon: 3});
            return;
        }
    } else {
        var file = $("#uploadExcel")[0].files;
        var filemaxsize = 50 * 1024 * 1024; //50M
        if (file.length == 0) {
            layer.msg('请选择文件', {icon: 3});
            return;
        }
        var fileName = file[0].name;
        var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        if (fileType != '.xls' && fileType != '.xlsx') {
            layer.msg('文件格式必须为xls或xlsx', {icon: 3});
            return;
        }
        if (file[0].size > filemaxsize) {
            layer.msg('文件过大，必须小于50MB', {icon: 2});
            return;
        }
    }

    $("#formSearch").ajaxSubmit({
        url: portal.bp() + '/relation/importExcel',
        async: true,
        type: 'post',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: {
            'oprType': '2'
        },

        success: function (data) {
            if (data.code == "200") {
                var res = data.data;
                var resStr = '成功' + res.success + '条,' + '失败' + res.failed + '条'
                layer.msg(resStr, {
                    icon: 1
                });
            } else {
                layer.msg(data.message, {
                    icon: 2
                });
            }
        },
        beforeSend: function (XMLHttpRequest) {
            layer.load(1);
        },
        complete: function (XMLHttpRequest) {
            layer.closeAll('loading');
        }
    });

}

function exportfnc() {
    window.open(portal.bp() + '/relation/downloadDemoExcel');
}

//创建表格
var TableObj = {
    importSuccessTableEditFactory: function () {
        var columns = [
            {
                field: 'check',
                checkbox: true
            },
            {
                field: 'number',
                title: '序号',
                align: 'center'
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
                title: '证件类型'

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
                title: '员工编号',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'relaRatio',
                title: '关联比例(%)',
            }
        ];

        $('#importSuccessEditTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_batch_edit/importBatchSuccess.json',
            method: 'post',      //请求方式（*）
            striped: false,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'searchFlag': '1',
                    'oprType': '2'
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {

                    resultSearchSuccess = res.data.sameArray;
                    return res.data.pageFinder;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return;
                }
            },
            onLoadSuccess: function (res) {
                mergeCell(res.rows, 'key', 1, '#importSuccessEditTable', resultSearchSuccess);
                resizeTables();
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            rowStyle: rowStyle
        });
    },
    importFailedTableEditFactory: function () {

        var columns = [
            {
                field: 'number',
                title: '序号',
                align: 'center'
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
                title: '证件类型'

            },
            {
                field: 'orgName',
                title: '所属机构',
            },
            {
                field: 'importRstDesc',
                title: '失败原因',
            },
            {
                field: 'relaRoleDesc',
                title: '关联角色类型',
            },
            {
                field: 'empId',
                title: '员工编号',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'relaRatio',
                title: '关联比例(%)',
            }
        ];

        $('#importFailedTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/relation/relation_batch_edit/importBatchFailed.json',
            method: 'post',      //请求方式（*）
            striped: false,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            //height:560,
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'searchFlag': '0',
                    'oprType': '2'
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {

                    resultSearchFailed = res.data.sameArray;
                    return res.data.pageFinder;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return;
                }
            },
            onLoadSuccess: function (res) {
                mergeCell(res.rows, 'key', 1, '#importFailedTable', resultSearchFailed);
                resizeTables();
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            rowStyle: rowStyle
        });
    },
    relationBatchEditFactory: function (flag) {
        var url = portal.bp() + './json/relation/relation_transfer/selectAcctInfoFromRealInfo.json';

       /* if (flag) {
            url = undefined;
        }*/

        var columns = [
             {
                field: 'check',
                checkbox: true
            },
            {
                field: 'number',
                title: '序号',
                align: 'center'
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
                title: '关联角色',
            },
            {
                field: 'empId',
                title: '员工编号',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'belongOrgName',
                title: '员工所属机构',
            },
            {
                field: 'relaRatioDesc',
                title: '关联比例(%)',
            },
            {
                field: 'relaStatusDesc',
                title: '关联状态',
            }
        ];

        $('#relationBatchEdit').bootstrapTable('destroy').bootstrapTable({
            url: url,
            method: 'post',      //请求方式（*）
            striped: false,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            singleSelect: false,    //是否单选，true时没有全选按钮
            contentType: "application/json;charset=UTF-8",
            queryParams: function (params) {
                var acctInfoObj = new Object();
                acctInfoObj['relaStatus'] = '07';
                acctInfoObj['empId'] = $('#empId').val();
                acctInfoObj['bizTypeCds'] = $('#bizTypeCds').val();
                var array = new Array();
                array.push(acctInfoObj);
                var acct = new Object();
                acct['acctData'] = array;
                acct['pageSize'] = params.limit;
                acct['pageNum'] = (params.offset / params.limit) + 1;
                var paramStr = JSON.stringify(acct);
                return paramStr;
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 20,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: 470,
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {

                    resultSearch = res.data.sameArray;
                    return res.data.pageFinder;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return;
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            rowStyle: rowStyle,
            onLoadSuccess: function (data) {
                mergeCell(data.rows, 'key', 1, '#relationBatchEdit', resultSearch);
                $('#relationBatchEdit').bootstrapTable('checkBy', {
                    field: "key",
                    values: checkKey
                });
                resizeTables();
            },
            onCheck: function (row, $element) {

                var key = row.key;
                if (checkKey.indexOf(key) < 0) {
                    checkKey.push(key);
                }


            },
            onUncheck: function (row, $element) {

                var key = row.key;
                if (checkKey.indexOf(key) >= 0) {
                    checkKey.splice(checkKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].key;
                        if (checkKey.indexOf(key) < 0) {
                            checkKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].key;
                        if (checkKey.indexOf(key) >= 0) {
                            checkKey.splice(checkKey.indexOf(key), 1);
                        }
                    }
                }

            }

        });
    },
    importDescTableFactory: function () {
        var columns = [
            /*{
                field: 'check',
                checkbox: true
            },*/
            /*{
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },*/ {
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
                title: '证件类型'

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
                title: '员工编号',
            },
            {
                field: 'empName',
                title: '员工姓名',
            },
            {
                field: 'relaRatio',
                title: '关联比例(%)',
            },
            {
                field: 'effDt',
                title: '生效日期',
            }]
        var dataExample = [{
            'acctId': '000001', 'bizType': '公司存款', 'custName': '测试用户', 'custId': '000001',
            'cerNum': '000001', 'cerTypeDesc': '身份证', 'orgName': '支行', 'relaRoleDesc': '营销人', 'empId': '000001',
            'empName': '测试姓名', 'relaRatio': '100', 'effDt': '2019/06/01', 'invalidDt': '2999/12/31'
        }];
        $('#importDescTable').bootstrapTable('destroy').bootstrapTable({
            data: dataExample,
            method: 'post',      //请求方式（*）
            striped: false,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height: 500,
            contentType: "application/x-www-form-urlencoded",
            /*queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'searchFlag': '0',
                    'oprType' : '1'
                };
            },*/
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
			onLoadSuccess: function (data) {
				//mergeCell(data.rows, 'key', 1, '#importFailedTable');
				resizeTables();
			},
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            rowStyle: rowStyle
        });

    }
};

//查询
function query() {
    exportFlag = true;
    checkKey = [];
    TableObj.relationBatchEditFactory();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#bizTypeCds').selectpicker('refresh');
}


function mergeCell(data, fieldName, colspan, target, numArr) {

    if (data.length == 0) {
        return;
    }

    if (data.length == 1 || numArr == undefined) {

        return;
    }


    /*numArr = [];
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
    }*/

    //var merIndex = 0;
    /*for (var i = 0; i <= numArr.length; i++) {

        if (merIndex >= data.length) {
            break;
        }
        $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        merIndex += numArr[i];
    }*/
    var merIndex = 0;
    //var numArr = JSON.parse(sameIndex);
    for (var i = 0; i < numArr.length; i++) {
        /*if (merIndex < data.length) {
            $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        }*/
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
}

function batchExport() {

    var acctInfoObj = new Object();
    acctInfoObj['relaStatus']='07';
    acctInfoObj['empId']= $('#empId').val();
    acctInfoObj['bizTypeCds']= $('#bizTypeCds').val();
    acctInfoObj['acctIds']= checkKey;
    var array = new Array();
    array.push(acctInfoObj);
    var acct = new Object();
    acct['acctData']=array;

    var url = portal.bp() + '/relation/exportExcelBatchEdit';

    $.ajax({
        url: url,
        type: 'post',
        cache: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(acct),
        success: function (data) {
            if (data.code == '200') {
                downloadByFileName(data.data);
            } else {
                layer.msg(data.message, {icon: 2});
            }
        }
    });
}


//文件上传
$(document).on('ready', function () {
    $('#uploadExcel').fileinput({
        language: 'zh',
        showUpload: false,
        showPreview: false,
        dropZoneEnable: false,
        showRemove: true,
        browseLabel: '浏览...',
        removeLabel: '移除',
    });
});

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


