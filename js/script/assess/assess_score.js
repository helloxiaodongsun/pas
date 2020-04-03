//缓存的所属机构数据
var checkOrgId = undefined;
var belongOrg = undefined;
var assPropId = undefined;
var assObjTypeCd = undefined;
var assObjId = undefined;
var assMon = undefined;
var state = undefined;
//查询参数备份
var backUpParam = undefined;
//是否点击新增标志，如果只是查询，没有新增或修改，将不重新生成序列
var isEdit = false;
//调用后台生成的序列。主要用作保存在前端录入表的关联字段
var formSequence = undefined;
var checkedKey = [];
var scoreList = undefined;
var updateCell = new Object();
//操作状态
var oprType = undefined;
var vaildRes = '0';
var passArray = [];
$(function () {

    //考核月份
    $("#assMon").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm",
        minView: 3,
        startView: 3,
        autoclose: true,
        todayBtn: true,
        clearBtn: false,
    });
    /* $("#assMon").val(new Date().Format("yyyy-MM"));*/
    $('#btn_save').click(btn_save);
    $('#btn_commit').click(btn_commit);

    //所属机构
    checkOrgId = initBelongOrgId();
    //考核对象类型
    $('#assObjTypeCdDesc').html("").append($.param.getSelectOptionOrder("TB0006"));
    $('#assObjTypeCdDesc').selectpicker('refresh');
    /*$('#assPropTypeCd').html("").append($.param.getSelectOptionOrder("TB0007"))
        .selectpicker('refresh').selectpicker('val', '01').change();*/
    //方案状态
    $("#state").html("").append($.param.getSelectOptionOrder("SCORE_STATE"));
    $('#state').selectpicker('val', '02').selectpicker('refresh');
    //初始化查询
    TabObj.aQlyvIndexScoreTable(true);

    $("#assPropId").change(function () {
        var value = $(this).val();
        if (value != null && value != '' && value != undefined) {
            var assPropNameS = getAssPropNameByAssPropNum(value);
            if (assPropNameS != null
                && assPropNameS != undefined
                && assPropNameS != ''
                && $.isArray(assPropNameS)
                && assPropNameS.length == 1) {
                $("#assPropName").val(assPropNameS[0]);
                return;
            }
        }
        $("#assPropName").val('');
    });

    $("#assPropName").change(function () {
        var value = $(this).val();
        if (value != null && value != '' && value != undefined) {
            var assPropNumS = getAssPropNumByAssPropName(value);
            if (assPropNumS != null
                && assPropNumS != undefined
                && assPropNumS != ''
                && $.isArray(assPropNumS)
                && assPropNumS.length == 1) {
                $("#assPropId").val(assPropNumS[0]);
                return;
            }
        }
        $("#assPropId").val('');
    });
    $('#btn_commit').attr("style", "display:none");
    $('#btn_save').attr("style", "display:none");
    layer.closeAll();
});

var TabObj = {
    aQlyvIndexScoreTable: function (initFlag, validRes) {
        var url = portal.bp() + '/assess/score/getAQlyvIndexScore';
        if (initFlag == true) {
            url = '';
        }

        var columnsInfo = [
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
            },
            {
                field: 'assObjId',
                title: '考核对象编号'
            },
            {
                field: 'assObjName',
                title: '考核对象名称'
            },
            {
                field: 'indexName',
                title: '指标名称'
            },
            {
                field: 'score',
                title: '得分'
            },
            {
                field: 'det',
                title: '详情'
            },
            {
                field: 'assMon',
                title: '考核月份'
            }
        ];
        var columnsEdit = [
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
            },
            {
                field: 'assObjId',
                title: '考核对象编号'
            },
            {
                field: 'assObjName',
                title: '考核对象名称'
            },
            {
                field: 'indexName',
                title: '指标名称'
            },
            /* {
                 field: 'neguIndexWei',
                 title: '权重',

             },*/
            {
                field: 'score',
                title: '得分',
                align: "center",
                valign: "middle",
                formatter: function (value, row, index) {
                    if (value == null || value == undefined) {
                        value = '';
                    }
                    return value;
                },
                editable: {
                    type: 'text',
                    title: '关联比例',
                    //mode: 'inline',
                    placement: 'top',
                    emptytext: "空",
                    validate: function (v) {
                        var neguIndexWeiValue = getNeguIndexWeiValue($(this), $('#aQlyvIndexScoreTable'));
                        var regex = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
                        var valid = regex.test(v);
                        if (!valid) {
                            return '最多保留两位小数';
                        }
                        var neguIndexWeiValueFloatFormat = parseFloat(neguIndexWeiValue);
                        var floatFormatValue = parseFloat(v);
                        if (floatFormatValue > neguIndexWeiValueFloatFormat) {
                            return '必须小于权重值:' + neguIndexWeiValue;
                        }
                        if (floatFormatValue < 0) {
                            return '必须大于0';
                        }
                    }
                }
            },
            {
                field: 'det',
                title: '详情',
                align: "center",
                valign: "middle",
                formatter: function (value, row, index) {
                    if (value == null || value == undefined) {
                        value = '';
                    }
                    return value;
                },
                editable: {
                    type: 'text',
                    placement: 'top',
                    emptytext: "空"
                },
            },
            {
                field: 'assMon',
                title: '考核月份'
            }
        ];

        var columns = [];
        if (state == '01' || validRes == '0' || validRes == null || validRes == undefined || validRes == '') {
            columns = columnsInfo;
        } else {
            columns = columnsEdit;
        }


        $('#aQlyvIndexScoreTable').bootstrapTable('destroy').bootstrapTable({
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
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'belongOrg': belongOrg,
                    'assPropId': assPropId,
                    'assObjTypeCd': assObjTypeCd,
                    'assObjId': assObjId,
                    'assMon': assMon,
                    'state': state,
                    'formSequence': formSequence
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
                    scoreList = JSON.parse(JSON.stringify(res.data.result));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: columns,
            onCheck: function (row, $element) {

                var key = row.logicId;
                if (checkedKey.indexOf(key) < 0) {
                    checkedKey.push(key);
                }
            },
            onUncheck: function (row, $element) {

                var key = row.logicId;
                if (checkedKey.indexOf(key) >= 0) {
                    checkedKey.splice(checkedKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].logicId;
                        if (checkedKey.indexOf(key) < 0) {
                            checkedKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].logicId;
                        if (checkedKey.indexOf(key) >= 0) {
                            checkedKey.splice(checkedKey.indexOf(key), 1);
                        }
                    }
                }

            },
            onLoadSuccess: function (data) {

                $('#aQlyvIndexScoreTable').bootstrapTable('checkBy', {
                    field: "logicId",
                    values: checkedKey
                });
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#aQlyvIndexScoreTable").bootstrapTable("resetView");
                //新增，修改，logicId
                //发生变动的记录存下来，待翻页或者保存的时候存到form表
                $.each(scoreList, function (index, value) {
                    if (value['logicId'] == row['logicId']) {
                        if (value[field] == row[field]) {
                            $el.removeClass('update-cell-data');
                            if (value['score'] == row['score'] && value['det'] == row['det']) {
                                row['editFlag'] = '0';
                            }
                        } else {
                            $el.addClass('update-cell-data');
                            row['editFlag'] = '2';
                            passArray.push(row.logicId);

                            row['formSequence'] = formSequence;
                            row['state'] = state;
                            var oprTypeTmp = row['oprType'];
                            if (oprTypeTmp == null || oprTypeTmp == '' || oprTypeTmp == undefined) {
                                row['oprType'] = oprType;
                            }
                            var tableDataBeenEditArray = new Array();
                            tableDataBeenEditArray.push(row);
                            if (tableDataBeenEditArray == null || tableDataBeenEditArray == undefined
                                || tableDataBeenEditArray.length <= 0) {
                                return;
                            }
                            saveToform(tableDataBeenEditArray);
                        }
                        return;
                    }
                });
            },
            /* onPageChange: function (pageNum) {
                 var tableData = $('#aQlyvIndexScoreTable').bootstrapTable('getData');
                 var tableDataBeenEditArray = new Array();
                 $.each(tableData, function (index, value) {
                     var editFlag = value['editFlag'] == '1';
                     if (editFlag) {
                         value['formSequence'] = formSequence;
                         value['state'] = state;
                         var oprTypeTmp = value['oprType'];
                         if (oprTypeTmp == null || oprTypeTmp == '' || oprTypeTmp == undefined) {
                             value['oprType'] = oprType;
                         }
                         tableDataBeenEditArray.push(value);
                     }
                 });
                 if (tableDataBeenEditArray == null || tableDataBeenEditArray == undefined
                     || tableDataBeenEditArray.length <= 0) {
                     return;
                 }
                 //保存到前台form表
                 saveToform(tableDataBeenEditArray);
             }*/
        });
    }
};

//查询
function query() {
    checkedKey = [];
    passArray = [];
    belongOrg = $('#belongOrg').val();
    assPropId = $('#assPropId').val();
    assPropName = $('#assPropName').val();
    assObjTypeCd = $('#assObjTypeCdDesc').val();
    assObjId = $('#assObjId').val();
    assMon = $('#assMon').val();
    state = $('#state').val();

    if (assPropId == null || assPropId == '' || assPropId == undefined) {
        layer.msg("方案编号必填", {icon: 2});
        return;
    }

    if (assPropName == null || assPropName == '' || assPropName == undefined) {
        layer.msg("方案名称必填", {icon: 2});
        return;
    }

    if (state == null || state == '' || state == undefined) {
        layer.msg("方案状态必填", {icon: 2});
        return;
    }
    if (assMon == null || assMon == '' || assMon == undefined) {
        layer.msg("考核月份必填", {icon: 2});
        return;
    }

    var flag = false;
    if (backUpParam != undefined) {
        var assPropIdBoolean = backUpParam['assPropId'] == assPropId;
        var assMonBoolean = backUpParam['assMon'] == assMon;
        var stateBoolean = backUpParam['state'] == state;
        if ((!assMonBoolean || !assPropIdBoolean || !stateBoolean) && isEdit) {
            //查询条件发生改变并且进行了编辑或者新增操作，重新生成序列
            flag = true;
        }

    }

    if (backUpParam == undefined || flag) {
        if (formSequence != null && formSequence != '' && formSequence != undefined) {
            //删除
            var flag = deleteByFormSeQuence(formSequence);
            if (flag) {
                return;
            }
        }
        formSequence = generateSequence();
        var object = new Object();
        object['assPropId'] = assPropId;
        object['assMon'] = assMon;
        object['state'] = state;
        backUpParam = JSON.parse(JSON.stringify(object));
    }

    switch (state) {
        case '02':
            oprType = '2';
            break;
        case '05':
            oprType = '1';
            break;
    }
    vaildRes = vaildEditable(assPropId,assMon);
    if(state !='01' && vaildRes == '1'){
        $('#btn_save').attr("style", "display:inline");
        $('#btn_commit').attr("style", "display:inline");
    }else{
        $('#btn_commit').attr("style", "display:none");
        $('#btn_save').attr("style", "display:none");
    }




    TabObj.aQlyvIndexScoreTable(false, vaildRes);
}

//重置
function resetForm() {
    checkedKey = [];
    $('#formSearch')[0].reset();
    $('#belongOrg').selectpicker('refresh');
    $('#assObjTypeCdDesc').selectpicker('refresh');
    $('#state').selectpicker('refresh').selectpicker('val', '02').change();
    $("#assMon").val('');
    //$('#assPropTypeCd').selectpicker('refresh').selectpicker('val', '01').change();

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
        url: portal.bp() + '/relation/getBizTypeCd?r=' + Math.random(),
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
            $('#belongOrg').html(html);
            $('#belongOrg').selectpicker('refresh');
        }
    });
    return checkOrgId;
}

/**
 * 根据考核对象编号查询考核对象名称
 * @param assPropNum
 */
function getAssPropNameByAssPropNum(assPropNum) {
    var assPropName = undefined;
    $.ajax({
        url: portal.bp() + '/assess/getAssPropNameByAssPropNum?r=' + Math.random(),
        type: 'post',
        async: false,
        data: {
            "assPropNum": assPropNum
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
    })
    return assPropName;
}

/**
 * 根据考核对象名称查询考核对象编号
 * @param assPropName
 */
function getAssPropNumByAssPropName(assPropName) {
    var assPropNum = undefined;
    $.ajax({
        url: portal.bp() + '/assess/getAssPropNumByAssPropName?r=' + Math.random(),
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

//调用后台生成序列
function generateSequence() {
    var indexSequence = undefined;
    $.ajax({
        url: portal.bp() + "/assess/score/getIndex",
        type: 'post',
        async: false,
        success: function (res) {
            if (res.code != 200) {
                layer.msg('获取序列异常', {icon: 2});
                return;
            }
            indexSequence = res.data;
        }
    });
    return indexSequence;
}

function getNeguIndexWeiValue(element, tableElement) {
    $el = element[0]['$element'] === undefined ? element : element[0]['$element'];
    var rowIndex = $el.parent().parent().index();
    var tableValue = tableElement.bootstrapTable('getData');
    return tableValue[rowIndex]['neguIndexWei'];
}

function btn_commit() {
    /*if (state = '') {
        return;
    }*/

    if (checkedKey == null || checkedKey == undefined || checkedKey.length == 0) {
        layer.msg("至少选中一条数据", {icon: 2});
        return;
    }
    switch (state) {
        case '02':  //审批通过
        case '05':  //未打分
            var his = saveToHis(checkedKey, formSequence, "1");
            if (his) {
                layer.msg("提交成功", {icon: 1});
                TabObj.aQlyvIndexScoreTable(false, vaildRes);
                checkedKey = [];
            }
            break;
        case '03':  //待提交审批  存在修改的可能，修改保存提交，未修改直接提交
        case '04':
            var his = saveOrApproval(checkedKey, formSequence, "1");
            if (his) {
                layer.msg("提交成功", {icon: 1});
                TabObj.aQlyvIndexScoreTable(false, vaildRes);
                checkedKey = [];
            }
            break;

    }

    //获得当前页选中但是还未保存的数据
    /* var notSaveData = $('#aQlyvIndexScoreTable').bootstrapTable('getSelections');
     //保存当前页的数据到form表
     //当前页获得选中的，其它页获得选中的进行保存
     if (notSaveData != null && notSaveData.length > 0) {
         var flag = false;
         $.each(notSaveData, function (index, value) {
             if (value['editFlag'] != 1) {
                 flag = true;
                 return;
             }
             value['formSequence'] = formSequence;
             value['state'] = state;
             var oprTypeTmp = value['oprType'];
             if (oprTypeTmp == null || oprTypeTmp == '' || oprTypeTmp == undefined) {
                 value['oprType'] = oprType;
             }
         });
         if (flag) {
             layer.msg("考核打分必填或者未发生改变", {icon: 2});
             return;
         }
         //保存
         var flag = saveToform(notSaveData);
         if (flag) {
             return;
         }
         var his = saveToHis(checkedKey, formSequence, "1");
         if (his) {
             layer.msg("保存成功", {icon: 1});
             TabObj.aQlyvIndexScoreTable(false, vaildRes);
             checkedKey = [];
         }
     }*/


}

//保存
function btn_save() {
    /*if(checkedKey == null || checkedKey == undefined || checkedKey.length == 0){
         //全部保存


    }else*/
    if (checkedKey == null || checkedKey == undefined || checkedKey.length == 0) {
        layer.msg("至少选中一条数据", {icon: 2});
        return;
    }

    //获得当前页选中但是还未保存的数据
    //var notSaveData = $('#aQlyvIndexScoreTable').bootstrapTable('getSelections');
    //保存当前页的数据到form表
    //当前页获得选中的，其它页获得选中的进行保存
    /* if (notSaveData != null && notSaveData.length > 0) {
         var flag = false;
         $.each(notSaveData, function (index, value) {
             if (value['editFlag'] != 1) {
                 flag = true;
                 return;
             }
             value['formSequence'] = formSequence;
             value['state'] = state;
             var oprTypeTmp = value['oprType'];
             if (oprTypeTmp == null || oprTypeTmp == '' || oprTypeTmp == undefined) {
                 value['oprType'] = oprType;
             }
         });
         if (flag) {
             layer.msg("考核打分必填", {icon: 2});
             return;
         }
         //保存
         var flag = saveToform(notSaveData);
         if (flag) {
             return;
         }

     }*/

    var his = saveToHis(checkedKey, formSequence, "0");
    if (his) {
        layer.msg("保存成功", {icon: 1});
        TabObj.aQlyvIndexScoreTable(false, vaildRes);
        checkedKey = [];
    }


}

function saveToform(array) {
    var flag = false;
    $.ajax({
        url: portal.bp() + '/assess/score/toAddScoreForm?r=' + Math.random(),
        type: 'post',
        async: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(array),
        success: function (res) {
            if (res.code != '200') {
                layer.msg(res.msg, {icon: 2});
                flag = true;
                return;
            }
            flag = false;
        }
    });
    return flag;
};

function saveToHis(checkList, formSequence, approvalFlag) {
    var flag = false;
    var data = {'checkList[]': checkList, 'formSequence': formSequence, 'approvalFlag': approvalFlag};
    $.ajax({
        url: portal.bp() + '/assess/score/saveToHistory?r=' + Math.random(),
        type: 'get',
        async: false,
        // contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: data,
        success: function (res) {
            if (res.code != '200') {
                layer.msg(res.message, {icon: 2});
                flag = false;
                return;
            }
            flag = true;
        }
    });
    return flag;
}
function saveOrApproval(checkList, formSequence, approvalFlag) {
    var flag = false;
    var data = {'checkList[]': checkList, 'formSequence': formSequence, 'approvalFlag': approvalFlag};
    $.ajax({
        url: portal.bp() + '/assess/score/toApproval?r=' + Math.random(),
        type: 'get',
        async: false,
        // contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: data,
        success: function (res) {
            if (res.code != '200') {
                layer.msg(res.message, {icon: 2});
                flag = false;
                return;
            }
            flag = true;
        }
    });
    return flag;
}

function deleteByFormSeQuence(formSequence) {
    var flag = false;
    $.ajax({
        url: portal.bp() + '/assess/score/deleteByFormSequence?r=' + Math.random(),
        type: 'post',
        async: false,
        // contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: {'formSequence': formSequence},
        success: function (res) {
            if (res.code != '200') {
                layer.msg("系统异常", {icon: 2});
                flag = true;
                return;
            }
            flag = false;
        }
    });
    return flag;
}

function vaildEditable(assPropId, mon) {
    var resValid;
    $.ajax({
        url: portal.bp() + '/assess/score/vaildEditable?r=' + Math.random(),
        type: 'post',
        async: false,
        cache: false,
        // contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: {
            'assPropId': assPropId,
            'mon': mon
        },
        success: function (res) {
            if (res.code != '200') {
                layer.msg("系统异常", {icon: 2});
                resValid = '0';
                return;
            }
            resValid = res.data == '1' ? res.data : '0';
        }
    });
    return resValid;
}

