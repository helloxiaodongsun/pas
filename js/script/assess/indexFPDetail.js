$(function(){
	queryDemoType();
	$("#indexFPDetail_export").click(function(){
		window.open(portal.bp() + './json/assess/downloadAssessExcel.json?assPropNum='+currentAssPropNum+'&flag='+flag);
	});
});
var demoType = "";
var filedNameArray = ['assObjNum', 'assObjName'];
var resultSearchSuccess=undefined;

function queryDemoType(){
	 $.ajax({
        url : portal.bp() + './json/assess/queryDemoType.json?r='+Math.random(),
        type:'get',
        cache:false,
        dataType: "json",
        data:{'assPropNum':currentAssPropNum,'flag':flag},
        success : function(data) {
            if(data.code=='200'){
           	 demoType = data.data;
           	 indexFPDetailObj.TableFactory();
            }else{
                layer.msg(data.message, {icon: 2});
            }
        },
    });
}

var indexFPDetailObj = {
		TableFactory: function () {
			var columns = [];
			if(demoType==='1'){
				columns = [
							{
								field: 'assObjNum',
								title: '考核对象编号',
							}, {
								field: 'assObjName',
								title: '考核对象名称',
							}, {
								field: 'indexName',
								title: '指标名称'
							},
							{
								field: 'neguIndexVal',
								title: '必保指标值'
							},
							{
								field: 'whfIndexVal',
								title: '力争指标值'
							},
						];
			}else if(demoType==='2'){
				columns = [
							{
								field: 'assObjNum',
								title: '考核对象编号',
							}, {
								field: 'assObjName',
								title: '考核对象名称',
							}, {
								field: 'assIndexOrientName',
								title: '考核指标定位',
							}, {
								field: 'indexName',
								title: '指标名称'
							},
							{
								field: 'neguIndexVal',
								title: '必保指标值'
							},
							{
								field: 'neguIndexWei',
								title: '必保权重（%）'
							},
							{
								field: 'whfIndexVal',
								title: '力争指标值'
							},
							{
								field: 'whfIndexWei',
								title: '力争权重（%）'
							},
						];
			}else if(demoType==='4'){
				columns = [
							{
								field: 'assObjNum',
								title: '考核对象编号',
							}, {
								field: 'assObjName',
								title: '考核对象名称',
							}, {
								field: 'assIndexOrientName',
								title: '考核指标定位',
							}, {
								field: 'indexName',
								title: '指标名称'
							},
							{
								field: 'neguIndexVal',
								title: '必保指标值'
							},
							{
								field: 'neguIndexWeiZT',
								title: '整体业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiGS',
								title: '公司业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiLS',
								title: '零售业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiSC',
								title: '市场业务必保权重（%）'
							},
							{
								field: 'whfIndexVal',
								title: '力争指标值'
							},
							{
								field: 'whfIndexWeiZT',
								title: '整体业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiGS',
								title: '公司业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiLS',
								title: '零售业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiSC',
								title: '市场业务力争权重（%）'
							},
						];
			}else if(demoType==='3'){
				columns = [
							{
								field: 'assObjNum',
								title: '考核对象编号',
							}, {
								field: 'assObjName',
								title: '考核对象名称',
							}, {
								field: 'assIndexOrientName',
								title: '考核指标定位',
							}, {
								field: 'indexName',
								title: '指标名称'
							},
							{
								field: 'neguIndexVal',
								title: '必保指标值'
							},
							{
								field: 'neguIndexWei',
								title: '必保权重（%）'
							},
							{
								field: 'neguConvtRatio',
								title: '必保折算比例'
							},
							{
								field: 'whfIndexVal',
								title: '力争指标值'
							},
							{
								field: 'whfIndexWei',
								title: '力争权重（%）'
							},
							{
								field: 'whfConvtRatio',
								title: '力争折算比例'
							},
						];
			}else if(demoType==='5'){
				columns = [
							{
								field: 'assObjNum',
								title: '考核对象编号',
							}, {
								field: 'assObjName',
								title: '考核对象名称',
							}, {
								field: 'assIndexOrientName',
								title: '考核指标定位',
							}, {
								field: 'indexName',
								title: '指标名称'
							},
							{
								field: 'neguIndexVal',
								title: '必保指标值'
							},
							{
								field: 'neguIndexWeiZT',
								title: '整体业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiGS',
								title: '公司业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiLS',
								title: '零售业务必保权重（%）'
							},
							{
								field: 'neguIndexWeiSC',
								title: '市场业务必保权重（%）'
							},
							{
								field: 'neguConvtRatio',
								title: '必保折算比例'
							},
							{
								field: 'whfIndexVal',
								title: '力争指标值'
							},
							{
								field: 'whfIndexWeiZT',
								title: '整体业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiGS',
								title: '公司业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiLS',
								title: '零售业务力争权重（%）'
							},
							{
								field: 'whfIndexWeiSC',
								title: '市场业务力争权重（%）'
							},
							{
								field: 'whfConvtRatio',
								title: '力争折算比例'
							},
						];
			}
			
			$('#indexFPDetailtable').bootstrapTable('destroy').bootstrapTable({
				url: portal.bp() + './json/assess/queryindexFPDetail.json',
				method: 'get',      //请求方式（*）
				striped: true,      //是否显示行间隔色
				cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true,     //是否显示分页（*）
				singleSelect: false,    //是否单选，true时没有全选按钮
				"queryParamsType": "limit",
				contentType: "application/x-www-form-urlencoded",
				queryParams: function (params) {
					return {
						'pageSize': params.limit,
						'pageNum': (params.offset / params.limit) + 1,
						'assPropNum': currentAssPropNum,
						'flag': flag,
					};
				},
				sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
				pageNum: 1,      //初始化加载第一页，默认第一页
				pageSize: 20,      //每页的记录行数（*）
				pageList: [10, 20, 50],  //可供选择的每页的行数（*）
				clickToSelect: true,    //是否启用点击选中行
				resizable: true,			//是否可调整列宽度
				undefinedText:"",
				//height:350,
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
					mergeCell(res.rows, 'key', 1, '#indexFPDetailtable',resultSearchSuccess);
					$('#indexFPDetailtable').bootstrapTable('resetView',{
	                    height:getTableHeight(document)
	                });
					resizeTables();
				},
				//uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
				columns: columns
			});
		},


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
