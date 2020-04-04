var columns;
var filedNameArray = ['assObjNum', 'assObjName'];
$(function(){
	columns = [
		{
			field: 'assObjNum',
			title: '考核对象编号',
		}, {
			field: 'assObjName',
			title: '考核对象名称',
		}, {
			field:'professionType',
			title:'类别',
	    	formatter: function (value, row, index) {
	    		return $.param.getDisplay('PROFESSION_TYPE', value);
	        }
		},
		{
			field: 'indexWeiZTStr',
			title: '占整体得分权重(%)'
		},
	];
	
	table_query();
	
});

 function table_query() {
	 $('#datatable').bootstrapTable('destroy').bootstrapTable({
			url: portal.bp() + './json/assess/queryZHDFDetail.json',
			method: 'get',      //请求方式（*）
			striped: false,      //是否显示行间隔色
			cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,     //是否显示分页（*）
			singleSelect: false,    //是否单选，true时没有全选按钮
			"queryParamsType": "limit",
         height:500,
			contentType: "application/x-www-form-urlencoded",
			queryParams: function (params) {
				return {
					'pageSize': params.limit,
					'pageNum': (params.offset / params.limit) + 1,
					'assPropNum': assPropNum,
					'flag':isValidFlag,
					'basicInfoId':basicInfoId,
				};
			},
			sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			pageNum: 1,      //初始化加载第一页，默认第一页
			pageSize: 20,      //每页的记录行数（*）
			pageList: [10, 20, 50],  //可供选择的每页的行数（*）
			clickToSelect: true,    //是否启用点击选中行
			resizable: true,			//是否可调整列宽度
			undefinedText:"",
			responseHandler: function (res) { //服务端返回数据
				if (res.code == '200') {

					resultSearchSuccess = res.data.sameArray;
					return res.data.pageFinder;
				} else {
					layer.msg(res.message, {icon: 2});
					return ;
				}
			},
			onLoadSuccess: function (res) {
				$('#datatable').bootstrapTable('resetView',{
                 height:getTableHeight(document)
             });
				mergeCell(res.rows, 'key', 1, '#datatable',resultSearchSuccess);
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
 }

 function mergeCell(data, fieldName, colspan, target,numArr) {

		if (data.length == 0) {
			return;
		}

		if (data.length == 1 || numArr == undefined) {
			//$(target).bootstrapTable('updateCell', {index: 0, field: 'Number', value: 1});
			return;
		}



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