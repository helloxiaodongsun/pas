var addrcrdid="";
var traninbrchid =""; 
var traninbrchnum =""; 
var traninbrchname="";
var tranoutbrchid="";
var tranoutbrchnum="";
var tranoutbrchname="";
var pnttranoutamt="";
var tranoutbegindt="";
var tranoutenddt="";
var memo="";
var openType ="";
var empNum ="";

$(function () {
	
	//行内编辑框可拖动
	$(document).on("show.bs.modal",".editable-popup",function(){
		$(this).draggable();
	})
	
	var type='post'; //ajax类型
	//数据显示列表
	TableObj.oTableInit();
	TableAllObj.oTableInit();
	//表单校验
	//addModalValidator();

	//初始化查询员工工号
	 $.ajax({
         url: portal.bp() + '/table/queryCurrentUser',
         type: "get",
         async: false, // 同步 为全局变量赋值         
         cache: true,
         success: function (data) {
         	var user = data.data;     
            empNum = user.empNum;
            
         }
	 });
	
	 
	//初始化报表说明(备注)
	    $.ajax({
	           url: portal.bp() + '/table/queryNote',
	           type: "get",
	           async: false, // 同步 为全局变量赋值
	           data: {
	               'tableName': 'R_RETAIL_IN_RES_TRAN_OUT_INFO-LS017_1'
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
	 
	//新增按钮
	$("#btn_add").click(function(){
		type = 'post';
		openType='01';//编辑
		$("#addModal").modal("show");
		$("#addModal_title").text("新增");
        $('#tranFundstable').bootstrapTable('destroy');
        $("#addRow").show();
        TableAddObj.oTableInit();      
       $("#tranFundstable .no-records-found").hide();
	});
	//新增行
	$("#addRow").click(function(){
        var length = $("#tranFundstable").bootstrapTable("getData").length;
        $("#tranFundstable").bootstrapTable("insertRow",{
            index:length,
            row:{
                traninbrchnum:'',
                traninbrchname:'',
                tranoutbrchnum:'',
                tranoutbrchname:'',
                pnttranoutamt:'',
                tranoutbegindt:'',
                tranoutenddt:'',
                memo:'',
                addtrcrdpersonempno:empNum,
                addtrcrdtm:""
            }
        });
	});

	//删除行
	$("#delRow").click(function(){
        var length = $("#tranFundstable").bootstrapTable("getData").length;
        var checklist = $('#tranFundstable').bootstrapTable('getSelections');
       	//$("#tranFundstable tr").eq(length).remove();
		var ids=[];
		ids.push(checklist);
        $("#tranFundstable").bootstrapTable("remove",{
            field:'index',
            value:[parseInt(length)-1]
        });

	});

	
	//修改按钮
	$("#btn_upd").click(function(){
		var checklist = $('#querytable').bootstrapTable('getSelections');
		$.each(checklist,function(index,item){
			addrcrdid = item.addrcrdid;
		});
		if(checklist.length>1){
			layer.msg("只能选择一个",{icon:3});
		}else if(checklist.length==0){
			layer.msg("请选择",{icon:3});
		}else{
			openType='02';//编辑
			$("#addModal").modal("show");
			$("#addModal_title").text("编辑");
			$('#tranFundstable').bootstrapTable('destroy');
			
	        TableUpdateObj.oTableInit();
//	        $("#addRow").click();
	        $("#addRow").hide();
			/*$.ajax({
				url : portal.bp() + '/table/tableWhere/queryTranFundsDetail',
				dataType:'json',
				cache:true,
				type:'get',
				contentType: "application/x-www-form-urlencoded",
				data:{
					'addrcrdid' : addrcrdid
				},
				success : function(data) {
					if (data.code == "200") {
						var result = data.data;
						addrcrdid = addrcrdid;
				        traninbrchid = result.traninbrchid!=""?result.traninbrchid:"空";
				        traninbrchname =result.traninbrchname!=""?result.traninbrchname:"空";
				        tranoutbrchid =result.tranoutbrchid!=""?result.tranoutbrchid:"空";
				        tranoutbrchname =result.tranoutbrchname!=""?result.tranoutbrchname:"空";
				        pnttranoutamt = result.pnttranoutamt!=null?result.pnttranoutamt:"空";
				        tranoutbegindt = result.tranoutbegindt!=null?result.tranoutbegindt:"空";
				        tranoutenddt =result.tranoutenddt!=null?result.tranoutenddt:"空";
				        memo =result.memo!=""?result.memo:"空";
						
						//$("#add_orgNum").val(org.orgNum).prop('disabled',true);
						//$("#add_orgName").val(org.orgName).prop('disabled',true);
						$("#addModal").modal("show");
						$("#addModal_title").text("编辑");

						$('#tranFundstable').bootstrapTable('destroy');
						
				        TableUpdateObj.oTableInit();
				        $("#addRow").click();
				        $("#addRow").hide();
				        
					}else {
						layer.msg(data.message,{icon:2});
					}
					
				}
				
			});*/
		}
		
	});
	//删除按钮
	$("#btn_del").click(function(){
		var checklist = $('#querytable').bootstrapTable('getSelections');
		if(checklist.length == 0){
			layer.msg("请选择",{icon:3});
		}else{
			var text = "确定删除选中的"+checklist.length+"项吗？";
			layer.confirm(text, {
					btn: ['确定','取消'] //按钮
		      	}, function(){
		            var TableTranFundsLists = [];
		    		$.each(checklist,function(index,item){
		      		var tableTranFundsList = {
		      				"addrcrdid":item.addrcrdid,
		      				"traninbrchid":item.traninbrchid,
		                    "traninbrchnum":item.traninbrchnum,
		                    "traninbrchname":item.traninbrchname,
		                    "tranoutbrchid":item.tranoutbrchid,
		                    "tranoutbrchnum":item.tranoutbrchnum,
		                    "tranoutbrchname":item.tranoutbrchname,
		                    "pnttranoutamt":item.pnttranoutamt,
		                    "tranoutbegindt":item.tranoutbegindt,
		                    "tranoutenddt":item.tranoutenddt,
		                    "memo":item.memo,
		                    "addtrcrdpersonempno":item.addtrcrdpersonempno,
		                    "addtrcrdtm":item.addtrcrdtm
		    			};
		      			TableTranFundsLists.push(tableTranFundsList);
		    		});
		                		    		              
		      		var data = {
		      				"tableTranFundsLists":TableTranFundsLists	
		      		};
		      		$.ajax({
		      			url:portal.bp() + '/table/tableWhere/delTranFunds',
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
	$("#saveBtn").click(function(){
		//表单校验
		var allTabelDate = $("#tranFundstable").bootstrapTable("getData");
        var TableTranFundsLists = [];
        var urls = "";
        if(openType=="01"){
        	urls = "/table/tableWhere/saveTranFunds";
        	$.each(allTabelDate,function(index,item){
    			var tableTranFundsList = {
                    "traninbrchid":item.traninbrchid,
                    "traninbrchnum":item.traninbrchnum,
                    "traninbrchname":item.traninbrchname,
                    "tranoutbrchid":item.tranoutbrchid,
                    "tranoutbrchnum":item.tranoutbrchnum,
                    "tranoutbrchname":item.tranoutbrchname,
                    "pnttranoutamt":item.pnttranoutamt,
                    "tranoutbegindt":item.tranoutbegindt,
                    "tranoutenddt":item.tranoutenddt,
                    "memo":item.memo,
                    "addtrcrdpersonempno":item.addtrcrdpersonempno,
                    "addtrcrdtm":item.addtrcrdtm
    			};
                TableTranFundsLists.push(tableTranFundsList);
    		});
        }else if(openType=="02"){
        	urls = "/table/tableWhere/updateToSaveTranFunds"
    		$.each(allTabelDate,function(index,item){
    			var tableTranFundsList = {
    				"addrcrdid":item.addrcrdid!=""?item.addrcrdid:addrcrdid,
    	            "traninbrchid":item.traninbrchid!=""?item.traninbrchid:traninbrchid,
                    "traninbrchnum":item.traninbrchnum!=""?item.traninbrchnum:traninbrchnum,
                    "traninbrchname":item.traninbrchname!=""?item.traninbrchname:traninbrchname,
                    "tranoutbrchid":item.tranoutbrchid!=""?item.tranoutbrchid:tranoutbrchid,
                    "tranoutbrchnum":item.tranoutbrchnum!=""?item.tranoutbrchnum:tranoutbrchnum,
                    "tranoutbrchname":item.tranoutbrchname!=""?item.tranoutbrchname:tranoutbrchname,
                    "pnttranoutamt":item.pnttranoutamt!=""?item.pnttranoutamt:pnttranoutamt,
                    "tranoutbegindt":item.tranoutbegindt!=""?item.tranoutbegindt:tranoutbegindt,
                    "tranoutenddt":item.tranoutenddt!=""?item.tranoutenddt:tranoutenddt,
                    "memo":item.memo!=""?item.memo:memo,
                    "addtrcrdpersonempno":item.addtrcrdpersonempno,
                    "addtrcrdtm":item.addtrcrdtm
    			};
                TableTranFundsLists.push(tableTranFundsList);
    		});
        }
	
		var data = {
				"tableTranFundsLists":TableTranFundsLists
		};
		$.ajax({
  			url:portal.bp() +urls,
  			type:type,
  			cache:false,
            contentType: "application/json;charset=UTF-8",
  			dataType: "json",
            data:JSON.stringify(data),

            success:function(o){
  				var code = o.code;
  				if(code == 200){
  					$("#addModal").modal("hide");
  					layer.msg("提交成功", {icon: 1});
  					query();
  				}else{
  					layer.msg(o.message, {icon: 2});
  				}
  			} 
  		});
	});
    
});

//分页查询列表	 
var TableObj = {
		oTableInit:function (){
			$('#querytable').bootstrapTable({
				url: portal.bp() + '/table/showTableTranFundsList', //showtableWhere
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
					     	field: 'traninbrchnum',
					     	title: '转入支行号',
					    }, {
					     	field: 'traninbrchname',
					     	title: '转入支行名称',
					    }, {
					     	field: 'tranoutbrchnum',
					     	title: '转出支行号',
					    },  {
					     	field: 'tranoutbrchname',
					     	title: '转出支行名称',
					    }, 
					    {
					     	field: 'pnttranoutamt',
					     	title: '时点转出金额(元)',
					    },
					    {
					    	field: 'tranoutbegindt',
					    	title: '转移起始日期',
					    },
					    {
					    	field: 'tranoutenddt',
					    	title: '转移结束日期',
					    },
					    {
					    	field: 'memo',
					    	title: '备注',
					    },
					    {
					    	field: 'addtrcrdpersonempno',
					    	title: '补录人员工号',
					    },
					    {
					    	field: 'addtrcrdtm',
					    	title: '补录时间',
					    },

				    ]
	  });
	}
};

//分页查询列表	 
var TableAllObj = {
		oTableInit:function (){
			$('#queryAlltable').bootstrapTable({
				url: portal.bp() + '/table/showTableTranFundsAllList', //showtableWhere
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
					    	field: 'Number',
					     	title: '序号',
					     	align:'center',
					     	formatter: function (value, row, index) {
				            	return index+1;
				         	}
						}, {
					     	field: 'traninbrchnum',
					     	title: '转入支行号',
					    }, {
					     	field: 'traninbrchname',
					     	title: '转入支行名称',
					    }, {
					     	field: 'tranoutbrchnum',
					     	title: '转出支行号',
					    },  {
					     	field: 'tranoutbrchname',
					     	title: '转出支行名称',
					    }, 
					    {
					     	field: 'pnttranoutamt',
					     	title: '时点转出金额(元)',
					    },
					    {
					    	field: 'tranoutbegindt',
					    	title: '转移起始日期',
					    },
					    {
					    	field: 'tranoutenddt',
					    	title: '转移结束日期',
					    },
					    {
					    	field: 'memo',
					    	title: '备注',
					    },
					    {
					    	field: 'addtrcrdpersonempno',
					    	title: '补录人员工号',
					    },
					    {
					    	field: 'addtrcrdtm',
					    	title: '补录时间',
					    },
					    {
					    	field: 'opetypecd',
					    	title: '操作类型',
					    },

				    ]
	  });
	}
};

var TableAddObj = {
    oTableInit: function () {
        var columns = [];
        //操作列是否展示
		columns = [            
             {
                field: 'traninbrchnum',
                title: '转入支行号',
                editable:{
                    type:'text',
                    title:'转入支行号',
                    placement:'right',
                    emptytext:'空',
                    validate: function (v) {
                    	if (v==null||v=='') return '转入支行号为必输项';
                        
                    }
                }
            }, {
                field: 'traninbrchname',
                title: '转入支行名称',
                editable:{
                    type:'text',
                    title:'转入支行名称',
                    placement:'right',
                    emptytext:'空',
                }
            }, {
                field: 'tranoutbrchnum',
                title: '转出支行号',
                editable:{
                    type:'text',
                    title:'转出支行号',
                    placement:'right',
                    emptytext:'空',
                    validate: function (v) {
                    	if (v==null||v=='') return '转出支行号为必输项';
                    }
                }
            },  {
                field: 'tranoutbrchname',
                title: '转出支行名称',
                editable:{
                    type:'text',
                    title:'转出支行名称',
                    placement:'right',
                    emptytext:'空',
                }
            },
            {
                field: 'pnttranoutamt',
                title: '时点转出金额(元)',
                editable:{
                    type:'text',
                    title:'时点转出金额(元)',
                    placement:'right',
                    emptytext:'空',
                    validate: function (v) {
                    	//if (v==null||v=='') return '必输项';
                        if (!checkFloat(v)) return '时点转出金额必须是数字';
                    }
                }
            },
            {
                field: 'tranoutbegindt',
                title: '转移起始日期',
                formatter:function(value,row,index){
//					var date = eval('new '+eval(value).source);
                    if(value!=null&&value!=''){
                        var date = new Date(value);
                        var res = date.Format("yyyy-MM-dd");
                        row.tranoutbegindt = res;
                        return res;
                    }
                },
                editable:{
                    type:'date',
                    title:'转移起始日期',
                    placement:'bottom',
                    emptytext:'空',
                    validate: function (v) {
                    	if (v==null||v=='') return '转移起始日期为必输项';
                    }
                }
            },
            {
                field: 'tranoutenddt',
                title: '转移结束日期',
                formatter:function(value,row,index){
//					var date = eval('new '+eval(value).source);
                    if(value!=null&&value!=''){
                        var date = new Date(value);
                        var res = date.Format("yyyy-MM-dd");
                        row.tranoutenddt = res;
                        return res;
                    }
                },
                editable:{
                    type:'date',
                    title:'转移结束日期',
                    placement:'bottom',
                    emptytext:'空',
                }
            },
            {
                field: 'memo',
                title: '备注',
                editable:{
                    type:'text',
                    title:'备注',
                    placement:'left',
                    emptytext:'空',
                }
            },
            {
                field: 'addtrcrdpersonempno',
                title: '补录人员工号',
                clickToSelect: false,
                formatter:function(value,row,index){				   
                    row.addtrcrdpersonempno = empNum;
                    return empNum;
                }

            },
            {
                field: 'addtrcrdtm',
                title: '补录时间',
                clickToSelect: false,
                formatter:function(value,row,index){
//					var date = eval('new '+eval(value).source);
                    //if(value!=null&&value!=''){
                        var date = new Date();
                        var res = date.Format("yyyy-MM-dd hh:mm:ss");
                        row.addtrcrdtm = res;
                        return res;
                    //}
                }

            },
            

        ]

		$("#tranFundstable").bootstrapTable({
		   // url: portal.bp() + '/user/pageList',
			method: 'post',      //请求方式（*）
			striped: true,      //是否显示行间隔色
			cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortStable: true,      //是否启用排序
			sortOrder: "desc",     //排序方式
			singleSelect: false,    //是否单选，true时没有全选按钮
			"queryParamsType": "limit",
			contentType: "application/x-www-form-urlencoded",
			queryParams: function (params) {
				return {
					/*'empNum': $('#empNum').val(),
					'empName': $('#empName').val(),
					'belongPostCd': $('#belongPostCd').val(),
					'belongOrgId': $('#belongOrgId').val(),
					'belongLine': $('#belongLine').val()*/
				};
			},
			resizable:true,			//是否可调整列宽度			
			columns: columns
		});

	}
};


var TableUpdateObj = {
		oTableInit: function () {
		//var columns = [];
        //操作列是否展示
		

		$("#tranFundstable").bootstrapTable({
		    url: portal.bp() + '/table/tableWhere/queryTranFundsDetail',
			method: 'get',      //请求方式（*）
			striped: true,      //是否显示行间隔色
			cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortStable: true,      //是否启用排序
			sortOrder: "desc",     //排序方式
			singleSelect: false,    //是否单选，true时没有全选按钮
			"queryParamsType": "limit",
			contentType: "application/x-www-form-urlencoded",
			queryParams: function (params) {
				return {
					'addrcrdid' : addrcrdid
					/*'empNum': $('#empNum').val(),
					'empName': $('#empName').val(),
					'belongPostCd': $('#belongPostCd').val(),
					'belongOrgId': $('#belongOrgId').val(),
					'belongLine': $('#belongLine').val()*/
				};
			},
			resizable:true,			//是否可调整列宽度
			responseHandler: function (res) { //服务端返回数据
				if (res.code == '200') {
					return res.data;
				} else {
					layer.msg(res.message, {icon: 2});
					return {};
				}
			},
			//columns: columns
			columns : [			            
			             {
			                field: 'traninbrchnum',
			                title: '转入支行号',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'转入支行号',
			                    placement:'right',
			                    //emptytext:traninbrchid,
			                }
			            }, {
			                field: 'traninbrchname',
			                title: '转入支行名称',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'转入支行名称',
			                    placement:'right',
			                    //emptytext:traninbrchname,
			                }
			            }, {
			                field: 'tranoutbrchnum',
			                title: '转出支行号',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'转出支行号',
			                    placement:'right',
			                    //emptytext:tranoutbrchid,
			                }
			            },  {
			                field: 'tranoutbrchname',
			                title: '转出支行名称',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'转出支行名称',
			                    placement:'right',
			                   // emptytext:tranoutbrchname,
			                }
			            },
			            {
			                field: 'pnttranoutamt',
			                title: '时点转出金额(元)',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'时点转出金额(元)',
			                    placement:'right',
			                   // emptytext:pnttranoutamt,
			                }
			            },
			            {
			                field: 'tranoutbegindt',
			                title: '转移起始日期',
			                clickToSelect: true,
			                formatter:function(value,row,index){
			                    if(value!=null&&value!=''){
			                        var date = new Date();
			                        var res = date.Format("yyyy-MM-dd");
			                        row.tranoutbegindt = res;
			                        return res;
			                    }
			                },
			                editable:{
			                    type:'date',
			                    title:'转移起始日期',
			                    placement:'bottom',
			                   // emptytext:tranoutenddt,
			                }
			            },
			            {
			                field: 'tranoutenddt',
			                title: '转移结束日期',
			                clickToSelect: true,
			                formatter:function(value,row,index){
//								var date = eval('new '+eval(value).source);
			                    if(value!=null&&value!=''){
			                        var date = new Date();
			                        var res = date.Format("yyyy-MM-dd");
			                        row.tranoutenddt = res;
			                        return res;
			                    }
			                },
			                editable:{
			                    type:'date',
			                    title:'转移结束日期',
			                    placement:'bottom',
			                    //emptytext:tranoutenddt,
			                }
			            },
			            {
			                field: 'memo',
			                title: '备注',
			                clickToSelect: true,
			                editable:{
			                    type:'text',
			                    title:'备注',
			                    placement:'left',
			                    //emptytext:memo,
			                }
			            },
			            {
			                field: 'addtrcrdpersonempno',
			                title: '补录人员工号',
			                clickToSelect: false,                
			            },
			            {
			                field: 'addtrcrdtm',
			                title: '补录时间',
			                clickToSelect: false,
			                formatter:function(value,row,index){
//								var date = eval('new '+eval(value).source);
			                    //if(value!=null&&value!=''){
			                        var date = new Date();
			                        var res = date.Format("yyyy-MM-dd hh:mm:ss");
			                        row.addtrcrdtm = res;
			                        return res;
			                    //}
			                }

			            },

			        ]
		});

	}

};


//查询
function query(){
	$('#querytable').bootstrapTable('destroy');
	$('#queryAlltable').bootstrapTable('destroy');
    $('#tranFundstable').bootstrapTable('destroy');
	TableObj.oTableInit();
	TableAllObj.oTableInit();
}
//重置
function resetForm(){
	$('#formSearch')[0].reset();
	$('input,textarea').placeholder(); //防止IE8没有placleholder
	$('#belongPostCd').selectpicker('refresh');
	$('#belongOrgId').selectpicker('refresh');
	$('#belongLine').selectpicker('refresh');
}

Date.prototype.Format = function(fmt){
    var o = {
        "M+":this.getMonth()+1,
        "d+":this.getDate(),
        "h+":this.getHours(),
        "m+":this.getMinutes(),
        "s+":this.getSeconds(),
        "q+":Math.floor((this.getMonth()+3)/3),
        "S":this.getMilliseconds()
    };
    if(/(y+)/i.test(fmt))
        fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    for(var k in o){
        if(new RegExp("("+k+")").test(fmt))
            fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));
    }
    return fmt;
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




