//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
var needAdds = ['debitCardExpns527061100','debitCardExpns527061102'
	               ,'debitCardExpns527061103','debitCardExpns527061110'
	               ,'debitCardExpns527061111','debitCardExpns527061115'
	               ,'debitCardExpns527061118','debitCardExpns527061119'
	               ,'debitCardExpns527061120','debitCardExpns527061129'];
$(function(){
	//初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'R_RETAIL_DEBIT_CARD_EXPNS_ADDT_RCRD-LS_BL_004'
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
		            	var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>"+s[i].table_NOTE+"</td></tr>";
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
            	subBrchNum	:'',
            	subBrchName	:'',
            	regLineNum	:'',
            	regLineName	:'',
            	debitCardExpns527061100	:'',
            	debitCardExpns527061102	:'',
            	debitCardExpns527061103	:'',
            	debitCardExpns527061110	:'',
            	debitCardExpns527061111	:'',
            	debitCardExpns527061115	:'',
            	debitCardExpns527061118	:'',
            	debitCardExpns527061119	:'',
            	debitCardExpns527061120	:'',
            	debitCardExpns527061129	:'',
            	debitCardExpnsSum	:'',
            	dataDt	:'',
            	addtRcrdTm	:addtRcrdTm,
            	addtRcrdPersonEmpno	:empNum,           	
            }
        });
    	//更新表中修改过字段的颜色
    	updateCellDataClass($("#table1"));
    });
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
		var nflag = false;
		var ni;
		$.each(tableData,function(index,item){
			nflag = false;
			$.each(needAdds,function(nindex,nitem){
				if(item[nitem]!=null&&item[nitem]!=''&&parseFloat(item[nitem])!=0){
					nflag = true;
				}
			});
			if(!nflag){
				ni = index;
				return false;
			}
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
		if(!nflag){
			layer.msg("第"+(ni+1)+"行，补录金额字段不可同时为空，至少补录一项不为零金额",{icon:2});
			return;
		}
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
  			url:portal.bp() + '/table/addRecord/LSBL004saveAll',  			
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
	$('#table1').bootstrapTable('destroy');	
    TableObjPage.table1();
    $('#table2').bootstrapTable('destroy');
    TableObjPageHistory.table2();
}
function queryAll(){
	$('#table2').bootstrapTable('destroy');
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
						 field:'subBrchNum',
						 title:'支行编号',
						 align: "center",
						 valign: "middle",
						 editable:{
			                    type:'text',
			                    title:'支行编号',
			                    placement:'top',
			                    emptytext:"空",
			                    validate: function (v) {
		                            $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
		                            if (v==null||v==''){
		                                return '支行编号为必输项';
		                            }else{
		                                var branchInfo = $.param.getBranchInfo(v);
		                                if(branchInfo==null||branchInfo.length==0){
		                                    return '支行编号不存在';
		                                }else{
		                                    var rowIndex = $el.parent().parent().prevAll().length;
		                                    var tableData = $("#table1").bootstrapTable("getData");
		                                    tableData[rowIndex].subBrchId = branchInfo[0].lev5_org_id;
		                                    tableData[rowIndex].regLineId = branchInfo[0].lev4_reg_line_org_id;
		                                    disableSiblingsAndSetValue($el,"subBrchName",branchInfo[0].lev5_org_name);
		                                    disableSiblingsAndSetValue($el,"regLineNum",branchInfo[0].lev4_reg_line_org_num);
		                                    disableSiblingsAndSetValue($el,"regLineName",branchInfo[0].lev4_reg_line_name);

		                                }
		                            }
		                        }
			                }
					 },
					 {
						 field:'subBrchName',
						 title:'支行名称',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'转入支行名称',
							 placement:'top',
							 emptytext:"空",
							 disabled: true,
						 }
					 },
					 {
						 field:'regLineNum',
						 title:'管辖行编号',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'管辖行编号',
							 placement:'top',
							 emptytext:"空",
							 disabled: true,
						 }
					 },
					 {
						 field:'regLineName',
						 title:'管辖行名称',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'管辖行名称',
							 placement:'top',
							 emptytext:"空",
							 disabled: true,
						 }
					 },
					 {
						 field:'debitCardExpns527061100',
						 title:'527061100<br/>ATM发卡交易手续费支出',
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
							 title:'527061100 ATM发卡交易手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
			                        if (!checkYuan(v)) return '527061100 ATM发卡交易手续费支出必须是保留两位的数字';
			                        $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                        setDebitCardExpnsSum($el,v);
			                    }
						 }
					 },
					 {
						 field:'debitCardExpns527061102',
						 title:'527061102<br/>直联POS人民币卡收单手续费支出',
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
							 title:'527061102 直联POS人民币卡收单手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061102 直联POS人民币卡收单手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061103',
						 title:'527061103<br/>银行卡特殊交易手续费支出',
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
							 title:'527061103 银行卡特殊交易手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061103 银行卡特殊交易手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061110',
						 title:'527061110<br/>京卡跨行/跨境查询手续费支出',
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
							 title:'527061110 京卡跨行/跨境查询手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061110 京卡跨行/跨境查询手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061111',
						 title:'527061111<br/>银行卡品牌服务费支出',
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
							 title:'527061111 银行卡品牌服务费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061111 银行卡品牌服务费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061115',
						 title:'527061115<br/>柜面通发卡业务手续费支出',
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
							 title:'527061115 柜面通发卡业务手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061115 柜面通发卡业务手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061118',
						 title:'527061118<br/>助农取款业务手续费支出',
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
							 title:'527061118 助农取款业务手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061118 助农取款业务手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061119',
						 title:'527061119<br/>ATM跨行存款发卡业务手续费支出',
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
							 title:'527061119 ATM跨行存款发卡业务手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061119 ATM跨行存款发卡业务手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061120',
						 title:'527061120<br/>IC卡跨行圈存手续费支出*标准',
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
							 title:'527061120 IC卡跨行圈存手续费支出*标准',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061120 IC卡跨行圈存手续费支出*标准必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpns527061129',
						 title:'527061129<br/>银行卡转接清算手续费支出',
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
							 title:'527061129 银行卡转接清算手续费支出',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '527061129 银行卡转接清算手续费支出必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setDebitCardExpnsSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardExpnsSum',
						 title:'合计',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'合计',
							 placement:'top',
							 emptytext:"空",
							 disabled: true,
						 }
					 },
					 {
						 field:'dataDt',
						 title:'月份',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'date',
							 title:'月份',
							 format:'yyyy-mm',
							 placement:'left',
							 emptytext:"空",
							 datepicker:{
								 startView: 1,
								 minViewMode: 1,
							 },
							 validate: function (v) {
			                    	if (v==null||v=='') return '月份为必输项';
			                    }
							 
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
	            url: portal.bp() + '/table/addRecord/LSBL004query',
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
						 field:'subBrchNum',
						 title:'支行编号',
						 align: "center",
						 valign: "middle",
						 
					 },
					 {
						 field:'subBrchName',
						 title:'支行名称',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'regLineNum',
						 title:'管辖行编号',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'regLineName',
						 title:'管辖行名称',
						 align: "center",
						 valign: "middle",
						
					 },
					 {
						 field:'debitCardExpns527061100',
						 title:'527061100<br/>ATM发卡交易手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061102',
						 title:'527061102<br/>直联POS人民币卡收单手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061103',
						 title:'527061103<br/>银行卡特殊交易手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061110',
						 title:'527061110<br/>京卡跨行/跨境查询手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061111',
						 title:'527061111<br/>银行卡品牌服务费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061115',
						 title:'527061115<br/>柜面通发卡业务手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061118',
						 title:'527061118<br/>助农取款业务手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061119',
						 title:'527061119<br/>ATM跨行存款发卡业务手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061120',
						 title:'527061120<br/>IC卡跨行圈存手续费支出*标准',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpns527061129',
						 title:'527061129<br/>银行卡转接清算手续费支出',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardExpnsSum',
						 title:'合计',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'dataDt',
						 title:'月份',
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
		        url: portal.bp() + '/table/addRecord/LSBL004queryAll',
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
		       // height:getTableHeight(document), //表格固定高度
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
/**
 * 保留四位小数
 */
var pattern3 = /^(([1-9][0-9]{0,})|0)(\.\d{1,2})?$/;
function checkYuan(v){
	if(v=='') return true;
	return pattern3.test(v);
}
function setDebitCardExpnsSum($el,v){
	var currentField = $el.attr("data-name");
	var rowIndex = $el.parent().parent().prevAll().length;
	var tableData = $("#table1").bootstrapTable("getData");
	var debitCardExpnsSum = 0;
	$.each(needAdds,function(index,item){
		if(item==currentField){
			debitCardExpnsSum += formatAmt(v);
		}else{
			debitCardExpnsSum += formatAmt(tableData[rowIndex][item]);
		}
	});
    disableSiblingsAndSetValue($el,"debitCardExpnsSum",debitCardExpnsSum);
}
function formatAmt(v){
	var res;
	if(v==undefined||v==null||v==''){
		res = 0;
	}else{
		res = v;
	}
	return parseFloat(res);
}
		
