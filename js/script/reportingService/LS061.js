//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
$(function(){
	
	//初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'R_REB_LOAN_TRAN_OUT_INFO-LS061'
           },
           cache: false,
           success: function (data) {
           	var s = data.data;
           	if(s.length == 0){
           		var trHtml = "<tr><td>暂无报表说明!</td></tr>";
	            	$("#noteList").append(trHtml);
           	}else{
	            	for(var i = 0;i<s.length;i++){
		            	//console.log(s[i].table_NOTE);
		            	var trHtml = "<tr><td align='left' class='note'>"+s[i].table_NOTE+"</td></tr>";
		            	$("#noteList").append(trHtml);
	            	}
	            	$("#noteList .no-records-found").hide();
           	}
           	
           	
           	
              
           }
   });
	
    //新增行
	//alert(empNum+"-"+date);
    $("#btn_add").click(function(){
    	var length = $("#table1").bootstrapTable("getData").length;
        var addtRcrdTm = getSystemDate("yyyy-MM-dd HH:mm:ss");
    	$("#table1").bootstrapTable("insertRow",{
            index:length,
            row:{
            	isAdd : true,
            	tranInOrgNum	:'',
            	tranInOrgName	:'',
            	tranOutOrgNum	:'',
            	tranOutOrgName	:'',
            	tranOutRatio :'',
            	pntTranOutAmt	:'',
            	yDailyTranOutAmt	:'',
            	intIncomTranOutAmt	:'',
            	prftTranOutAmt :'',
            	tranOutBeginDt	:'',
            	tranOutEndDt	:'',
            	memo	:'',           	        	
            	addtRcrdTm	:addtRcrdTm,
            	addtRcrdPersonEmpno	:empNum, 
            }
        });
    	//更新表中修改过字段的颜色
    	updateCellDataClass($("#table1"));
    });
    
  /*//删除行
	$("#btn_del").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
		var ids=[];
		$.each(checklist,function(index,item){
			ids.push(item.number);
			if(item.addtRcrdId!=undefined&&item.addtRcrdId!=null&&item.addtRcrdId!=''){
				deleteIds.push(item.addtRcrdId);
			}
		});
        $("#table1").bootstrapTable("remove",{
            field:'number',
            values:ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));
	});
    */
    //删除行
	$("#btn_del").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
		var ids=[];		
		$.each(checklist,function(index,item){
			ids.push(item.number);
			if(item.addtRcrdId!=undefined&&item.addtRcrdId!=null&&item.addtRcrdId!=''){
				deleteIds.push(item.addtRcrdId);
			}
		});
        $("#table1").bootstrapTable("remove",{
            field:'number',
            values:ids
        });
        //layer.msg("删除成功,请提交保存", {icon: 1});
      //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));

	});
	//保存
	$("#btn_save").click(function(){
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
			if(item.addtRcrdId!=undefined&&item.addtRcrdId!=null&&item.addtRcrdId!=''){
				//修改数据
				if(item.updateCell&&Object.keys(item.updateCell).length>0){
					updateData.push(item)
				}
			}else{
				//新增数据
				addData.push(item);
			}
		});
		if(addData.length==0&&updateData.length==0&&deleteData==0){
			layer.msg("没有任何修改，无需保存",{icon:3});
			return;
		}
		var data = {
  				"addData":addData,
				"updateData":updateData,
				"deleteData":deleteData
  		};
		var index;
  		$.ajax({
  			url:portal.bp() + '/table/addRecord/LS061saveAll',  			
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
    query();
});
//查询
function query() {
	deleteIds = [];
	//$('#table1').bootstrapTable('destroy');
    TableObjPage.table1();
    //$('#table2').bootstrapTable('destroy');
    TableObjPageHistory.table2();
}


var oldTable;
var TableObjPage = {
		table1: function () {
	        var columns = 
	              [
	               {
	            	   field:'check',
	            	   checkbox:true,
	               },
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
						 field:'tranInOrgNum',
						 title:'转入支行号',
						 align: "center",
						 valign: "middle",
						 editable:{
			                    type:'text',
			                    title:'转入支行号',
			                    placement:'top',
			                    emptytext:"空",
			                    validate: function (v) {
			                    	$el = $(this);
			                    	if (v==null||v==''){
			                    		return '转入支行号为必输项';
			                    	}else{
			                    		var branchName = $.param.getBranchName(v,'1');
			                    		if(branchName==null||branchName==''){
			                    			enableSiblings($el,"tranInOrgName");
			                    			//enableSiblingsAndSetValue($el,"tranInOrgName","");
			                    		}else{
			                    			disableSiblingsAndSetValue($el,"tranInOrgName",branchName);
			                    		}
			                    	}
			                    }
			              }
			              
					 },
					 {
						 field:'tranInOrgName',
						 title:'转入支行名称',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转入支行名称',
							 placement:'top',
							 emptytext:"空",
						 }
					 },
					 {
						 field:'tranOutOrgNum',
						 title:'转出支行号',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转出支行号',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	$el = $(this);
			                    	if (v==null||v==''){
			                    		return '转出支行号为必输项';
			                    	}else{
			                    		var branchName = $.param.getBranchName(v,'1');
			                    		if(branchName==null||branchName==''){
			                    			enableSiblings($el,"tranInOrgName");
			                    			//enableSiblingsAndSetValue($el,"tranOutOrgName","");
			                    		}else{
			                    			disableSiblingsAndSetValue($el,"tranOutOrgName",branchName);
			                    		}
			                    	}
			                    }
						 }
					 },
					 {
						 field:'tranOutOrgName',
						 title:'转出支行名称',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转出支行名称',
							 placement:'top',
							 emptytext:"空",
						 }
					 },
					 {
						 field:'tranOutRatio',
						 title:'转移比例',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转移比例',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                        if(v==null||v==''){
			                        	return '转移比例必填项';
			                        }else{
			                        	var reg = /^\d{0,8}\.{0,1}(\d{1,6})?$/;
			                        	reg = new RegExp(reg);
				                    	if(parseFloat(v)>0&&parseFloat(v)<1){
				                    		if(reg.test(v)){
				                    		}else{
				                    			return "转移比例最多保留6位有效小数";
				                    		}
				                    	}else{
				                    		return "转移比例大于0小于1"
				                    	}
			                        }
			                    }
						 }
					 },
					 {
						 field:'pntTranOutAmt',
						 title:'时点转移金额（元）',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'时点转移金额（元）',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
			                        if(v!=null&&v!=''&&v!='空'){
				                        if (!checkFloat(v)) return '时点转移金额必须是数字';
									 }
			                    }
						 }
					 },
					 {
						 field:'yDailyTranOutAmt',
						 title:'年日均转移金额',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'年日均转移金额',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
			                        if(v!=null&&v!=''&&v!='空'){
			                        	 if (!checkFloat(v)) return '年日均转移金额必须是数字';
			                        }
			                    }
						 }
					 },
					 {
						 field:'intIncomTranOutAmt',
						 title:'利息收入转移金额',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'利息收入转移金额',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
								 if(v!=null&&v!=''&&v!='空'){
			                        if (!checkFloat(v)) return '利息收入转移金额必须是数字';
								 }
			                    }
						 }
					 },
					 {
						 field:'prftTranOutAmt',
						 title:'利润转移金额',
						 align: "center",
						 valign: "middle",
						 formatter:function(value,row,index){
								if(value){
									return value;
								} else{
									return '';
								}
							 },
						 editable:{
							 type:'text',
							 title:'利润转移金额',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
								 if(v!=null&&v!=''&&v!='空'){
			                        if (!checkFloat(v)) return '利润转移金额必须是数字';
								 }
			                    }
						 }
					 },
					 {
						 field:'tranOutBeginDt',
						 title:'转移起始日期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'转移起始日期',
							 format:'yyyy-mm-dd',
							 placement:'left',
							 emptytext:"空",
							 validate: function (v) {
			                    	if (v==null||v=='') return '转移起始日期为必输项';
			                    }
						 }
					 },
					 {
						 field:'tranOutEndDt',
						 title:'转移结束日期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'转移结束日期',
							 format:'yyyy-mm-dd',
							 placement:'left',
							 emptytext:"空",
							 
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
						 field:'addtRcrdTm',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addtRcrdPersonEmpno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	                
	        ];
	        $('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/LS061query',
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
	                	'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,	                	
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            //height:getTableHeight(document), //表格固定高度
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
			    	if(row.addtRcrdId!=null&&row.addtRcrdId!=''){
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.addtRcrdId===row.addtRcrdId){
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
						 field:'tranInOrgNum',
						 title:'转入支行号',
						 align: "center",
						 valign: "middle",					
					 },
					 {
						 field:'tranInOrgName',
						 title:'转入支行名称',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'tranOutOrgNum',
						 title:'转出支行号',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'tranOutOrgName',
						 title:'转出支行名称',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'tranOutRatio',
						 title:'转移比例（%）',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'pntTranOutAmt',
						 title:'时点转移金额（元）',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'yDailyTranOutAmt',
						 title:'年日均转移金额（元）',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'intIncomTranOutAmt',
						 title:'利息收入转移金额',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'prftTranOutAmt',
						 title:'利润转移金额',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'tranOutBeginDt',
						 title:'转移起始日期',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'tranOutEndDt',
						 title:'转移结束日期',
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
						 field:'addtRcrdTm',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addtRcrdPersonEmpno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'opeTypeCd',
						 title:'操作类型',
						 align: "center",
						 valign: "middle",
					 },
		            
		    ];
		    $('#table2').bootstrapTable('destroy').bootstrapTable({
		        url: portal.bp() + '/table/addRecord/LS061queryAll',
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

		
