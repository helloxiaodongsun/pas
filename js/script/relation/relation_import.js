var filedNameArray = ['key', 'acctId', 'bizType', 'custName', 'custId', 'cerNum', 'orgName', 'check', 'number', 'cerTypeDesc', 'importRstDesc'];
var resultSearchSuccess=undefined;
var resultSearchFailed=undefined;
$(function () {
	$('#errorTable_export').click(function () {
		window.open(portal.bp() + '/relation/exportExcel?oprType=1')
	});

	$('#successTable_refresh').click(function () {
		TableObj.importSuccessTableFactory();
	});

	$('#errorTable_refresh').click(function () {
		TableObj.importFailedTableFactory();
	});
	//提交审核
	$('#successTable_save').click(function () {
		var checklist = $('#importSuccessTable').bootstrapTable('getSelections');
		if (checklist.length == 0) {
			layer.msg("至少选择一条记录", {icon: 3});
		} else {

			var array = new Array();
			var arrayTmp = new Array();
			var object = new Object();
			for(var i=0;i<checklist.length;i++){
				var acctId= checklist[i]['acctId'];
				var bizTypeCd = checklist[i]['bizTypeCd'];
				var key = acctId + '::' + bizTypeCd;
				if(arrayTmp.indexOf(key)<0){
					arrayTmp.push(key);
					checklist[i]['oprType'] = '1';
					array.push(checklist[i]);
				}


			}
			object['acctData']=array;


			var index;
			$.ajax({
				url: portal.bp() + './json/ok.json',
				type: 'post',
				cache: false,
				contentType: "application/json;charset=UTF-8",
				dataType: "json",
				data: JSON.stringify(object),
				success: function (data) {
					if (data.code == '200') {
						layer.msg("提交审批成功", {icon: 1});
						TableObj.importSuccessTableFactory();
					} else {
						layer.msg(data.message, {icon: 2});
					}
				},
				beforeSend: function (XMLHttpRequest) {
					index = layerLoad();
				},
				complete: function (XMLHttpRequest) {
					layerClose(index);
				}
			});
		}
	});

	TableObj.importFailedTableFactory();
	TableObj.importSuccessTableFactory();
	TableObj.importDescTableFactory();
});

function importfuc() {
	var ua = window.navigator.userAgent;
	if(ua.indexOf("MSIE")>=1){
		//IE浏览器
		var fileName = $("#uploadExcel").val();
		if(fileName==undefined||fileName==null||fileName==''){
			layer.msg('请选择文件',{icon:3});
			return;
		}
		var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
		if(fileType!='.xls'&&fileType!='.xlsx'){
			layer.msg('文件格式必须为xls或xlsx',{icon:3});
			return;
		}
	}else{
		var file = $("#uploadExcel")[0].files;
		var filemaxsize = 50*1024*1024; //50M
		if(file.length==0){
			layer.msg('请选择文件',{icon:3});
			return;
		}
		var fileName = file[0].name;
		var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
		if(fileType!='.xls'&&fileType!='.xlsx'){
			layer.msg('文件格式必须为xls或xlsx',{icon:3});
			return;
		}
		if(file[0].size>filemaxsize){
			layer.msg('文件过大，必须小于50MB',{icon:2});
			return;
		}
	}

	$("#formSearch").ajaxSubmit({
		url: portal.bp() + '/relation/importExcel',
		async: true,
		type: 'post',
		contentType: false,
		processData: false,
		dataType: 'json',
		data: {
			'oprType': '1'
		},
		success: function (data) {
			if (data.code == "200") {
				var res = data.data;
				var resStr = '成功' + res.success + '条,' + '失败' + res.failed + '条'
				layer.msg(resStr, {
					icon: 1
				});
			} else {
				layer.msg(data.message, {
					icon: 2
				});
			}
		},
		beforeSend: function (XMLHttpRequest) {
			layer.load(1);
		},
		complete: function (XMLHttpRequest) {
			layer.closeAll('loading');
		}
	});
}

function exportfnc() {
	window.open(portal.bp() + '/relation/downloadDemoExcel')
}

//创建表格
var TableObj = {
	importSuccessTableFactory: function () {
		var columns = [
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'number',
				title: '序号',
				align: 'center'/*,
				formatter: function (value, row, index) {
					return index + 1;
				}*/
			}, {
				field: 'acctId',
				title: '账号编号',
			}, {
				field: 'bizType',
				title: '业务类型',
			}, {
				field: 'custName',
				title: '客户名称',
			}, {
				field: 'custId',
				title: '客户编号'

			},
			{
				field: 'cerNum',
				title: '客户证件号'

			},
			{
				field: 'cerTypeDesc',
				title: '证件类型'

			},
			{
				field: 'orgName',
				title: '所属机构',
			},
			{
				field: 'relaRoleDesc',
				title: '关联角色类型',
			},
			{
				field: 'empId',
				title: '员工ID',
			},
			{
				field: 'empName',
				title: '员工姓名',
			},
			{
				field: 'relaRatio',
				title: '关联比例(%)',
			}
		];

		$('#importSuccessTable').bootstrapTable('destroy').bootstrapTable({
			url: portal.bp() + '/relation/importBatchSuccess',
			method: 'post',      //请求方式（*）
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
					'searchFlag': '1',
					'oprType': '1'
				};
			},
			sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			pageNum: 1,      //初始化加载第一页，默认第一页
			pageSize: 20,      //每页的记录行数（*）
			pageList: [10, 20, 50],  //可供选择的每页的行数（*）
			clickToSelect: true,    //是否启用点击选中行
			resizable: true,			//是否可调整列宽度
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
				mergeCell(res.rows, 'key', 1, '#importSuccessTable',resultSearchSuccess);
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
	},
	importFailedTableFactory: function () {
		var columns = [
			/*{
                field: 'check',
                checkbox: true
            },*/
			{
				field: 'number',
				title: '序号',
				align: 'center'/*,
				formatter: function (value, row, index) {
					return index + 1;
				}*/
			}, {
				field: 'acctId',
				title: '账号编号',
			}, {
				field: 'bizType',
				title: '业务类型',
			},/*, {
				field: 'custName',
				title: '客户名称',
			}, {
				field: 'custId',
				title: '客户编号'

			},
			{
				field: 'cerNum',
				title: '客户证件号'

			},
			{
				field: 'cerTypeDesc',
				title: '证件类型'

			},
			{
				field: 'orgName',
				title: '所属机构',
			},*/
			{
				field: 'importRstDesc',
				title: '失败原因',
			},
			{
				field: 'relaRoleDesc',
				title: '关联角色类型',
			},
			{
				field: 'empId',
				title: '员工ID',
			}/*,
			{
				field: 'empName',
				title: '员工姓名',
			}*/,
			{
				field: 'relaRatio',
				title: '关联比例(%)',
			}
		];

		$('#importFailedTable').bootstrapTable('destroy').bootstrapTable({
			url: portal.bp() + '/relation/importBatchFailed',
			method: 'post',      //请求方式（*）
			striped: false,      //是否显示行间隔色
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
					'searchFlag': '0',
					'oprType': '1'
				};
			},
			sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			pageNum: 1,      //初始化加载第一页，默认第一页
			pageSize: 20,      //每页的记录行数（*）
			pageList: [10, 20, 50],  //可供选择的每页的行数（*）
			clickToSelect: true,    //是否启用点击选中行
			resizable: true,			//是否可调整列宽度
			height:500,
			responseHandler: function (res) { //服务端返回数据
				if (res.code == '200') {

					resultSearchFailed = res.data.sameArray;
					return res.data.pageFinder;
				} else {
					layer.msg(res.message, {icon: 2});
					return ;
				}
			},
			onLoadSuccess: function (data) {
				mergeCell(data.rows, 'key', 1, '#importFailedTable',resultSearchFailed);
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
	},
	importDescTableFactory: function () {
		var columns = [
			/*{
                field: 'check',
                checkbox: true
            },*/
			/*{
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },*/ {
				field: 'acctId',
				title: '账号编号',
			}, {
				field: 'bizType',
				title: '业务类型',
			}, /*{
				field: 'custName',
				title: '客户名称',
			}, {
				field: 'custId',
				title: '客户编号'

			},
			{
				field: 'cerNum',
				title: '客户证件号'

			},
			{
				field: 'cerTypeDesc',
				title: '证件类型'

			},
			{
				field: 'orgName',
				title: '所属机构',
			},*/
			{
				field: 'relaRoleDesc',
				title: '关联角色类型',
			},
			{
				field: 'empId',
				title: '员工ID',
			},
			/*{
				field: 'empName',
				title: '员工姓名',
			},*/
			{
				field: 'relaRatio',
				title: '关联比例(%)',
			},
			{
				field: 'effDt',
				title: '生效日期',
			}
		];
		var dataExample = [{'acctId': '000001', 'bizType': '公司存款', 'custName': '测试用户', 'custId': '000001',
			'cerNum':'000001','cerTypeDesc':'身份证','orgName':'支行','relaRoleDesc':'营销人','empId':'000001',
			'empName':'测试姓名','relaRatio':'100','effDt':'2019/06/01'}];
		$('#importDescTable').bootstrapTable('destroy').bootstrapTable({
			data: dataExample,
			method: 'post',      //请求方式（*）
			striped: false,      //是否显示行间隔色
			cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: false,     //是否显示分页（*）
			sortStable: true,      //是否启用排序
			sortOrder: "desc",     //排序方式
			singleSelect: false,    //是否单选，true时没有全选按钮
			"queryParamsType": "limit",
			contentType: "application/x-www-form-urlencoded",
			/*queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'searchFlag': '0',
                    'oprType' : '1'
                };
            },*/
			sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			pageNum: 1,      //初始化加载第一页，默认第一页
			pageSize: 10,      //每页的记录行数（*）
			pageList: [5, 10, 25],  //可供选择的每页的行数（*）
			clickToSelect: true,    //是否启用点击选中行
			resizable: true,			//是否可调整列宽度
			responseHandler: function (res) { //服务端返回数据
				if (res.code == '200') {
					return res.data;
				} else {
					layer.msg(res.message, {icon: 2});
					return {};
				}
			},
			onLoadSuccess: function (data) {
				//mergeCell(data.rows, 'key', 1, '#importFailedTable');
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
	}


};

//导出
function errorTable_export() {

	$.ajax({
		url: portal.bp() + '/relation/exportExcel',
		type: 'get',
		async: false,
		cache: false,
		data: {
			'oprType': '1'
		},
		success: function (data) {

			if (data.code != 200) {
				layer.msg(data.message, {icon: 2});
			}
			user = data.data;
		}


	});
};


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

//文件上传
$(document).on('ready',function () {
	$('#uploadExcel').fileinput({
		language:'zh',
		showUpload:false,
		showPreview:false,
		dropZoneEnable:false,
		showRemove:true,
		browseLabel:'浏览...',
		removeLabel:'移除',
	});
});
