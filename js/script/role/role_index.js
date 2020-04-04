var edit_state = '02';
var prv_tmp = {};//界面显示
var prv_tmp_copy = {};//查询的结果拷贝
var prv_tmp_NO_SELECT = {};//删除
var prv_tmp_SELECT = {};//新增
var menuTree = undefined;
var orgTree = undefined;
var mutiple_edit_menu_tmp = [];//批量新建menu
var mutiple_edit_org_tmp = [];//批量新建menu
var selectId;
var numArr = [];
var roleId=undefined;
var filedNameArray = ['roleId', 'roleName', 'roleDesc','roleTypeDesc', 'check', 'Number','belongLineDescAggre'];
//角色信息
var roleInfo;
//角色种类
var roleType;
var tmpArry = [];
var add_roleType = '';
var belong_line = '';
var baiscRole = '';

$(function () {

    add_roleType=$.param.getSelectOptionOrder("ROLE_TYPE_MANAGER");
    belong_line = $.param.getSelectOptionOrder("LINE");
    baiscRole = getBaiscRole();
    $("#roleType").html("").append(add_roleType).selectpicker('refresh');
    $("#roleLine").html("").append(belong_line).selectpicker('refresh');

   // $("#add_roleType").html("").append($.param.getSelectOptionOrder("ROLE_TYPE_MANAGER"));
   // $("#belong_line").html("").append($.param.getSelectOptionOrder("LINE"));
    var type = 'post'; //ajax类型

    //数据显示列表
    TableObj.oTableInit();

    //表单校验
    addModalValidator();

    $('#edit-state_01').click(function () {
        edit_state = '01';
        var nodes = orgTree.getNodes();
        var allOrgNodes = orgTree.transformToArray(nodes);
        var menuByParam = menuTree.getNodeByParam("id", selectId);
        menuTree.selectNode(selectId, true);

    });


    $('#edit-state_01').click(function () {
        edit_state = '02';
    });
    //Modal验证销毁重构
    $('#add_Modal').on('hidden.bs.modal', function () {

        $("#add_Modal_Form").data('bootstrapValidator').destroy();
        $('#add_Modal_Form').data('bootstrapValidator', null);
        addModalValidator();

        $("#add_Modal_Form")[0].reset();
        $('input,textarea').placeholder(); //防止IE8没有placleholder
        $("#add_roleID").removeAttr("readonly");
        $('#add_roleType').selectpicker('refresh');
        $('#belong_line').selectpicker('refresh');
        $('#add_roleType').selectpicker('val','03');
    });

    //新增按钮
    $("#btn_add").click(function () {
        $("#myModalLabel").text("新增");
        type = 'post';
        $("#add_roleType").html("").append(add_roleType).selectpicker('refresh');
        $("#belong_line").html("").append(belong_line).selectpicker('refresh');
        $("#rela_role").html("").append(baiscRole).selectpicker('refresh');
        $('#rela_role').attr('disabled', false);
        $("#add_Modal").modal("show");

    });
    //修改按钮
    $("#btn_upd").click(function () {

        var checklist = $('#roletable').bootstrapTable('getSelections');
        if (checklist.length > 1) {
            layer.msg("只能选择一个角色", {icon: 3});
        } else if (checklist.length == 0) {
            layer.msg("请选择角色", {icon: 3});
        } else {

            $("#add_roleType").html("").append(add_roleType).selectpicker('refresh');
            $("#belong_line").html("").append(belong_line).selectpicker('refresh');
            $("#rela_role").html("").append(baiscRole).selectpicker('refresh');
            //赋值

            $("#add_roleName").val(checklist[0].roleName);
            $("#add_roleDesc").val(checklist[0].roleDesc);
            $('#rela_role').attr('disabled', 'disabled');
            //$('#rela_role').val(checklist[0].relaRoleDesc);
            $('#rela_role').selectpicker('val', checklist[0].relaRoleId).change();
            roleId = checklist[0].roleId;
            var roleType = checklist[0].roleType;
            var belongLineAggre = checklist[0].belongLineAggre;
            if(roleType ==null || roleType == undefined){
                roleType = '03';
            }
            $("#add_roleType").selectpicker('val', roleType);

            if(belongLineAggre == null || belongLineAggre == undefined){
                layer.msg("未获得角色所属条线", {icon: 3});
                return;
            }

            var belongLine = '';
            if(belongLineAggre.indexOf(',')< 0){
                belongLine=belongLineAggre;
                $("#belong_line").selectpicker('val', belongLine);
            }else{

                var belongLineArray = belongLineAggre.split(',');
                $("#belong_line").selectpicker('val', belongLineArray);

            }

            $("#myModalLabel").text("修改");
            type = 'put';
            $("#add_Modal").modal("show");
        }
    });
    //删除按钮
    $("#btn_del").click(function () {
        //
        var checklist = $('#roletable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择角色", {icon: 3});
        } else {
            var text = "确定删除选中的" + checklist.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var roleIdList = [];
                $.each(checklist, function (index, item) {
                    roleIdList.push(item.roleId);
                });

                var data = {
                    "roleIds": roleIdList
                };
                var index;
                $.ajax({
                    url: portal.bp() + './json/ok.json',
                    type: 'get',
                    async: true,
                    cache: false,
                    data: data,
                    dataType: "json",
                    success: function (o) {
                        var code = o.code;
                        if (code == 200) {
                            layer.msg("删除成功", {icon: 1});
                            $('#roletable').bootstrapTable('refresh');
                        } else {
                            layer.msg(o.message, {icon: 2});
                        }
                    },
                    beforeSend:function(XMLHttpRequest){
                        index = layerLoad();
                    },
                    complete:function(XMLHttpRequest){
                        layerClose(index);
                    }
                });
            }, function () {

            });
        }

    });


    //保存按钮
    $("#todobtn").click(function () {
        //表单校验
        var bootstrapValidator = $("#add_Modal_Form").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return;
        }

        var data = {
            "roleName": $("#add_roleName").val(),
            "roleDesc": $("#add_roleDesc").val(),
            "roleType": $('#add_roleType').val(),
            'belongLine': $('#belong_line').val(),
            'relaRoleId': $('#rela_role').val()
        };

        if(type=='put'){
            data['roleId']=roleId;
        };
        var index;
        $.ajax({
            url: portal.bp() + './json/ok.json',
            type: type,
            async: true,
            cache: false,
            data: data,
            dataType: "json",
            success: function (o) {
                var code = o.code;
                if (code == 200) {
                    $("#add_Modal").modal("hide");
                    layer.msg(o.message, {icon: 1});
                    $('#roletable').bootstrapTable('refresh');
                } else {
                    layer.msg(o.message, {icon: 2});
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

    //权限分配按钮
    $('#btn_prv_edit').click(function () {

        var checklist = $('#roletable').bootstrapTable('getSelections');
        if (checklist.length === 0) {
            layer.msg("请选择角色", {icon: 3});
            return;
        }
        if(checklist.length>1){
            layer.msg("仅能选择一个角色", {icon: 3});
            return;
        }

        role_show_check(checklist[0]['roleId'],checklist[0]['roleType']);

    });

});

//分页查询用户列表
var TableObj = {
    oTableInit: function () {
        columns = [
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
                field: 'roleId',
                title: '角色ID',
            }, {
                field: 'roleName',
                title: '角色名称',
                formatter:function(value,row,index){
            		return '<a id="btn_role_show_permission" onclick="role_show_permisstion(\''+row.roleId +'\');" class="oper-left" ><b>'+row.roleName+'</b></a>';
            	}
            },
            {
                field: 'roleTypeDesc',
                title: '权限类型'
            },
            {
                field: 'belongLineDescAggre',
                title: '所属条线'
            },
            {
                field: 'relaRoleDesc',
                title: '关联角色',
            },
            {
                field: 'roleDesc',
                title: '角色描述',
            }
        ];
        $('#roletable').bootstrapTable({
            url: portal.bp() + './json/role/pageList.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "roleId",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            reinit: false,
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'roleId': $('#roleId').val(),
                    'roleName': $('#roleName').val(),
                    'roleTypeCd': $('#roleType').val(),
                    'roleLine' : $('#roleLine').val()
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 15],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:520, //表格固定高度
            onClickCell: showPrivDetail,
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    //
                    datar = res.data;
                    return res.data;
                    //return data.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (res) {
                //mergeCell(res.rows, 'roleId', 1, '#roletable');
            	$('#roletable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
            	resizeTables();
            }

        });
    }
};


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

    /*  if(numArr.length ==1 && data.length==numArr[0]){

          flag=true;

      }*/
    /*if (flag) {
        $(target).bootstrapTable('updateCell', {index: 0, field: 'Number', value: 1});
    } else {*/


    var merIndex = 0;
    for (var i = 0; i <= numArr.length; i++) {

        if (merIndex >= data.length) {
            break;
        }
        $(target).bootstrapTable('updateCell', {index: merIndex, field: 'Number', value: i + 1});
        merIndex += numArr[i];
    }
    /* }*/
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
}


//查询
function query() {
    $('#roletable').bootstrapTable('destroy');
    TableObj.oTableInit();
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $('#roleType').selectpicker('refresh');
    $('#roleLine').selectpicker('refresh');
}

function addModalValidator() {
    //表单校验
    $("#add_Modal_Form").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            add_roleName: {
                validators: {
                    notEmpty: {
                        message: "角色姓名不能为空"
                    }
                }
            },
            add_roleDesc: {
                validators: {
                    stringLength: {
                        max: 30,
                        message: "角色描述不能超过30个字"
                    }
                }
            },
            add_roleType : {
                validators: {
                    notEmpty: {
                        message: "角色类型必选"
                    }
                }
            }/*,
            belong_line : {
                validators: {
                    notEmpty: {
                        message: "所属条线必选"
                    }
                }
            }*/
        }
    });
};

//递归
function getChildNodes(orgCheckNodesArray) {
    if(orgCheckNodesArray!= null && orgCheckNodesArray.length >0){
        for(var i=0;i<orgCheckNodesArray.length;i++){
            tmpArry.push(orgCheckNodesArray[i]);
            getChildNodes(orgCheckNodesArray[i].children);
        }
    }
};
//获取非兼职的关联角色信息
function getBaiscRole() {
    var html = '';
    $.ajax({
        url: portal.bp() + '/role/selectBasicRole',
        type: 'get',
        async: false,
        cache: false,
        dataType: "json",
        success:function (res) {
            if(res.code=='200'){
                var resList=res.data;
                $.each(resList,function (index, value) {
                    html += "<option value='" + value.roleId + "'>" + value.roleName + "</option>"
                });

            }else{
                layer.msg(res.message, {icon: 2});
            }
        }

    });
    return html;
}



function diffWithCopy(isInsert, menuID, arrayOrgId) {
    delete prv_tmp[menuID];
    delete prv_tmp_NO_SELECT[menuID];
    delete prv_tmp_SELECT[menuID];

    if (arrayOrgId == undefined
        || arrayOrgId == null) {
        arrayOrgId = [];
    }

    prv_tmp[menuID] = arrayOrgId;

    var tmpCopyElement = prv_tmp_copy[menuID];
    if (!isInsert) {
        if (tmpCopyElement != null
            && tmpCopyElement != undefined
            && tmpCopyElement.length != 0) {
            prv_tmp_NO_SELECT[menuID] = tmpCopyElement;

        }
        return;

    }

    if (tmpCopyElement == null
        || tmpCopyElement == undefined
        || tmpCopyElement.length == 0) {

        prv_tmp_SELECT[menuID] = arrayOrgId;
        return;
    }

    //求交集
    var same = sameOfArray(arrayOrgId, tmpCopyElement);
    //没有交集
    if (same == null
        || same == undefined
        || same.length == 0) {
        //完全不同
        prv_tmp_NO_SELECT[menuID] = tmpCopyElement;
        prv_tmp_SELECT[menuID] = arrayOrgId;
        return;
    }

    //求差集四种情况
    var diffOfArrayCopy = diffOfArray(same, tmpCopyElement);
    var diffOfArrayOrgId = diffOfArray(same, arrayOrgId);
    if ((diffOfArrayCopy == null
        || diffOfArrayCopy == undefined
        || diffOfArrayCopy.length == 0)
        && (diffOfArrayOrgId == null
            || diffOfArrayOrgId == undefined
            || diffOfArrayOrgId.length == 0)) {

        return;
    }

    if ((diffOfArrayCopy == null
        || diffOfArrayCopy == undefined
        || diffOfArrayCopy.length == 0)
        && (diffOfArrayOrgId != null
            && diffOfArrayOrgId != undefined
            && diffOfArrayOrgId.length > 0)) {

        prv_tmp_SELECT[menuID] = diffOfArrayOrgId;
        return;
    }
    if ((diffOfArrayCopy != null
        && diffOfArrayCopy != undefined
        && diffOfArrayCopy.length > 0)
        && (diffOfArrayOrgId == null
            || diffOfArrayOrgId == undefined
            || diffOfArrayOrgId.length == 0)) {
        prv_tmp_NO_SELECT[menuID] = diffOfArrayCopy;
        return;
    }

    prv_tmp_SELECT[menuID] = diffOfArrayOrgId;
    prv_tmp_NO_SELECT[menuID] = diffOfArrayCopy;
    return;
}

//求差集array2与array1的不同
function diffOfArray(array1, array2) {
    var result = array2.filter(function (item) {
        return array1.indexOf(item) === -1;
    });

    return result;
}

//求交集
function sameOfArray(array1, array2) {

    var result = array2.filter(function (item) {
        return array1.indexOf(item) !== -1;
    });

    return result;
}




function checkNodes(treeTarget, checkdArray, key) {
    if (checkdArray !== undefined && checkdArray.length > 0) {
        for (var i = 0; i < checkdArray.length; i++) {
            var nodeByParam = treeTarget.getNodeByParam(key, checkdArray[i]);
            if (nodeByParam != null) {
                treeTarget.checkNode(nodeByParam, true);
            }
        }
    }
}

function showPrivDetail(field, value, row, obj) {
    if (field == 'menuDesc') {
        $('#prv_detail').text("");

        if(value == null || value == undefined){
            return;
        }
        $('#prv_detail').text(value);
        $("#prv_modal").modal("show");


    }
}
