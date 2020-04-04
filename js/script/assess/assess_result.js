var assPropOrgId = undefined;
var assPropId = undefined;
var assObjTypeCd = undefined;
var assObjId = undefined;
var assPropName = undefined;
var mon = undefined;
var assPropTypeCd = undefined;
var effDt = undefined;
var isComprehensiveScore = undefined;
var professionTypeCd = undefined;
var date = new Date();
var parseDataDt = date.Format('yyyy-MM-dd');
var parseMon = date.Format('yyyy-MM');
var resultSearchSuccess = [];
var assPropIdList = [];
var checkOrgId = undefined;
var orgListHtml = '';
var filedNameArrayOne = ['assObjId', 'assObjName'];
var filedNameArrayTwo = ['assObjId', 'assObjName','scoreSum'];
var assBasicInfoAndPrv = null;
var assBasicInfoAndPrvCopy = null;
var tableNameType = null;


var comunsOrderInit = [
    [
        {
            "title": "考核对象编号",
            "rowNumber": 1,
            "colNumber": 1,
            "rowspan": 1,
            "colspan": 1,
            "field": "assObjId",
            "align": "center",
            "valign": "middle"
        },
        {
            "title": "考核对象姓名",
            "rowNumber": 1,
            "colNumber": 2,
            "rowspan": 1,
            "colspan": 1,
            "field": "assObjName",
            "align": "center",
            "valign": "middle"
        },
        {
            "title": "打分合计得分",
            "rowNumber": 1,
            "colNumber": 3,
            "rowspan": 1,
            "colspan": 1,
            "field": "sumOfScoreSum",
            "align": "center",
            "valign": "middle"
        }
    ]
];

var comunsOrder = comunsOrderInit;
$(function () {
    $(".effDt").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2,
        autoclose: true,
        todayBtn: true,
        clearBtn: false,
    });
    $(".mon").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm",
        minView: 3,
        startView: 3,
        autoclose: true,
        todayBtn: true,
        clearBtn: false
    });


    //考核对象类型
    $('#assObjTypeCd').html("").append($.param.getSelectOptionOrder("TB0006"));
    $('#assObjTypeCd').selectpicker('refresh');

    //考核方案类型
    $('#assPropTypeCd').html("").append($.param.getSelectOptionOrder("TB0007"));
    $('#assPropTypeCd').selectpicker('refresh');

    //考核业务类型

    $('#professionTypeCd').html("").append($.param.getSelectOptionOrder("PROFESSION_TYPE"));
    //$('#professionTypeCd').attr('disabled', 'disabled');
    $('#professionTypeCd').selectpicker('refresh');
    //$('#isComprehensiveScore').attr('disabled', 'disabled');
    $('#isComprehensiveScore').selectpicker('refresh');

  /*  $("#isComprehensiveScore").removeAttr('disabled');*/
    orgListHtml = initAuthOrgList();
    $('#assPropOrgId').html("").append(orgListHtml);
    $('#assPropOrgId').selectpicker('refresh').selectpicker('val', checkOrgId).change();
    // refreshSelectpicker('assPropOrgId');
    $(".mon").val(parseMon);
    //初始化查询
    TabObj.assessResultTable(true, '01');
    TabObj.resultOrderTable(true);
    //setAsPropIdAndAssPropName(checkOrgId,parseMon);

   /* $("#assPropOrgId").change(function () {
        setAsPropIdAndAssPropName($('#assPropOrgId').val(),$('#assPropTypeCd').val(),$('#assObjTypeCd').val(),$('#effDt').val());
    });
    $("#assPropTypeCd").change(function () {
        setAsPropIdAndAssPropName($('#assPropOrgId').val(),$('#assPropTypeCd').val(),$('#assObjTypeCd').val(),$('#effDt').val());
    });
    $("#assObjTypeCd").change(function () {
        setAsPropIdAndAssPropName($('#assPropOrgId').val(),$('#assPropTypeCd').val(),$('#assObjTypeCd').val(),$('#effDt').val());
    });
    $("#effDt").change(function () {
        setAsPropIdAndAssPropName($('#assPropOrgId').val(),$('#assPropTypeCd').val(),$('#assObjTypeCd').val(),$('#effDt').val());
    });
    $("#assPropId").change(function () {
        var value = $(this).val();
        $('#isComprehensiveScore').val(null);
        $('#professionTypeCd').val(null);
        $('#isComprehensiveScore').attr('disabled', 'disabled');
        $('#professionTypeCd').attr('disabled', 'disabled');
        $('#isComprehensiveScore').selectpicker('refresh');
        $('#professionTypeCd').selectpicker('refresh');
        /!* if (value != null && value != '' && value != undefined) {
             var assPropNameS = getAssPropNameByAssPropNum(value);
             if (assPropNameS != null
                 && assPropNameS != undefined
                 && assPropNameS != '') {
                 $("#assPropName").val(assPropNameS);
                 return;
             }
         } else {
             $("#assPropName").val('');
         }*!/
        if (value == null || value == '' || value == undefined) {

            $("#assPropName").selectpicker('val', '').selectpicker('refresh');
            return;
        }
        $('#assPropName').selectpicker('val',value).selectpicker('refresh');
        //根据考核对象id,查询数据库，确定权限以及业务类型
        findPrvAndAssessResultType(value);
        vaildIsZHDF(assBasicInfoAndPrv);
    });*/

  /*  $("#assPropName").change(function () {
        var value = $(this).val();
        $('#isComprehensiveScore').attr('disabled', 'disabled');
        $('#professionTypeCd').attr('disabled', 'disabled');
        $('#isComprehensiveScore').selectpicker('refresh');
        $('#professionTypeCd').selectpicker('refresh');
       /!* if (value != null && value != '' && value != undefined) {
            var assPropNumS = getAssPropNumByAssPropName(value);
            if (assPropNumS != null
                && assPropNumS != undefined
                && assPropNumS != '') {
                $("#assPropId").val(assPropNumS);
                return;
            }
        } else {
            $("#assPropId").val('');
        }*!/
        if (value == null || value == '' || value == undefined) {
            $("#assPropId").selectpicker('val','').selectpicker('refresh');
            return;
        }
        $("#assPropId") .selectpicker('val',value).selectpicker('refresh');
        findPrvAndAssessResultType(value);
    });
    $('#isComprehensiveScore').change(function () {
        validProfessionType();
    });*/
    //setAsPropIdAndAssPropName($('#assPropOrgId').val(),$('#assPropTypeCd').val(),$('#assObjTypeCd').val(),$('#effDt').val());

    //TabObj.assessResultTable();
    layer.closeAll();
});

var TabObj = {
    assessResultTable: function (initFlag, cloumnType) {
        var url = portal.bp() + './json/assess/assess_result/getResultByPage.json?r=' + Math.random();
       /* if (initFlag) {
            url = '';
        }*/
        // 根据条件判断表名，创建表头
         tableNameType = validTableNameType(initFlag);
        if(tableNameType== null || tableNameType ==''){
            //('校验表头类型失败',{icon: 2});
            return;
        }
        var resultTableHeader = getResultTableHeader(tableNameType);

        if(resultTableHeader ==''|| resultTableHeader == undefined){
            //layer.msg('错误：表头查询失败', {icon:2});
            return;
        }
        $('#assessResultTable').bootstrapTable('destroy');
        $('#assessResultTable').bootstrapTable({
            url: url,
            method: 'POST',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height: getTableHeight(document),
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                  /*  'assPropOrgId':assPropOrgId,
                    'assPropTypeCd':assPropTypeCd,
                    'assObjTypeCd':assObjTypeCd,
                    'effDt':effDt,
                    'mon':mon,
                    'assPropId':assPropId,
                    'assObjId':assObjId,
                    'isComprehensiveScore':isComprehensiveScore,
                    'professionType':professionTypeCd,
                    'tableName':tableNameType,
                    'assObjIdList':assBasicInfoAndPrv == null || assBasicInfoAndPrv['assObjIdList'] == null?null:assBasicInfoAndPrv['assObjIdList'],
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1*/
                  /*  'assPropOrgId': assPropOrgId,
                    'assPropId': assPropId,
                    'assPropName': assPropName,
                    'assObjTypeCd': assObjTypeCd,
                    'assObjId': assObjId,
                    'mon': mon,
                    'tableName':resultTableHeader,
                    'assPropIdList': assPropIdList*/
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200' && res.data != null) {
                    resultSearchSuccess = res.data.sameArray;
                    return res.data;
                } else if (res.code == '200' && res.data == null) {
                    return {};
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: resultTableHeader,
            onLoadSuccess: function (res) {
                /*if (res.rows != null && res.rows != undefined && res.rows != '') {

                    mergeCell(res.rows, 'key', 1, '#assessResultTable', resultSearchSuccess);
                }*/
                $("#assessResultTable").bootstrapTable("resetView", {height: getTableHeight(document)})
                resizeTables();
            }
        });
    },
    resultOrderTable: function (initFlag) {
       var url = portal.bp() + './json/assess/assess_result/getResultOrder.json?r=' + Math.random();
        comunsOrder = comunsOrderInit;
      /*  if (initFlag == true) {
            url = '';
        } else {
            var resultOrderHeader = getResultOrderHeader();
            if (resultOrderHeader == null || resultOrderHeader == undefined || resultOrderHeader == '') {
                comunsOrder = comunsOrderInit;
            } else {
                comunsOrder = resultOrderHeader;
            }
        }*/
        $('#assessResultOrderTable').bootstrapTable("destroy");
        $('#assessResultOrderTable').bootstrapTable({
            url: url,
            method: 'POST',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height: getTableHeight(document) - 305,
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'assPropOrgId':assPropOrgId,
                    'assPropTypeCd':assPropTypeCd,
                    'assObjTypeCd':assObjTypeCd,
                    'effDt':effDt,
                    'mon':mon,
                    'assPropId':assPropId,
                    'assPropName':assPropName,
                    'assObjId':assObjId,
                    'isComprehensiveScore':isComprehensiveScore,
                    'professionTypeCd':professionTypeCd,
                    'assObjIdList':assBasicInfoAndPrv == null || assBasicInfoAndPrv['assObjIdList'] == null?null:assBasicInfoAndPrv['assObjIdList']
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
            onLoadSuccess: function (data) {
                $("#assessResultOrderTable").bootstrapTable("resetView", {height: getTableHeight(document) - 305})
                resizeTables();
            },
            columns: comunsOrder
        });
    }
};

//查询
function query(flag) {

    assPropOrgId = $('#assPropOrgId').val();
    assPropId = $('#assPropId').val();
    //assPropName = $('#assPropName').val();
    assObjTypeCd = $('#assObjTypeCd').val();
    assObjId = $('#assObjId').val();
    mon = $('#mon').val();
    assPropTypeCd = $('#assPropTypeCd').val();
    effDt = $('#effDt').val();
    resultSearchSuccess = [];
    if (flag == '1') {
        $("#assessResultOrderTable").bootstrapTable("refresh");
        $("#assessResultTable").bootstrapTable("refresh");
        return;

    }
    if (assPropId == null || assPropId == '' || assPropId == undefined) {
        //layer.msg("方案编号必填", {icon: 2});
        return;
    }



    if (mon == null || mon == '' || mon == undefined) {
       // layer.msg("考核月份必填", {icon: 2});
        return;
    }

    if (assBasicInfoAndPrv != null && assBasicInfoAndPrv != '' &&
        assBasicInfoAndPrv['assPropTypeCd'] != null
        && assBasicInfoAndPrv['assPropTypeCd'] != ''
        && assBasicInfoAndPrv['assObjTypeCd'] != null
        && assBasicInfoAndPrv['assObjTypeCd'] != ''
        && assBasicInfoAndPrv['scoreCalcRule'] != null
        && assBasicInfoAndPrv['scoreCalcRule'] != '') {
        assBasicInfoAndPrvCopy = JSON.parse(JSON.stringify(assBasicInfoAndPrv));
    } else {
        //layer.msg('未获得考核方案基本信息', {icon: 2});
        return;
    }


    var assPropTypeCdVal = assBasicInfoAndPrvCopy['assPropTypeCd'];
    var assObjTypeCdVal = assBasicInfoAndPrvCopy['assObjTypeCd'];
    var scoreCalcRuleVal = assBasicInfoAndPrvCopy['scoreCalcRule'];
    if ('01' == assPropTypeCdVal && ('01' == assObjTypeCdVal || '02' == assObjTypeCdVal || '03' == assObjTypeCdVal)) {



        if ($('#isComprehensiveScore').val() == null || $('#isComprehensiveScore').val() == undefined || $('#isComprehensiveScore').val() == '') {
            //("是否综合打分必填", {icon: 2});
            return;
        }
        isComprehensiveScore = $('#isComprehensiveScore').val();
        if (isComprehensiveScore == '0') {

            if ($('#professionTypeCd').val() == null || $('#professionTypeCd').val() == undefined || $('#professionTypeCd').val() =='') {
                //layer.msg("考核业务类型必填", {icon: 2});
                return;
            }
            professionTypeCd = $('#professionTypeCd').val();
        }
    }
    TabObj.assessResultTable();
    TabObj.resultOrderTable();
    // layer.closeAll();

}


var header = [];
var data = [];

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#assObjTypeCd').selectpicker('refresh');
    $(".mon").val(parseMon);
    $('#assPropOrgId').selectpicker('refresh').selectpicker('val', checkOrgId).change();
    $('#assPropTypeCd').selectpicker('refresh');
    $('#isComprehensiveScore').selectpicker('refresh');
    $('#professionTypeCd').selectpicker('refresh');
    //$('#isComprehensiveScore').attr('disabled','disabled');
    //$('#professionTypeCd').attr('disabled','disabled');
    $('#isComprehensiveScore').selectpicker('refresh');
    $('#professionTypeCd').selectpicker('refresh');

}

function validTableNameType(initFlag) {
    if(initFlag){
        return 'ASSESS_RESULT_JUST_ROLE_A';
    }
    if(assBasicInfoAndPrvCopy==null){
        //('未获取到考核方案基本信息',{icon:2});
        return;
    }

    if(assBasicInfoAndPrvCopy['assPropTypeCd'] == null
        || assBasicInfoAndPrvCopy['assPropTypeCd'] == ''
        || assBasicInfoAndPrvCopy['assObjTypeCd'] == null
        || assBasicInfoAndPrvCopy['assObjTypeCd'] == ''
        || assBasicInfoAndPrvCopy['scoreCalcRule'] == null
        || assBasicInfoAndPrvCopy['scoreCalcRule'] == '' ){
        //('考核方案基本信息有空值',{icon: 2});
        return;
    }
    var assPropTypeCd=assBasicInfoAndPrvCopy['assPropTypeCd'];
    var assObjTypeCd=assBasicInfoAndPrvCopy['assObjTypeCd'];
    var scoreCalcRule=assBasicInfoAndPrvCopy['scoreCalcRule'];
    if (('01' != assPropTypeCd || ('01' != assObjTypeCd && '02' != assObjTypeCd && '03' != assObjTypeCd)) && 'A' == scoreCalcRule) {
        return 'ASSESS_RESULT_JUST_ROLE_A';
    }
    if (('01' != assPropTypeCd || ('01' != assObjTypeCd && '02' != assObjTypeCd && '03' != assObjTypeCd)) && 'A' != scoreCalcRule) {
        return 'ASSESS_RESULT_JUST_NOT_ROLE_A';
    }

    var attrOfZhdf = $('#isComprehensiveScore').attr('disabled');
    if ('01' == assPropTypeCd && ('01' == assObjTypeCd || '02' == assObjTypeCd || '03' == assObjTypeCd) && 'disabled'!= attrOfZhdf && '1' == isComprehensiveScore) {
        return 'ASSESS_RESULT_COMPREHENSIVE_NOT-A';
    }
    var attrofProfessionType = $('#professionTypeCd').attr('disabled');
    if ('01' == assPropTypeCd && ('01' == assObjTypeCd || '02' == assObjTypeCd || '03' == assObjTypeCd) && 'disabled'!= attrOfZhdf && '0' == isComprehensiveScore && 'disabled'!= attrofProfessionType && 'ZT' ==$('#professionTypeCd').val() && 'A' == scoreCalcRule){
        return 'ASSESS_RESULT_NOT-COMPREHENSIVE_GLOBALITY_A'
    }
    if('01' == assPropTypeCd && ('01' == assObjTypeCd || '02' == assObjTypeCd || '03' == assObjTypeCd) && 'disabled'!= attrOfZhdf && '0' == isComprehensiveScore && 'disabled'!= attrofProfessionType && 'ZT' ==$('#professionTypeCd').val() && 'A' != scoreCalcRule){
        return 'ASSESS_RESULT_NOT-COMPREHENSIVE_GLOBALITY_NOT-A';
    }
    if('01' == assPropTypeCd && ('01' == assObjTypeCd || '02' == assObjTypeCd || '03' == assObjTypeCd) && 'disabled'!= attrOfZhdf && '0' == isComprehensiveScore && 'disabled'!= attrofProfessionType && 'ZT' !=$('#professionTypeCd').val() && 'A' == scoreCalcRule){
        return 'ASSESS_RESULT_NOT-COMPREHENSIVE_NOT-GLOBALITY_A';
    }

    if('01' == assPropTypeCd && ('01' == assObjTypeCd || '02' == assObjTypeCd || '03' == assObjTypeCd) && 'disabled'!= attrOfZhdf && '0' == isComprehensiveScore && 'disabled'!= attrofProfessionType && 'ZT' !=$('#professionTypeCd').val() && 'A' != scoreCalcRule){
        return 'ASSESS_RESULT_NOT-COMPREHENSIVE_NOT-GLOBALITY_NOT-A';
    }

    return null;

}
function mergeCell(data, fieldName, colspan, target, numArr) {

    if (data.length == 0) {
        return;
    }

    if (data.length == 1 || numArr == undefined) {
        //$(target).bootstrapTable('updateCell', {index: 0, field: 'Number', value: 1});
        return;
    }

    var fieldNameArray = null;
    if(tableNameType !='ASSESS_RESULT_COMPREHENSIVE_NOT-A'){
        fieldNameArray = filedNameArrayOne;
    }else{
        fieldNameArray = filedNameArrayTwo;
    }

    var merIndex = 0;
    for (var i = 0; i < numArr.length; i++) {
        mergeTool(target, merIndex, fieldNameArray, colspan, numArr[i]);
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

/**
 * 初始化机构列表
 */

/*
function initBelongOrgId() {
    var html = "";
    var checkOrgId = '';
    $.ajax({
        url: portal.bp() + '/assess/belongorg?r=' + Math.random(),
        type: 'get',
        async: false,
        data: {},
        dataType: "json",
        success: function (res) {
            var codeRes = res.code;
            if (codeRes != 200) {
                layer.msg(o.message, {icon: 2});
                return;
            }
            $.each(res.data.orgList, function (index, item) {
                html += '<option value="' + item.orgId + '">' + item.orgName + '</option>';
            });
            checkOrgId = res.data.checkOrgId;
            $('#assPropOrgId').html(html);
            $('#assPropOrgId').selectpicker('refresh');
        }
    });
    return checkOrgId;
}
*/

/**
 * 根据考核对象编号查询考核对象名称
 * @param assPropNum
 */
function getAssPropNameByAssPropNum(assPropId) {
    var assPropName = undefined;
    $.ajax({
        url: portal.bp() + '/assess/result/getAssPropNameByAssPropId?r=' + Math.random(),
        type: 'post',
        async: false,
        data: {
            "assPropId": assPropId
        },
        dataType: "json",
        success: function (res) {
            var codeRes = res.code;
            if (codeRes != 200) {
                layer.msg(o.message, {icon: 2});
                return;
            }
            assPropName = res.data;
        }
    });
    return assPropName;
}

/**
 * 根据考核对象名称查询考核对象编号
 * @param assPropName
 */
function getAssPropNumByAssPropName(assPropName) {
    var assPropNum = undefined;
    $.ajax({
        url: portal.bp() + '/assess/result/getAssPropIdByAssPropName?r=' + Math.random(),
        type: 'post',
        async: false,
        data: {
            "assPropName": assPropName
        },
        dataType: "json",
        success: function (res) {
            var codeRes = res.code;
            if (codeRes != 200) {
                layer.msg(o.message, {icon: 2});
                return;
            }
            assPropNum = res.data;
        }
    });
    return assPropNum;
}

function getResultOrderHeader() {
    var tableHeader = undefined;
    $.ajax({
        url: portal.bp() + '/assess/result/generateTableHeader?r=' + Math.random(),
        type: 'post',
        async: false,
        data: {
            "assPropName": assPropName,
            "assPropId": assPropId,
            "mon": mon
        },
        dataType: "json",
        success: function (res) {
            var codeRes = res.code;
            if (codeRes != 200) {
                layer.msg(res.message, {icon: 2});
                tableHeader = undefined;
                return;
            }
            tableHeader = res.data;
        }
    });
    return tableHeader;
}

function getResultTableHeader(tableName) {
    var tableHeader = undefined;
    $.ajax({
        url: portal.bp() + './json/assess/assess_result/tableCus.json?r=' + Math.random(),
        type: 'post',
        async: false,
        data: {
            "tableName": tableName
        },
        dataType: "json",
        success: function (res) {
            var codeRes = res.code;
            if (codeRes != 200) {
                layer.msg(res.message, {icon: 2});
                return;
            }
            tableHeader = res.data;
        }
    });
    return tableHeader;
}

function initAuthOrgList() {
    var html;
    $.ajax({
        url: portal.bp() + './json/org/findAuthValidOrg234.json',
        type: "get",
        data: {'menuId': "2500"},
        async: false,
        cache: false,
        dataType:'json',
        success: function (data) {
            var list = data.data;
            $.each(list, function (key, value) {
                html += '<optgroup label="' + key + '">';
                $.each(value, function (index, item) {

                    if (checkOrgId == null || checkOrgId == undefined || checkOrgId == '') {
                        checkOrgId = item.orgId;
                    }
                    html += '<option value="' + item.orgId + '">' + item.orgName + '</option>';
                });
                html += '</optgroup>';
            });
        }
    });
    return html;
}

//根据所属机构和统计期的改变查询考核方案主页设置方案编号和方案名称
function setAsPropIdAndAssPropName(assPropOrgId, assPropTypeCd,assObjTypeCd,tjDate) {
    assPropIdList = [];
    $('#assPropId').html('').selectpicker('refresh');
    $('#assPropName').html('').selectpicker('refresh');

    if ((assPropOrgId == undefined || assPropOrgId == '' || assPropOrgId == null)
        && (assPropTypeCd == undefined || assPropTypeCd == '' || assPropTypeCd == null)
        && (assObjTypeCd == undefined || assObjTypeCd == '' || assObjTypeCd == null)
        && (tjDate == undefined || tjDate == '' || tjDate == null)) {
      /*  $('#assPropId').html('').selectpicker('refresh');
        $('#assPropName').html('').selectpicker('refresh');*/
        return ;
    }
    var res=undefined;
    $.ajax({
        url: portal.bp() + '/assess/queryAllAssessList?r='+ Math.random(),
        type: 'get',
        async: false,
        cache: false,
        data:{
            'assPropOrgId': assPropOrgId,
            'assPropTypeCd': assPropTypeCd,
            'assObjTypeCd': assObjTypeCd,
            'tjDate': tjDate
        },
        success:function (data) {
            if (data.code == '200') {
                res = data.data;
            } else {
                layer.msg(data.msg, {icon: 2});
                return ;
            }
        }
    });

    if(res == undefined || res== null){
        //layer.msg("未获得考核方案信息", {icon: 2});
        return ;
    }
    var assPropIdHtml = '';
    var assPropNameHtml = '';
    $.each(res,function (index,item) {
        assPropIdList.push(item.assPropNum);
        assPropIdHtml += '<option value="' + item.assPropNum + '">' + item.assPropNum + '</option>'
        assPropNameHtml += '<option value="' + item.assPropNum + '">' + item.assPropName + '</option>'
    });
    $('#assPropId').html('').append(assPropIdHtml).selectpicker('refresh');
    $('#assPropName').html('').append(assPropNameHtml).selectpicker('refresh');
    //return res;
}
//根据考核方案id，查询权限以及考核方案的属性
function findPrvAndAssessResultType(assPropId) {
    assBasicInfoAndPrv = null;
    if(assPropId==null || assPropId== undefined || assPropId==''){
        //('考核方案id不能为空',{icon: 2});
        return;
    }
    $.ajax({
        url: portal.bp() + '/assess/result/findAssessPrvAndAssessType',
        type: 'post',
        async: false,
        data: {
            'assPropId': assPropId
        },
        dataType: "json"
    }).done(function (res) {
        if(res.code !='200' || res.data == null){
            //('查询考核方案信息失败',{icon: 2});
            return;
        }
        var result = res.data;

        if(result['assPropTypeCd'] == null
            || result['assPropTypeCd'] == ''
            || result['assObjTypeCd'] == null
            || result['assObjTypeCd'] == ''
            || result['scoreCalcRule'] == null
            || result['scoreCalcRule'] == ''){
           // layer.msg('考核方案基本信息有空值',{icon: 2});
            return;
        }
        assBasicInfoAndPrv = result;
    });
}
function vaildIsZHDF(param) {
    if(param == null || param == undefined){
        $('#isComprehensiveScore').val(null);
        $('#isComprehensiveScore').attr('disabled', 'disabled');
        $('#isComprehensiveScore').selectpicker('refresh');
        return;
    }
    var assPropTypeCd = param['assPropTypeCd'];
    var assObjTypeCd = param['assObjTypeCd'];
    if ('01' == assPropTypeCd
        && ('01' == assObjTypeCd
        || '02' == assObjTypeCd
        || '03' == assObjTypeCd)) {
        $('#isComprehensiveScore').removeAttr('disabled');
        $('#isComprehensiveScore').selectpicker('refresh');
        return;
    }
    $('#isComprehensiveScore').val(null);
    $('#isComprehensiveScore').attr('disabled', 'disabled');
    $('#isComprehensiveScore').selectpicker('refresh');
}
function validProfessionType() {
    var attr = $('#isComprehensiveScore').attr('disabled');
    var val = $('#isComprehensiveScore').val();
    if('disabled' !=attr && '0'==val){
        $('#professionTypeCd').removeAttr('disabled');
        $('#professionTypeCd').selectpicker('refresh');
        return;
    }
    $('#professionTypeCd').val(null);
    $('#professionTypeCd').attr('disabled', 'disabled');
    $('#professionTypeCd').selectpicker('refresh');
}
