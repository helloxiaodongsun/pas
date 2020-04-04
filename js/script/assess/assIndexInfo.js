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
        field: 'assIndexId',
        title: '指标编号'
    }
    , {
        field: 'assIndexName',
        title: '指标名称'
    }
    , {
        field: 'assIndexCateDesc',
        title: '指标类别'
    }
    , {
        field: 'belongLineCdDesc',
        title: '所属业务条线'
    }
    , {
        field: 'assIndexOrientDesc',
        title: '考核指标大类'
    }
    , {
        field: 'assIndexUnitDesc',
        title: '单位'
    }
    , {
        field: 'isStblOrgDesc',
        title: '是否适用机构'
    }
    , {
        field: 'isStblTeamDesc',
        title: '是否适用团队'
    }
    , {
        field: 'isStblIndvDesc',
        title: '是否适用个人'
    }
    , {
        field: 'assIndexDesc',
        title: '指标描述'
    }];
var checkKey = [];
var assIndexId = undefined;
var assIndexName = undefined;
var assIndexCateCd = undefined;
var belongLineCd = undefined;
var assIndexOrientCd = undefined;
var assIndexOrientCdArray = undefined;
var assIndexCateCdArray = undefined;
var belongLineCdArray = undefined;
var tableHeaderFilter = [];
$(function () {
    assIndexOrientCdArray = $.param.getSelectOptionOrder("TB0072");
    assIndexCateCdArray = $.param.getSelectOptionOrder("TB0010");
    belongLineCdArray = $.param.getSelectOptionOrder("TB0071");

    $("#assIndexOrientCd").html("").append(assIndexOrientCdArray).selectpicker('refresh');
    $("#assIndexCateCd").html("").append(assIndexCateCdArray).selectpicker('refresh');
    $("#belongLineCd").html("").append(belongLineCdArray).selectpicker('refresh');
    TableObj.assIndexDetTable();
    var tableHeaderSource = $('#assIndexDetTable').bootstrapTable('getOptions').columns;
    $.map(tableHeaderSource[0],function (item,index) {
        if('check' != item['field'] && 'Number' != item['field'] ){
            tableHeaderFilter.push(item);
        }

    });
    $('#btn_export').click(exportAssIndexDet);
});

var TableObj = {
    'assIndexDetTable': function () {
        $('#assIndexDetTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/assess/assIndex/selectByPage.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'assIndexId': assIndexId,
                    'assIndexName': assIndexName,
                    'assIndexCateCd': assIndexCateCd,
                    'belongLineCd': belongLineCd,
                    'assIndexOrientCd': assIndexOrientCd
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            uniqueId: "assIndexId",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (data) {

                $('#assIndexDetTable').bootstrapTable('checkBy', {
                    field: "assIndexId",
                    values: checkKey
                });
                $("#assIndexDetTable").bootstrapTable("resetView",{
                    height:getTableHeight(document)
                });
                resizeTables();
            },
            onCheck: function (row, $element) {

                var key = row.assIndexId;
                if (checkKey.indexOf(key) < 0) {
                    checkKey.push(key);
                }


            },
            onUncheck: function (row, $element) {

                var key = row.assIndexId;
                if (checkKey.indexOf(key) >= 0) {
                    checkKey.splice(checkKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].assIndexId;
                        if (checkKey.indexOf(key) < 0) {
                            checkKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].assIndexId;
                        if (checkKey.indexOf(key) >= 0) {
                            checkKey.splice(checkKey.indexOf(key), 1);
                        }
                    }
                }

            }
        });
    }
};
//查询
function query() {
    checkKey = [];
    assIndexId=$.trim($('#assIndexId').val());
    assIndexName=$.trim($('#assIndexName').val());
    assIndexCateCd=$.trim($('#assIndexCateCd').val());
    belongLineCd=$.trim($('#belongLineCd').val());
    assIndexOrientCd=$.trim($('#assIndexOrientCd').val());
    TableObj.assIndexDetTable();
}
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $("#assIndexOrientCd").selectpicker('refresh');
    $("#assIndexCateCd").selectpicker('refresh');
    $("#belongLineCd").selectpicker('refresh');
}
//导出
function exportAssIndexDet() {
    $.ajax({
        url:portal.bp() + './json/assess/assIndex/queryAndExport.json',
        type: 'post',
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded",
        data: {
           'assIndexId':assIndexId,
           'assIndexName':assIndexName,
           'assIndexCateCd':assIndexCateCd,
           'belongLineCd':belongLineCd,
           'assIndexOrientCd':assIndexOrientCd,
            'exportList': checkKey,
           'tableHeader':JSON.stringify(tableHeaderFilter)}
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
}