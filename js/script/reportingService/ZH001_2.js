//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
var flag = $.param.getWindowPhase();
var stratDate = "";
var endDate = "";
var startYear = "",startMonth="";
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth()+1;
$(function(){
	 $("#url").attr("href",portal.bp()+"/table/zhTable/ZH001?mid=3810");
	 
	 if(month==1){
		 startYear = year-1;
		 startMonth = "12";
	 }else{
		 startYear = year;
		 startMonth = month-1;
	 }	 
	 if(parseInt(startMonth)<10){
		 startMonth = "0"+startMonth
	 }
	 if(parseInt(month)<10){
		 month = "0"+month
	 }
	 if(flag=="1"){
		 stratDate = startYear+"-"+startMonth;
	 }else{
		 stratDate = year+"-"+month;
	 }
	 endDate = year+"-"+month;
	 
	 $("#mon").datetimepicker({
         language:"zh-CN",
         format:"yyyy-mm",
         minView:3,
         startView:3,
         autoclose:true,
         clearBtn:false,
     });
	 $('#mon').datetimepicker('setStartDate',stratDate);
	 $('#mon').datetimepicker('setEndDate',endDate);
	 $("#mon").change(function(){
		 var mon = $(this).val();
		 
		 if(mon!=stratDate&&mon!=endDate){
			 $('#table1').bootstrapTable('destroy');
			 $('#table2').bootstrapTable('destroy');
			 //$("#tab").click();
		 }
	 });
	
	//保存新增
		$("#btn_save1").click(function(){
			//bootstrapTable 编辑列表校验
			var validateError = validateBootStrapTableEdit($("#table1"));
			if(validateError!=null){
				layer.msg(validateError,{icon:2});
				return;
			}
			var addData = [];
			var updateData = [];
			var deleteData = deleteIds;
			var tableData = $("#table1").bootstrapTable("getData");
			$.each(tableData,function(index,item){
				addData.push(item)
			});
			var data = {
	  				"addData":addData,
					"updateData":updateData
					//"deleteData":deleteData
	  		};
			var index;
	  		$.ajax({
	  			url:portal.bp() + '/table/addRecord/ZH001_2saveAll',  			
	  			type:'post',
	  			cache:false,
	            contentType: "application/json;charset=UTF-8",
	  			dataType: "json",
	            data:JSON.stringify(data),
	  			success:function(o){
	  				var code = o.code;
	  				if(code == 200){
	  					layer.msg("提交成功", {icon: 1});
	  					queryHistory();
	  					$('#table1').bootstrapTable('destroy');
	  					//$('#table1').bootstrapTable('load',empty);
	  				}else{
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
	 
	//保存
	$("#btn_save2").click(function(){
		//bootstrapTable 编辑列表校验
		var validateError = validateBootStrapTableEdit($("#table2"));
		if(validateError!=null){
			layer.msg(validateError,{icon:2});
			return;
		}
		var addData = [];
		var updateData = [];
		var deleteData = deleteIds;
		var tableData = $("#table2").bootstrapTable("getData");
		$.each(tableData,function(index,item){
			updateData.push(item)	
		});
		
		if(addData.length==0&&updateData.length==0&&deleteData==0){
			layer.msg("没有任何修改，无需保存",{icon:3});
			return;
		}
		
		var data = {
  				"addData":addData,
				"updateData":updateData
				//"deleteData":deleteData
  		};
		var index;
  		$.ajax({
  			url:portal.bp() + '/table/addRecord/ZH001_2saveAll',  			
  			type:'post',
  			cache:false,
            contentType: "application/json;charset=UTF-8",
  			dataType: "json",
            data:JSON.stringify(data),
  			success:function(o){
  				var code = o.code;
  				if(code == 200){
  					layer.msg("提交成功", {icon: 1});
  					query();
  				}else{
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
	
});

//查询新增项
function queryRows() {
	var mon = $("#mon").val();	
	var num = 0; 
	if(mon==""||mon==null){
		layer.msg("请选择需新增数据的月份",{icon:3});
	}else if(mon!=stratDate&&mon!=endDate){
		layer.msg("补录月份不在窗口期内，请重新输入",{icon:3});
	}else{
		num = $.param.getIsAdds(mon);
		if(num>0){
			layer.msg("当前月份已补录，请重新选择月份或者查询修改项进行修改",{icon:3});
		}else{
			$('#table1').bootstrapTable('destroy');
		    TableObjPage.table1();
		    $("#tab1").click();
		}
	}
	
}

//查询修改项
function query() {	
	var mon = $("#mon").val();
	if(mon==""||mon==null){
		layer.msg("请选择需修改数据的月份",{icon:3});
	}else if(mon!=stratDate&&mon!=endDate){
		layer.msg("补录月份不在窗口期内，请重新输入",{icon:3});
	}else{
		$('#table2').bootstrapTable('destroy');
	    TableObjPage.table2();
	    $("#tab2").click();
	}
	
	
}
//查询修改记录
function queryHistory() {
	$('#table3').bootstrapTable('destroy');
	TableObjPageHistory.table3();
	$("#tab3").click();
}


var oldTable;
var TableObjPage = {
		table1: function(){

	        var columns = 
	              [	               
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },
					 {
						 field:'sub_brch_bnk_no',
						 title:'支行行号',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'sub_brch_name',
						 title:'支行名称',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'mon',
						 title:'月 份',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'card_ret',
						 title:'卡返还',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'卡返还',
							 placement:'top',
							 emptytext:"0",		
							 validate: function (v) {
			                       if (!checkFloat(v)) return '卡返还必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'two_dsnl_cd_recv_bill_ret',
						 title:'二维码收单返还',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'二维码收单返还',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '二维码收单返还必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'trade_linkg',
						 title:'自贸联动',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'自贸联动',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '自贸联动必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'indv_incom_adj',
						 title:'个人收入调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'个人收入调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '个人收入调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'inter_corp_adj',
						 title:'国际公司调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'国际公司调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '国际公司调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'inter_indv_adj',
						 title:'国际个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'国际个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '国际个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_indv_adj',
						 title:'同业个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'capt_corp_adj',
						 title:'资金公司调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'资金公司调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '资金公司调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'capt_indv_adj',
						 title:'资金个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'资金个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '资金个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'other_incom_adj',
						 title:'其他收入调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其他收入调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其他收入调整必须是数字';
			                 }
						 }
					 },						 
					 {
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'备注',
							 placement:'top',
							 emptytext:"空",
							 
						 }
					 },
					 /*{
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	                */
	        ];
	        $('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/ZH001_2queryRows',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	           // pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {	       
	            	return{
	            		'mon':$("#mon").val(),
	            		'authOrgs':authOrgs,
	            	};
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	           // height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	oldTable = JSON.parse(JSON.stringify(res.data));
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            rowStyle:function(row,index){
	            	if(row.isAdd){
	            		//新增行样式
	            		/*['active','success','info','warning','danger']*/
	            		/*return {
	            				css:{
	            					'color':'green'
	            				}
	            		}*/
	            		return {classes:'info'};
	            	}else{
	            		return {};
	            	}
	            },
	            onLoadSuccess: function (data) {
	            	initBootStrapTablevalidateEdit($("#table1"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){	
	            	$("#table1").bootstrapTable("resetView");
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.org_num===row.org_num){
								if(eval("item."+field)===eval("row."+field)){
									$el.removeClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									delete row.updateCell[field];
								}else{
									$el.addClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									row.updateCell[field] = '1';
								}
							}
						});
					
				},
	            columns: columns,
	        });
	    
		},
		table2: function () {
	        var columns = 
	              [	               
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },
					 {
						 field:'sub_brch_bnk_no',
						 title:'支行行号',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'sub_brch_name',
						 title:'支行名称',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'mon',
						 title:'月 份',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'card_ret',
						 title:'卡返还',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'卡返还',
							 placement:'top',
							 emptytext:"0",	
							 validate: function (v) {
			                       if (!checkFloat(v)) return '卡返还必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'two_dsnl_cd_recv_bill_ret',
						 title:'二维码收单返还',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'二维码收单返还',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '二维码收单返还必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'trade_linkg',
						 title:'自贸联动',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'自贸联动',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '自贸联动必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'indv_incom_adj',
						 title:'个人收入调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'个人收入调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '个人收入调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'inter_corp_adj',
						 title:'国际公司调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'国际公司调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '国际公司调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'inter_indv_adj',
						 title:'国际个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'国际个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '国际个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_indv_adj',
						 title:'同业个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'capt_corp_adj',
						 title:'资金公司调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'资金公司调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '资金公司调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'capt_indv_adj',
						 title:'资金个人调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'资金个人调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '资金个人调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'other_incom_adj',
						 title:'其他收入调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其他收入调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其他收入调整必须是数字';
			                 }
						 }
					 },						 
					 {
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'备注',
							 placement:'top',
							 emptytext:"空",
							 
						 }
					 },					
					 {
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	                
	        ];
	        $('#table2').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/ZH001_2query',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	           // pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {	       
	            	return{
	            		'mon':$("#mon").val(),
	            		'authOrgs':authOrgs,
	            	};
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	           // height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	oldTable = JSON.parse(JSON.stringify(res.data));
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            rowStyle:function(row,index){
	            	if(row.isAdd){
	            		//新增行样式
	            		/*['active','success','info','warning','danger']*/
	            		/*return {
	            				css:{
	            					'color':'green'
	            				}
	            		}*/
	            		return {classes:'info'};
	            	}else{
	            		return {};
	            	}
	            },
	            onLoadSuccess: function (data) {
	            	initBootStrapTablevalidateEdit($("#table2"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){
	            	$("#table2").bootstrapTable("resetView");
			    	if(row.addt_rcrd_id!=null&&row.addt_rcrd_id!=''){
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.addt_rcrd_id===row.addt_rcrd_id){
								if(eval("item."+field)===eval("row."+field)){
									$el.removeClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									delete row.updateCell[field];
								}else{
									$el.addClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									row.updateCell[field] = '1';
								}
							}
						});
					}
					
				},
	            columns: columns,
	        });
	    }

}

var TableObjPageHistory = {
		table3: function () {
		    var columns = 
		          [		           
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					    }
					},
					{
						 field:'sub_brch_bnk_no',
						 title:'支行行号',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'sub_brch_name',
						 title:'支行名称',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'mon',
						 title:'月 份',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'card_ret',
						 title:'卡返还',
						 align: "center",
						 valign: "middle",						 
					},	
					{
						 field:'two_dsnl_cd_recv_bill_ret',
						 title:'二维码收单返还',
						 align: "center",
						 valign: "middle",
					},	
					{
						 field:'trade_linkg',
						 title:'自贸联动',
						 align: "center",
						 valign: "middle",
					},	
					{
						 field:'indv_incom_adj',
						 title:'个人收入调整',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'inter_corp_adj',
						 title:'国际公司调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'inter_indv_adj',
						 title:'国际个人调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'ibank_indv_adj',
						 title:'同业个人调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'capt_corp_adj',
						 title:'资金公司调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'capt_indv_adj',
						 title:'资金个人调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'other_incom_adj',
						 title:'其他收入调整',
						 align: "center",
						 valign: "middle",
						
					},						 
					{
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						
					},					
					{
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					},
					{
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					},
		            
		    ];
		    $('#table3').bootstrapTable('destroy').bootstrapTable({
		        url: portal.bp() + '/table/addRecord/ZH001_2queryAll',
		        method: 'get',      //请求方式（*）
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
		            	'mon':$("#mon").val(),
		            	'authOrgs':authOrgs,
		            	'pageSize': params.limit,
		                'pageNum': (params.offset / params.limit) + 1,            	
		            };
		        },
		        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
		        pageNum: 1,      //初始化加载第一页，默认第一页
		        pageSize: 100,      //每页的记录行数（*）
		        pageList: [50,100],  //可供选择的每页的行数（*）
		        clickToSelect: false,    //是否启用点击选中行
		        resizable:true,			//是否可调整列宽度
		        //height:getTableHeight(document), //表格固定高度
		        responseHandler: function (res) { //服务端返回数据
		            if (res.code == '200') {
		            	//oldTable = JSON.parse(JSON.stringify(res.data));
		                return res.data;
		            } else {
		                layer.msg(res.message, {icon: 2});
		                return {};
		            }
		        },
		        rowStyle:function(row,index){
		        	if(row.isAdd){
		        		//新增行样式
		        		/*['active','success','info','warning','danger']*/
		        		/*return {
		        				css:{
		        					'color':'green'
		        				}
		        		}*/
		        		return {classes:'info'};
		        	}else{
		        		return {};
		        	}
		        },
		        onLoadSuccess: function (data) {
		        	resizeTables();
		        },
		       
		        columns: columns
		
		    });
		}
}

		
