var filedNameArray = ['assObjNum', 'assObjName'];

$(function () {
    var step1 = new SetStep({
        content: '.stepCont1',
        textMaxWidth: 120,
        steps: ['方案基本信息', '选择考核对象', '占比分配'],
        stepCounts: 3,
        curStep: 3,
    });
    findProfessionType();
    $("#btn_GS").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("GS");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    	}
    	
    	
    });
    $("#btn_LS").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("LS");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    	}
    	
    	
    });
    $("#btn_SC").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("SC");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    	}
    	
    });
    
    $("#tab1").click(function(){
    	TableObj.importSuccessTableFactory();
    });
    $("#tab2").click(function(){
    	TableObj.importFailedTableFactory();
    });
    $('#successTable_refresh').click(function () {
		TableObj.importSuccessTableFactory();
	});

	$('#errorTable_refresh').click(function () {
		TableObj.importFailedTableFactory();
	});
	
	TableObj.importSuccessTableFactory();
	TableObj.importFailedTableFactory();

});
function findProfessionType(){
	$.ajax({
        url: portal.bp() + '/assess/profession/findProfessionType_ZH_T?r=' + Math.random(),
        type: 'post',
        cache: false,
        async:false,
        dataType: "json",
        data: {
        	'assPropNum': assPropNum
        },
        success: function (data) {
            if (data.code == '200') {
            	$.each(data.data,function(index,item){
            		if(item.PROFESSION_TYPE=='GS'){
            			$("#btn_GS").removeClass("btn-default");
            			$("#btn_GS").addClass("btn-info");
            		}else if(item.PROFESSION_TYPE=='LS'){
            			$("#btn_LS").removeClass("btn-default");
            			$("#btn_LS").addClass("btn-info");
            		}else if(item.PROFESSION_TYPE=='SC'){
            			$("#btn_SC").removeClass("btn-default");
            			$("#btn_SC").addClass("btn-info");
            		}
            	})
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
/**
 * 校验所有考核对象是否存在考核类别下
 * @param professionType
 */
function checkObjAndProfessionType(professionType){
	var res = null;
	$.ajax({
        url: portal.bp() + '/assess/profession/checkObjAndProfessionType?r=' + Math.random(),
        type: 'post',
        cache: false,
        async:false,
        dataType: "json",
        data: {
        	'professionType':professionType,
        	'assPropNum': assPropNum
        },
        success: function (data) {
            if (data.code == '200') {
            	res = data.data;
            } else {
            	res = "000000";
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
	return res;
}
function prev() {
    window.location.href = portal.bp() + "/assess/edit_2?assPropNum=" + assPropNum + "&operateType=" + operateType;
}

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
	var professionType = '';
	if($("#btn_GS").hasClass("btn-info")){
		professionType += ',GS';
	}
	if($("#btn_LS").hasClass("btn-info")){
		professionType += ',LS';
	}
	if($("#btn_SC").hasClass("btn-info")){
		professionType += ',SC';
	}
	if(professionType==''){
		layer.msg("请选择考核类别",{icon:3});
		return;
	}
	professionType = professionType.substr(1);
	$("#formSearch").ajaxSubmit({
		url: portal.bp() + '/assess/importExcel_ZH_T',
		async: true,
		type: 'post',
		contentType: false,
		processData: false,
		dataType: 'json',
		data: {
			'assPropNum': assPropNum,
			'professionType':professionType
		},
		success: function (data) {
			if (data.code == "200") {
				var res = data.data;
				var resStr = '成功' + res.success + '条,' + '失败' + res.failed + '条'
				layer.msg(resStr, {
					icon: 1
				});
				TableObj.importSuccessTableFactory();
				TableObj.importFailedTableFactory();
			} else {
				layer.msg(data.message, {
					icon: 2
				});
			}
		},
		// beforeSend: function (XMLHttpRequest) {
		// 	layer.load(1);
		// },
		// complete: function (XMLHttpRequest) {
		// 	layer.closeAll('loading');
		// }
	});
}

//创建表格
var TableObj = {
	importSuccessTableFactory: function () {
		var columns = [
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
		
		$('#importSuccessTable').bootstrapTable('destroy').bootstrapTable({
			url: portal.bp() + '/assess/importBatchSuccess',
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
				$('#importSuccessTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
				mergeCell(res.rows, 'key', 1, '#importSuccessTable',resultSearchSuccess);
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
	},
	importFailedTableFactory: function () {
		var columns = [
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
						{
							field: 'failDesc',
							title: '失败原因'
						},
					];

		$('#importFailedTable').bootstrapTable('destroy').bootstrapTable({
			url: portal.bp() + '/assess/importBatchFailed',
			method: 'get',      //请求方式（*）
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
					'assPropNum': assPropNum,
				};
			},
			sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
			pageNum: 1,      //初始化加载第一页，默认第一页
			pageSize: 20,      //每页的记录行数（*）
			pageList: [10, 20, 50],  //可供选择的每页的行数（*）
			clickToSelect: true,    //是否启用点击选中行
			resizable: true,			//是否可调整列宽度
			undefinedText:"",
			//height:500,
			responseHandler: function (res) { //服务端返回数据
				if (res.code == '200') {

					resultSearchFailed = res.data.sameArray;
					
					$("#errorTable_export").removeAttr("disabled");
					basicInfoId = res.data.pageFinder.rows.length>0?res.data.pageFinder.rows[0].basicInfoId:$("#errorTable_export").attr("disabled","disabled");
					return res.data.pageFinder;
				} else {
					layer.msg(res.message, {icon: 2});
					return ;
				}
			},
			onLoadSuccess: function (data) {
				$('#importFailedTable').bootstrapTable('resetView',{
					height:getTableHeight(document)-200
                });
				mergeCell(data.rows, 'key', 1, '#importFailedTable',resultSearchFailed);
				resizeTables();
			},
			//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
			columns: columns
		});
	},


};

//提交审核
function successTable_save(){
	$.ajax({
        url : portal.bp() + '/assess/assessTodo?r='+Math.random(),
        type:'post',
        cache:false,
        dataType: "json",
        data:{'assPropNums':[assPropNum]},
        success : function(data) {
            if(data.code=='200'){
            	layer.msg('提交成功',{icon:1});
            	if(operateType=='2'){
            		//修改
            		window.location.href=portal.bp()+ "/assess/index?mid=2100";
            	}else{
            		window.location.href=portal.bp()+ "/assess/edit_1?operateType=1";
            	}
            }else{
                layer.msg(data.message, {icon: 2});
            }
        },
    });
}
//导出excel
function exportfnc() {
	var professionType = '';
	if($("#btn_GS").hasClass("btn-info")){
		professionType += ',GS';
	}
	if($("#btn_LS").hasClass("btn-info")){
		professionType += ',LS';
	}
	if($("#btn_SC").hasClass("btn-info")){
		professionType += ',SC';
	}
	if(professionType==''){
		layer.msg("请选择考核类别",{icon:3});
		return;
	}
	professionType = professionType.substr(1);
	window.open(portal.bp() + '/assess/downloadAssessExcel_ZH_T?assPropNum='+assPropNum+'&professionType='+professionType)
}
//导出 导入失败的excel
function errorTable_export() { 
	window.open(portal.bp() + '/assess/downloadAssessExcel_ZH_T_error?assPropNum='+assPropNum+'&basicInfoId='+basicInfoId)
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