$(function () {
	getParentCode();
	$("#add_dateCode").prop("disabled",true);
	$("#add_codeParent").prop("disabled",true);
	$("#add_codeParent").selectpicker("refresh");
	$("#add_isCheck").prop("disabled",true);
	$("#add_isCheck").selectpicker("refresh");
	
	$("input[type=radio][name=add_formType]").change(function(){
		add_formTypeChange();
	});
	function add_formTypeChange(){
		var value = $("input[type=radio][name=add_formType]:checked").val();
		if(value=='1'){
			$("#add_codeParent_xing").hide();
			$("#add_codeParent").prop("disabled",true);
			$("#add_codeParent").selectpicker("refresh");
			$("#add_isCheck").prop("disabled",true);
			$("#add_isCheck").selectpicker("refresh");
			$("#add_dateCode").val("")
			$("#add_dateCode").prop("disabled",true);
		}else if(value=='2'){
			$("#add_codeParent_xing").show();
			$("#add_codeParent").prop("disabled",false);
			$("#add_codeParent").selectpicker("refresh");
			$("#add_isCheck").prop("disabled",false);
			$("#add_isCheck").selectpicker("refresh");
			$("#add_dateCode").val("")
			$("#add_dateCode").prop("disabled",true);
		}else if(value=='3'){
			$("#add_codeParent_xing").hide();
			$("#add_codeParent").prop("disabled",true);
			$("#add_codeParent").selectpicker("refresh");
			$("#add_isCheck").prop("disabled",true);
			$("#add_isCheck").selectpicker("refresh");
			$("#add_dateCode").prop("disabled",false);
		}else{
			$("#add_codeParent_xing").hide();
			$("#add_codeParent").prop("disabled",true);
			$("#add_codeParent").selectpicker("refresh");
			$("#add_isCheck").prop("disabled",true);
			$("#add_isCheck").selectpicker("refresh");
			$("#add_dateCode").val("")
			$("#add_dateCode").prop("disabled",true);
		}
	}
	$("#add_codeParent").change(function(){
		$("#add_isCheck").html("").append($.param.getSelectOptionOrder(this.value));
		$('#add_isCheck').selectpicker('refresh');
	});
	var type='post'; //ajax类型
	//数据显示列表
	TableObj.oTableInit();
	
	
	//表单校验
	addModalValidator();
	
	//Modal验证销毁重构
    $('#add_Modal').on('hidden.bs.modal', function() {
        $("#add_Modal_Form").data('bootstrapValidator').destroy();
        $('#add_Modal_Form').data('bootstrapValidator', null);
        addModalValidator();
    });
    
	//新增按钮
	$("#btn_add").click(function(){
		//重置表单
		$("#add_Modal_Form")[0].reset();
		$('input,textarea').placeholder(); //防止IE8没有placleholder
		$('#add_codeParent').selectpicker('refresh');
		$('#add_isCheck').selectpicker('refresh');
		
		$("#myModalLabel").text("新增");
		type = 'post';
		
		$("#add_dateCode").prop("disabled",true);
		$("#add_codeParent").prop("disabled",true);
		$("#add_codeParent").selectpicker("refresh");
		$("#add_isCheck").prop("disabled",true);
		$("#add_isCheck").selectpicker("refresh");
		
		$("#add_tableName").removeAttr("readonly");
		$("#add_nameEn").removeAttr("readonly");
		
		$("input[name=add_formType]").eq(3).prop("checked",true);
		$("input[name=add_iswhere]").eq(0).prop("checked",true);
		$("input[name=add_isOrderBy]").eq(0).prop("checked",true);
		$("#add_Modal").modal("show");
		
	});
	
	//修改按钮
	$("#btn_upd").click(function(){
		var checklist = $('#usertable').bootstrapTable('getSelections');
		if(checklist.length>1){
			layer.msg("只能选择一个",{icon:3});
		}else if(checklist.length==0){
			layer.msg("请选择",{icon:3});
		}else{
			
			$.ajax({
				url : portal.bp() + '/table/tableWhere/getone',
				type : "get",
				async : false, // 同步 为全局变量赋值
				cache:false,
				data:{
					'tableName':checklist[0].tableName,
					'nameEn':checklist[0].nameEn,
				},
				success : function(data) {
					if(data.code=='200'){
						var tw = data.data;
						
						//重置表单
						$("#add_Modal_Form")[0].reset();
						$('#add_codeParent').selectpicker('refresh');
						$('#add_isCheck').selectpicker('refresh');
						
						$("input[name=add_formType]").prop("checked",false);
						$("input[name=add_iswhere]").prop("checked",false);
						$("input[name=add_isOrderBy]").prop("checked",false);
						
						//赋值
						$("#add_tableName").val(tw.tableName);
						$("#add_tableName").attr("readonly","readonly");
						$("#add_tableNameCn").val(tw.tableNameCn);
						$("#add_nameEn").val(tw.nameEn);
						$("#add_nameEn").attr("readonly","readonly");
						$("#add_nameCn").val(tw.nameCn);
						
						$("input[name=add_formType][value='"+tw.formType+"']").prop("checked",true);
						
						$("input[type=radio][name=add_formType]").change();
						
						$('#add_codeParent').selectpicker('val',tw.codeParent);
						$('#add_codeParent').trigger("change");
						$('#add_isCheck').selectpicker('val',tw.isCheck);
						$("#add_sortable").val(tw.sortable);
						$("input[name=add_iswhere][value='"+tw.iswhere+"']").prop("checked",true);
						$("#add_dateCode").val(tw.dateCode);
						$("input[name=add_isOrderBy][value='"+tw.isOrderBy+"']").prop("checked",true);
						
						
						$("#myModalLabel").text("修改");
						type = 'post';
						$("#add_Modal").modal("show");
					}else{
						layer.msg(data.message, {icon: 2});
					}
				}
			});
			
			
		}
	});
	//删除按钮
	$("#btn_del").click(function(){
		var checklist = $('#usertable').bootstrapTable('getSelections');
		if(checklist.length == 0){
			layer.msg("请选择员工",{icon:3});
		}else{
			var text = "确定删除选中的"+checklist.length+"项吗？";
			layer.confirm(text, {
					btn: ['确定','取消'] //按钮
		      	}, function(){
		      		var tableWheres = [];
		      		$.each(checklist, function(index,item) {
		      			var tableWhere = {
		      					'tableName':item.tableName,
		      					'nameEn':item.nameEn
		      			}
		      			tableWheres.push(tableWhere);
		    		});
		      		
		      		var data = {
		      				"tableWhereList":tableWheres	
		      		};
		      		console.log(JSON.stringify(data));
		      		$.ajax({
		      			url:portal.bp() + '/table/tableWhere/del',
		      			type:'post',
		      			async:false,
		      			contentType: "application/json;charset=UTF-8",
		      			cache:false,
		      			data : JSON.stringify(data),
		      			dataType: "json",
		      			success:function(o){
		      				var code = o.code;
		      				if(code == 200){
		      					layer.msg("提交成功", {icon: 1});
		      					query();
		      				}else{
		      					layer.msg(o.message, {icon: 2});
		      				}
		      			} 
		      		});
		      	}, function(){
		      	  
		      	});
		}
		
	});
	
	//保存按钮
	$("#todobtn").click(function(){
		//表单校验
		var bootstrapValidator = $("#add_Modal_Form").data('bootstrapValidator');
		bootstrapValidator.validate();
		if(!bootstrapValidator.isValid())
			return;
		
		var data = {
				"tableName":$("#add_tableName").val(),
				"tableNameCn":$("#add_tableNameCn").val(),
				"nameEn":$("#add_nameEn").val(),
				"nameCn":$("#add_nameCn").val(),
				"formType":$("input[name=add_formType]:checked").val(),
				"codeParent":$("#add_codeParent").val(),
				"isCheck":$("#add_isCheck").val(),
				"sortable":$("#add_sortable").val(),
				"iswhere":$("input[name=add_iswhere]:checked").val(),
				"isOrderBy":$("input[name=add_isOrderBy]:checked").val(),
				"dateCode":$("#add_dateCode").val()
		}
		$.ajax({
  			url:portal.bp() + '/table/tableWhere/save',
  			type:type,
  			async:false,
  			cache:false,
  			data:data,
  			dataType: "json",
  			success:function(o){
  				var code = o.code;
  				if(code == 200){
  					$("#add_Modal").modal("hide");
  					layer.msg("提交成功", {icon: 1});
  					query();
  				}else{
  					layer.msg(o.message, {icon: 2});
  				}
  			} 
  		});
	});
    
});

//分页查询用户列表	 
var TableObj = {
		oTableInit:function (){
			$('#usertable').bootstrapTable({
				url: portal.bp() + '/table/showtableWhere',
			    method: 'get',      //请求方式（*）
			    striped: true,      //是否显示行间隔色
			    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			    pagination: true,     //是否显示分页（*）
			    sortStable:true,      //是否启用排序
			    sortOrder: "desc",     //排序方式
			    singleSelect:false,    //是否单选，true时没有全选按钮
			    "queryParamsType": "limit",
			    contentType: "application/x-www-form-urlencoded",
			    queryParams:function(params) {
			   		return {
			   			'pageSize': params.limit,
			   			'pageNum':  (params.offset / params.limit) + 1,
			   			'tableName':$('#tableName').val()
			   		};
			    },
			    sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			    pageNum:1,      //初始化加载第一页，默认第一页
			    pageSize: 5,      //每页的记录行数（*）
			    pageList: [5, 10, 25],  //可供选择的每页的行数（*）
			    clickToSelect: true,    //是否启用点击选中行
			    height:getTableHeight(document), //表格固定高度
			    responseHandler:function(res){ //服务端返回数据
			    	if(res.code == '200'){
			    		return res.data;
			    	}else{
			    		layer.msg(res.message,{icon:2});
			    		return {};
			    	}
			    },
			    //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			    columns: [
					      {
					    	  field:'check',
					    	  checkbox:true
					      },
					    {
					    	field: 'Number',
					     	title: '序号',
					     	align:'center',
					     	formatter: function (value, row, index) {
				            	return index+1;
				         	}
						}, {
					     	field: 'tableName',
					     	title: '表名',
					    }, {
					     	field: 'tableNameCn',
					     	title: '中文表名',
					    }, {
					     	field: 'nameEn',
					     	title: '字段名',
					    },  {
					     	field: 'nameCn',
					     	title: '字段英文名',
					    }, 
					    {
					     	field: 'formType',
					     	title: '表单类型',
					    },
					    {
					    	field: 'codeParent',
					    	title: '下拉列表码值',
					    },
					    {
					    	field: 'isCheck',
					    	title: '默认选中',
					    },
					    {
					    	field: 'sortable',
					    	title: '排序',
					    },
					    {
					    	field: 'iswhere',
					    	title: 'sql查询条件',
					    },
					    {
					    	field: 'isOrderBy',
					    	title: '排序字段',
					    },
					    {
					    	field: 'dateCode',
					    	title: '日期区间',
					    },
				    ],
				 height:getTableHeight(document), //表格固定高度
	  });
	}
};
//按钮“分配角色”
window.operateEvents = {
		"click #toAddRole":function(e,value,row,index){
			var nonSelectedList;
			var selectedList;
		    $.ajax({
				url : portal.bp() + '/user/getRolesByEmpNum',
				type : "get",
				async : false, // 同步 为全局变量赋值
				data:{'empNum':row.empNum},
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
			$(".bootstrap-duallistbox-container").css("margin-right","0px").css("margin-left","0px");
			$(".settingUp-btns").css("display","none");
			//显示分配角色面板
		    $("#setRole").modal("show");
		},

		"click #tododel_btn,#todoupdate_btn,#todoadd_btn":function(e,value,row,index){
			$.ajax({
				url : portal.bp() + '/user/getUserTodoShow',
				type : "get",
				async : false, // 同步 为全局变量赋值
				data:{'empNum':row.empNum},
				cache:false,
				success : function(data) {
					if(data.code == '200'){
						$("#show_empNum").val(data.data.empNum);
						$("#show_empName").val(data.data.empName);
						$("#show_belongOrgId").val(data.data.belongOrgId);
						$("#show_belongPostCd").val($.param.getDisplay('POST',data.data.belongPostCd));
						$("#show_belongLine").val($.param.getDisplay('LINE',data.data.belongLine));
					}else{
						layer.msg(data.message,{icon:2});
					}
				}
			});
			$("#todoModal").modal("show");
		}
};



//查询
function query(){
	$('#usertable').bootstrapTable('destroy');
	TableObj.oTableInit();
}
//重置
function resetForm(){
	$('#formSearch')[0].reset();
	$('#belongPostCd').selectpicker('refresh');
	$('#belongOrgId').selectpicker('refresh');
	$('#belongLine').selectpicker('refresh');
}

function addModalValidator(){
	//表单校验
	$("#add_Modal_Form").bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields:{
			add_tableName:{
				validators:{
					notEmpty:{
						message:"不能为空"
					},
					stringLength:{
						max:40,
						message:"不能超过40个字"
					}
				}
			},
			add_tableNameCn:{
				validators:{
					notEmpty:{
						message:"不能为空"
					},
					stringLength:{
						max:30,
						message:"不能超过30个字"
					}
				}
			},
			add_nameEn:{
				validators:{
					notEmpty:{
						message:"不能为空"
					},
					stringLength:{
						max:30,
						message:"不能超过30个字"
					}
				}
			},
			add_nameCn:{
				validators:{
					notEmpty:{
						message:"不能为空"
					},
					stringLength:{
						max:30,
						message:"不能超过30个字"
					}
				}
			},
			add_codeParent:{
				validators:{
					callback:{
						message:'不能为空',
						callback:function(value,validator){
							var c = $("input[type=radio][name=add_formType]:checked").val();
							if(c=='2'){
								if(value!=null&&value!=''){
									return true;
								}else{
									return false;
								}
							}
							return true;
						}
					}
				}
			},
			add_sortable:{
				validators:{
					notEmpty:{
						message:"不能为空"
					},
					regexp: {
                        regexp: /^[0-9]*$/,
                        message: '只能输入数字！'
                    },
				}
			}
		}
	});
}

//初始化机构选择列表
function getParentCode() {
	$.ajax({
		url : portal.bp() + '/table/findAllParentCode',
		type : "get",
		async : false, // 同步 为全局变量赋值
		cache:false,
		success : function(data) {
			var html;
			var list = data.data;
			for (var i = 0; i < list.length; i++) {
				html += '<option value="' + list[i].encode+'">'
						+list[i].encode+'-' +list[i].name + '</option>';
			}
			$('#add_codeParent').html(html);
		}
	});
}
