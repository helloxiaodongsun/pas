//角色类型
var roleType = undefined;
//角色类型码值
var roleTypeCode = undefined;
//编辑时的行索引
var rowIndex = undefined;
//选中的要进行业绩分配的数据
var acctData = [];

var user = undefined;


$(function () {

    $(function () {
        $(".date-dt").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm-dd",
            minView: 2,
            autoclose: true,
            todayBtn: true,
            clearBtn: false,
            pickerPosition: 'top-left'
        });
    });
        //获取业务类型
        // $("#bizTypeCds").html("").append($.param.getSelectOptionOrderByName("AB0004")).selectpicker('refresh');
    getBizTypeCd();
    document.getElementById('bizTypeCds').options.selectedIndex = '0';
    $('#bizTypeCds').selectpicker('refresh');

    TableObj.relationTransferFactory(true);
    $('#bizTypeCds').on('changed.bs.select',function(a,b,c,d){
        if(!$(this).selectpicker('val')){
            //必选
            document.getElementById('bizTypeCds').options.selectedIndex = '0';
            $('#bizTypeCds').selectpicker('refresh');
            layer.msg("业务类型必选",{icon:3});
        }
    });
    layer.closeAll('loading');

});


//创建表格
var TableObj = {
    relationTransferFactory: function (flag) {

        var url = portal.bp() + './json/relation/relation_transfer/selectAcctInfoFromRealInfo.json';
        if(flag){
            url=undefined;
        }
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
                    row.number = index + 1;
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
                title: '关联角色',
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
                field: 'belongOrgName',
                title: '员工所属机构',
            },
            {
                field: 'relaRatioDesc',
                title: '关联比例(%)',
            }
        ];

        $('#relationTransfer').bootstrapTable('destroy').bootstrapTable({
            url: url,
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            height: 380,
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
            pageSize: 50,      //每页的记录行数（*）
            pageList: [10, 30, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) {
                //服务端返回数据

                if (res.code == '200') {
                    return res.data.pageFinder;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return;
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onCheck: function (row, $element) {
                diffAndOpr(acctData, row, '1');

            },
            onUncheck: function (row, $element) {
                diffAndOpr(acctData, row, '0');
            },
            onCheckAll: function (rows) {
                for (var i = 0; i < rows.length; i++) {
                    diffAndOpr(acctData, rows[i], '1');
                }
            },
            onUncheckAll: function (rows) {
                for (var i = 0; i < rows.length; i++) {
                    diffAndOpr(acctData, rows[i], '0');
                }
            }

        });
    }


};


//查询
function query() {
    var empId=$('#empId').val();
    if(empId == null || empId == undefined || empId == ''){
        layer.msg('员工编号必填', {icon: 2});
        return;
    }
    TableObj.relationTransferFactory();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#bizTypeCds').selectpicker('refresh');
}

//保存
function reltionSave() {
    transferSave('0');


}

//保存并提交审核
function reltionSaveAndApproval() {
    transferSave('1');

}

function transferSave(approvalFlag) {
    var checkList = $('#relationTransfer').bootstrapTable('getSelections');

    if (checkList == null || checkList.length == 0) {
        layer.msg("至少选择一条", {icon: 3});
        return;
    }
    var empNum = $('#empSearch_empId').val();
    var effDt = $('#empSearch_effDt').val();


    if (empNum == null || empNum == undefined || empNum == '') {

        layer.msg("员工信息不能为空", {icon: 3});
        return;
    }

    if (effDt == null || effDt == undefined || effDt == '') {
        layer.msg("生效日期不能为空", {icon: 3});
        return;
    }

    //封装请求的参数

    var paramObj = new Object();
    paramObj['acctData'] = checkList;
    paramObj['effDt'] = effDt;
    var userObj = new Object();
    userObj['empNum'] = empNum;
    paramObj['user'] = userObj;
    paramObj['approvalFlag'] = approvalFlag;


    var paramStr = JSON.stringify(paramObj);

    $.ajax({
        url: portal.bp() + './json/ok.json',
        type: 'post',
        cache: false,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: paramStr,
        success: function (data) {
            if (data.code == '200') {
                layer.msg("转移成功", {icon: 1});
                TableObj.relationTransferFactory();
            } else {
                layer.msg(data.message, {icon: 2});
            }
        }
    });
}

//绑定员工id的内容改变事件
function selectEmpInfo(obj) {
    if (obj.value != null && obj.value != undefined && obj.value != '') {
        $.ajax({
            url: portal.bp() + './json/user/getEmpInfoByEmpNum.json',
            type: 'get',
            cache: false,
            /* contentType: "application/json;charset=UTF-8",
             dataType: "json",*/
            dataType: "json",
            data: {
                'empId': obj.value
            },
            success: function (data) {
                if (data.code == '200') {
                    user = data.data;
                    if(user==null){

                        $('#empSearch_empName').val(null);
                        $('#empSearch_belongOrgDesc').val(null);
                        $('#empSearch_belongPostDesc').val(null);
                        layer.msg('员工不存在', {icon: 2});
                    }else{

                        $('#empSearch_empName').val(user.empName);
                        $('#empSearch_belongOrgDesc').val(user.belongOrgDesc);
                        $('#empSearch_belongPostDesc').val(user.belongPostDesc);
                    }
                } else {
                    layer.msg(data.message, {icon: 2});
                }

            }
        })
    } else {
        $('#empSearch_empName').val(undefined);
        $('#empSearch_belongOrgDesc').val(undefined);
        $('#empSearch_belongPostDesc').val(undefined);
        user = undefined;
    }
}

function diffAndOpr(array, row, opr) {

    //选中
    if (opr == '1') {
        if (array == undefined) {
            array = new Array();
            array.push(row);
            return;

        } else if (array.length == 0) {
            array.push(row);
            return;
        } else {

            var flag = false;
            for (var i = 0; i < array.length; i++) {
                if (row.acctId == array[i].acctId
                    && row.custId == array[i].custId
                    && row.empId == array[i].empId
                    && row.relaRoleId == array[i].relaRoleId) {
                    return;
                }
            }
            array.push(row);
        }
    } else {
        //取消
        if (array == undefined || array.length == 0) {
            return;
        } else {
            for (var i = 0; i < array.length; i++) {
                if (row.acctId == array[i].acctId
                    && row.custId == array[i].custId
                    && row.empId == array[i].empId
                    && row.relaRoleId == array[i].relaRoleId) {
                    array.splice(i, 1);
                }
            }
        }
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
