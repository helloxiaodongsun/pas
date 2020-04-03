/*客户贷款日均余额及增量情况一览表*/
$(function () {

    //获取机构层级
    $("#orgLevel").html("").append($.param.getSelectOptionOrder("ORG_LEVEL"));
    $('#orgLevel').selectpicker('refresh');
    //获取查询货币单位
    $("#monetaryUnit").html("").append($.param.getSelectOptionOrder("MONETARY_UNIT"));
    $('#monetaryUnit').selectpicker('refresh');
    //获取统计口径
    $("#statisticsCaliber").html("").append($.param.getSelectOptionOrder("MONETARY_UNIT"));
    $('#statisticsCaliber').selectpicker('refresh');
    TableObj.oTableInit();


});


//分页查询用户列表
var TableObj = {
    oTableInit: function () {
        var tableType = 'khdkrjyejzlqkylb';
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/user/pageList',
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
                    'orgLevel': $('#orgLevel').val(),
                    'monetaryUnit': $('#monetaryUnit').val(),
                    'depNum': $('#depNum').val(),
                    'statisticsDate': $('#statisticsDate').val(),
                    'statisticsCaliber': $('#statisticsCaliber').val()
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
             columns: $.param.getTableHeaderByType(tableType)

        });
    }
};

//查询
function query() {
    $('#queryTable').bootstrapTable('destroy');
    TableObj.oTableInit();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#orgLevel').selectpicker('refresh');
    $('#monetaryUnit').selectpicker('refresh');
    $('#statisticsCaliber').selectpicker('refresh');
    $('#statisticsDate').selectpicker('refresh');
}


