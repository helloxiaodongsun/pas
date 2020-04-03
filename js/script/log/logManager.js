var columns = [
    /* {
         field: 'check',
         checkbox: true
     },*/
    {
        field: 'Number',
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index + 1;
        }
    }, {
        field: 'opePerson',
        title: '员工工号'
    }
    , {
        field: 'opePersonName',
        title: '员工姓名'
    }
    , {
        field: 'opeIp',
        title: 'IP地址'
    }
    , {
        field: 'opeTypeDesc',
        title: '操作描述'
    }
    , {
        field: 'opeDesc',
        title: '操作详情'
    }
    , {
        field: 'succStatus',
        title: '操作状态'
    }
    , {
        field: 'errDesc',
        title: '操作状态详情'
    }
    , {
        field: 'opeTm',
        title: '操作时间'
    }];

var opePersonId;
var opePersonName;
var opeStatus;
var opeType;
var startTime;
var endTime;

$(function () {
    $("#startTime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2,
        startView: 2,
        autoclose: true,
        todayBtn: true,
        clearBtn: false,
    }).on('changeDate', function (ev) {
        var effDt = $("#startTime").val();
        $('#invalidDt').datetimepicker('setStartDate', effDt);
        $("#startTime").datetimepicker('hide');
    });
    $("#endTime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2,
        startView: 2,
        autoclose: true,
        todayBtn: true,
        clearBtn: false,
    }).on('changeDate', function () {
        var effDt = $("#startTime").val();
        var invalidDt = $("#endTime").val();
        if (effDt != '' && invalidDt != '') {
            /*if(!checkEndTime(effDt,invalidDt)){
                alert("开始时间大于结束时间");
                return;
            }*/
        }
        $('#startTime').datetimepicker('setEndDate', invalidDt);
        $("#endTime").datetimepicker('hide');
    });

    opeStatus_Q = $.param.getSelectOptionOrder("RESULT_CODE");
    opeType_Q = $.param.getSelectOptionOrder("SYSTEM_OPRTYPE");
    $("#opeStatus").html("").append(opeStatus_Q).selectpicker("refresh");
    $("#opeType").html("").append(opeType_Q).selectpicker("refresh");


    TableObj.logMangerTable();
     //query();
});

var TableObj = {
    'logMangerTable': function () {
        $('#logMangerTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/log/getLogInfoByPage',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
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
                    'opePersonId': opePersonId,
                    'opePersonName': opePersonName,
                    'opeStatus': opeStatus,
                    'opeType': opeType,
                    'startTime': startTime,
                    'endTime': endTime
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
            // uniqueId: "assIndexId",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (data) {
                $("#logMangerTable").bootstrapTable("resetView",{
                    height:getTableHeight(document)
                });
                resizeTables();
            },

        });
    }
};

//查询
function query() {
    opePersonId = $.trim($('#opePersonId').val());
    opePersonName = $.trim($('#opePersonName').val());
    opeStatus = $.trim($('#opeStatus').val());
    opeType = $.trim($('#opeType').val());
    startTime = $.trim($('#startTime').val());
    endTime = $.trim($('#endTime').val());
    TableObj.logMangerTable();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $("#opeStatus").selectpicker('refresh');
    $("#opeType").selectpicker('refresh');
}
