//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
var needAdds = ['debitCardIncom511051104','debitCardIncom511051105'
	               ,'debitCardIncom511051106','debitCardIncom511051107'
	               ,'debitCardIncom511051108','debitCardIncom511051119'
	               ,'debitCardIncom511051129','debitCardIncom511051137'
	               ,'debitCardIncom511051138','debitCardIncom511051139'
	               ,'jx0007511051107','jx0007511051108'];
$(function(){
	//初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': 'R_RETAIL_DEBIT_CARD_INCOM_ADDT_RCRD-LS_BL_005'
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
            	debitCardIncom511051104	:'',
            	debitCardIncom511051105	:'',
            	debitCardIncom511051106	:'',
            	debitCardIncom511051107	:'',
            	debitCardIncom511051108	:'',
            	debitCardIncom511051119	:'',
            	debitCardIncom511051129	:'',
            	debitCardIncom511051137	:'',
            	debitCardIncom511051138	:'',
            	debitCardIncom511051139	:'',
            	jx0007511051107	:'',
            	jx0007511051108	:'',
            	debitCardIncomSum	:'',
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
  			url:portal.bp() + '/table/addRecord/LSBL005saveAll',  			
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
						 field:'debitCardIncom511051104',
						 title:'511051104<br/>银行卡跨行转账手续费收入',
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
							 title:'511051104银行卡跨行转账手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
			                    	//if (v==null||v=='') return '必输项';
			                        if (!checkYuan(v)) return '511051104银行卡跨行转账手续费收入必须是保留两位的数字';
			                        $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                        setdebitCardIncomSum($el,v);
			                    }
						 }
					 },
					 {
						 field:'debitCardIncom511051105',
						 title:'511051105<br/>ATM人民币卡收单手续费收入',
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
							 title:'511051105 ATM人民币卡收单手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051105 ATM人民币卡收单手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051106',
						 title:'511051106<br/>ATM外卡收单手续费收入',
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
							 title:'511051106 ATM外卡收单手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051106 ATM外卡收单手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051107',
						 title:'511051107<br/>POS发卡交易手续费收入',
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
							 title:'511051107 POS发卡交易手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051107 POS发卡交易手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051108',
						 title:'511051108<br/>银行卡特殊交易手续费收入',
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
							 title:'511051108 银行卡特殊交易手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051108 银行卡特殊交易手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051119',
						 title:'511051119<br/>ATM跨行查询收单手续费收入',
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
							 title:'511051119 ATM跨行查询收单手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051119 ATM跨行查询收单手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051129',
						 title:'511051129<br/>柜面通受理业务手续费收入',
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
							 title:'511051129 柜面通受理业务手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051129 柜面通受理业务手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051137',
						 title:'511051137<br/>ATM跨行存款受理业务手续费收入',
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
							 title:'511051137 ATM跨行存款受理业务手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051137 ATM跨行存款受理业务手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051138',
						 title:'511051138<br/>助农取款收单业务手续费收入',
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
							 title:'511051138 助农取款收单业务手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051138 助农取款收单业务手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncom511051139',
						 title:'511051139<br/>IC卡跨行圈存手续费收入',
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
							 title:'511051139 IC卡跨行圈存手续费收入',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return '511051139 IC卡跨行圈存手续费收入必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
			                     setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'jx0007511051107',
						 title:'JX0007-511051107',
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
							 title:'JX0007-511051107',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return 'JX0007-511051107必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
								 setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'jx0007511051108',
						 title:'JX0007-511051108',
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
							 title:'JX0007-511051108',
							 placement:'top',
							 emptytext:"空",
							 validate: function (v) {
								 //if (v==null||v=='') return '必输项';
								 if (!checkYuan(v)) return 'JX0007-511051108必须是保留两位的数字';
								 $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
								 setdebitCardIncomSum($el,v);
							 }
						 }
					 },
					 {
						 field:'debitCardIncomSum',
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
	            url: portal.bp() + '/table/addRecord/LSBL005query',
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
						 field:'debitCardIncom511051104',
						 title:'511051104<br/>银行卡跨行转账手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051105',
						 title:'511051105<br/>ATM人民币卡收单手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051106',
						 title:'511051106<br/>ATM外卡收单手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051107',
						 title:'511051107<br/>POS发卡交易手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051108',
						 title:'511051108<br/>银行卡特殊交易手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051119',
						 title:'511051119<br/>ATM跨行查询收单手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051129',
						 title:'511051129<br/>柜面通受理业务手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051137',
						 title:'511051137<br/>ATM跨行存款受理业务手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051138',
						 title:'511051138<br/>助农取款收单业务手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncom511051139',
						 title:'511051139<br/>IC卡跨行圈存手续费收入',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'jx0007511051107',
						 title:'JX0007-511051107',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'jx0007511051108',
						 title:'JX0007-511051108',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'debitCardIncomSum',
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
		        url: portal.bp() + '/table/addRecord/LSBL005queryAll',
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
function setdebitCardIncomSum($el,v){
	var currentField = $el.attr("data-name");
	var rowIndex = $el.parent().parent().prevAll().length;
	var tableData = $("#table1").bootstrapTable("getData");
	var debitCardIncomSum = 0;
	$.each(needAdds,function(index,item){
		if(item==currentField){
			debitCardIncomSum += formatAmt(v);
		}else{
			debitCardIncomSum += formatAmt(tableData[rowIndex][item]);
		}
	});
    disableSiblingsAndSetValue($el,"debitCardIncomSum",debitCardIncomSum);
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
		
