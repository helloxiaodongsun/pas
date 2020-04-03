var lastQueryParams;
var title = title;
var currCd = currCd;
var dataDt = dataDt;
$(function () {
	TableObjPageSub.table1();
});
var TableObjPageSub = {
		
		table1: function () {
	        var columns = [
	              [	               
					{
						  field:'xuhao',
						  title:'序号',
						  rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 1,
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },{
						 field:'proj_name',
						 title:'项目',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 2,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'org_name',
						 title:'业务所属机构',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 3,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'emp_num',
						 title:'员工编号',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 4,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'emp_name',
						 title:'员工名称',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 5,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'rela_role',
						 title:'关联角色',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 6,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'rela_ratio',
						 title:'关联比例',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 7,
						 align: "center",
						 valign: "middle",
						 
					 },{
						 field:'cust_num',
						 title:'客户编号',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 8,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'cust_name',
						 title:'客户名称',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 9,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'l1_class_desc',
						 title:'产品大类',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 10,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'l2_class_desc',
						 title:'产品明细',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 11,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'subj_id',
						 title:'标准账号',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 12,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'subj_name',
						 title:'账户名称',
						 rowspan: 1,
		                  colspan: 1,
		                  rowNumber: 1,
		                  colNumber: 13,
						 align: "center",
						 valign: "middle",						 
					 },{
						 field:'comm_fee_incom',
						 title:'手续费收入',
						 rowspan: 1,
		                 colspan: 1,
		                 rowNumber: 1,
		                  colNumber: 14,
						 align: "center",
						 valign: "middle",						 
					 },
				]
	        ];
	        $('#detailModelTableOne').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/ZH001/query',
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
	            	 return createQueryParams(params, columns);
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 100,      //每页的记录行数（*）
	            pageList: [50,100],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	if($.isArray(res.data) && res.data.length==1 && res.data[0] == null){
	    					return [];
	    				}
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            onLoadSuccess: function (data) {
	            	//initBootStrapTablevalidateEdit($("#detailModelTableOne"));
	            	$("#detailModelTableOne").bootstrapTable("resetView");
	            	resizeTables();
	            },	                        
	            columns: columns,
	        });
	    }

}

function createQueryParams(params, columns) {
    var queryParams = {
        'pageSize': params.limit,
        'pageNum': (params.offset / params.limit) + 1,
        'logTableName':'ZH002_04',
        'logMenuId':mid,
    };

    queryParams.DW = DW;

    queryParams.selectStr = function () {    	
    	return selectStr;
    }
    queryParams.selectStr2 = function () {   	
    	return selectStr2;
    }
    queryParams.selectStr3 = function () {   	
    	return selectStr3;
    }
    queryParams.selectStr4 = function () {   	
    	return selectStr4;
    }
    //是否转换
    queryParams.matrixingTagStr = function () {
    	return matrixingTagStr;
    }
   
    //表名
    queryParams.tableStr1 = function () {
    	return tableStr1;
    }
    queryParams.tableStr2 = function () {
    	return tableStr2;
    }
    queryParams.tableStr3 = function () {
    	return tableStr3;
    }
    queryParams.tableStr4 = function () {
    	return tableStr4;
    }

    //排序
    queryParams.orderStr = function () {
    	return orderStr;
    }
    //where条件
    queryParams.whereStr1 = function () {
    	return whereStr1;
    }
	 queryParams.whereStr2 = function () {
		 return whereStr2;	
	 }
	 queryParams.whereStr3 = function () {
		 return whereStr3;
	 }
	 queryParams.whereStr4 = function () {
		 return whereStr4;
	 }


    lastQueryParams = deepCopy(queryParams);
    return queryParams;
}

function exportCurrentPageExcel(){
	var columns = $("#detailModelTableOne").bootstrapTable('getOptions').columns;
	var result = tableNeedCopyZh(columns,2,title,DW,currCd,dataDt);
	lastQueryParams.tableHead = JSON.stringify(result);	
	lastQueryParams.AllData=false;
	
	publicReportExcel(lastQueryParams,"exportExcelSubZhTable");
}
function exportAllDataExcel(){
	var columns = $("#detailModelTableOne").bootstrapTable('getOptions').columns;
	var result = tableNeedCopyZh(columns,2,title,DW,currCd,dataDt);
	lastQueryParams.tableHead = JSON.stringify(result);	
	lastQueryParams.AllData=true;
		
	publicReportExcel(lastQueryParams,"exportExcelSubZhTable");
}