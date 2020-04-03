/*客户存款任意时点日均余额情况一览表*/
$(function () {

    //获取机构层级
    $("#orgLevel").html("").append($.param.getSelectOptionOrder("ORG_LEVEL"));
    $('#orgLevel').selectpicker('refresh');
    //获取查询货币单位
    $("#monetaryUnit").html("").append($.param.getSelectOptionOrder("MONETARY_UNIT"));
    $('#monetaryUnit').selectpicker('refresh');


    //数据显示列表
    //TableObj.oTableInit();

    /*$("#btn_add").click(function(){
        var checklist = $('#usertable').bootstrapTable('getSelections');
        if(checklist.length>1){
            layer.msg("只能选择一个员工",{icon:3});
        }else if(checklist.length==0){
            layer.msg("请选择员工",{icon:3});
        }else{
            if(checklist[0].belongOrgId==null||checklist[0].belongOrgId==''){
                //重置表单
                $("#add_Modal_Form")[0].reset();
                $('#add_belongPostCd').selectpicker('refresh');
                $('#add_belongLine').selectpicker('refresh');

                //赋值
                $("#add_empNum").val(checklist[0].empNum);
                $("#add_empName").val(checklist[0].empName);
                $('#add_belongPostCd').selectpicker('val',checklist[0].belongPostCd);
                $('#add_belongLine').selectpicker('val',checklist[0].belongLine);
                $("#add_Modal").modal("show");
            }else{
                layer.msg("新增员工必须为没有归属机构的员工",{icon:3});
            }
        }
    });
    */


    /*$('#orgId').on('changed.bs.select',function(e){
        var val = $(this).val();
        var res = [];
        //for(var i=0;i<val.length;i++){
            res.push(val);
        //}
        getDepart('depId',res);
    });*/
    TableObj.oTableInit();


});


//分页查询用户列表
var TableObj = {
    oTableInit: function () {
        var tableType = 'khckrysdrjyuqkylb';
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
                    'startTime': $('#startTime').val(),
                    'endTime': $('#endTime').val()
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

           /* columns: [[{
                "tableHeaderId": "1",
                "title": "客户存款任意时点日均余额情况一览表",
                "rowNumber": 1,
                "colNumber": 1,
                "rowspan": 1,
                "colspan": 10,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }], [{
                "tableHeaderId": "2",
                "title": "单位：",
                "rowNumber": 2,
                "colNumber": 1,
                "rowspan": 1,
                "colspan": 10,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "right",
                "valign": "middle",
                "sortable": null
            }], [{
                "tableHeaderId": "3",
                "title": "序号",
                "rowNumber": 3,
                "colNumber": 1,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "11",
                "title": "机构编号",
                "rowNumber": 3,
                "colNumber": 2,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "4",
                "title": "经营单位名称",
                "rowNumber": 3,
                "colNumber": 3,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "5",
                "title": "本外币客户",
                "rowNumber": 3,
                "colNumber": 4,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "6",
                "title": "本外币公司",
                "rowNumber": 3,
                "colNumber": 5,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "7",
                "title": "人民币公司",
                "rowNumber": 3,
                "colNumber": 6,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "8",
                "title": "外币公司",
                "rowNumber": 3,
                "colNumber": 7,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "9",
                "title": "本外币个人",
                "rowNumber": 3,
                "colNumber": 8,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "10",
                "title": "人民币个人",
                "rowNumber": 3,
                "colNumber": 9,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }, {
                "tableHeaderId": "12",
                "title": "外币个人",
                "rowNumber": 3,
                "colNumber": 10,
                "rowspan": 1,
                "colspan": 1,
                "createTime": null,
                "validTag": 1,
                "tableType": "khckrysdrjyuqkylb",
                "field": null,
                "align": "center",
                "valign": "middle",
                "sortable": null
            }]]*/
        });
    }
};

//添加分配角色按钮
/*function AddFunctionAlty(value, row, index) {
    return ['<button id="toAddRole" type="button" class="btn btn-primary">权限分配</button>']
        .join("")
};*/
/*//按钮“分配角色”
window.operateEvents = {
		"click #toAddRole":function(e,value,row,index){
			$("#nameId").val(row.nameID);
			var nonSelectedList;
			var selectedList;
		    $.ajax({
				url : portal.bp() + '/role/getRoles',
				type : "get",
				async : false, // 同步 为全局变量赋值
				data:{'nameID':row.nameID},
				cache:false,
				success : function(data) {
					selectedList = data.data.selectedRoles; //由于返回本来就是Json对象无需进行转换
		        	nonSelectedList = data.data.noselectedRoles;
				}
			});
		    //重置角色选择列表
		    $('.ue-container').empty();
		    $(".ue-container").append("<select style='height: 100%' multiple='multiple' size='10' name='doublebox' class='demo'> </select>");
			var doubleboxdemo = $('.demo').doublebox({
			    nonSelectedListLabel: '选择角色',
			    selectedListLabel: '授权用户角色',
			    filterPlaceHolder:'搜索',
			    moveSelectedLabel:'选择',
			    moveAllLabel:'全部选择',
			    removeSelectedLabel:'移除',
			    removeAllLabel:'全部移除',
			    selectorMinimalHeight:180,
			    preserveSelectionOnMove: 'moved',
			    moveOnSelect: false,
			    nonSelectedList: nonSelectedList,
			    selectedList: selectedList,
			    optionValue: "roleId",
			    optionText: "roleName",
			    optionTilte:"roleName",
			    doubleMove: true,
			});
			//显示分配角色面板
		    $("#setRole").modal("show");
		}
};*/

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
    $('#startTime').selectpicker('refresh');
    $('#endTime').selectpicker('refresh');
}


//初始化机构选择列表
/*function getOrgList() {
    $.ajax({
        url: portal.bp() + '/orgDept/findAllOrg',
        type: "get",
        async: false, // 同步 为全局变量赋值
        cache: false,
        success: function (data) {
            var html;
            var list = data.data;
            for (var i = 0; i < list.length; i++) {
                html += '<option value="' + list[i].orgId + '">'
                    + list[i].orgName + '</option>';
            }
            $('#orgId').html(html);
        }
    });
}*/
