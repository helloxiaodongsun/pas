$(function () {
	showApproveModal.oTableInit();
});
//审批历史列表
var showApproveModal = {
	    oTableInit: function () {
	        var columns = [];
	            columns = [
		            {
		                field: 'Number',
		                title: '序号',
		                align: 'center',
		                formatter: function (value, row, index) {
		                    return index + 1;
		                }
		            },
	                {
	                	field: 'arriveNodeTheCheckStatus',
	                	title: '状态',
	                },
	                {
		                field: 'dealComntDesc',
		                title: '备注',
		            },
	                {
	                	field: 'taskProcerId',
	                	title: '处理人',
	                },
	                {
	                	field: 'dealTm',
	                	title: '处理时间',
	                	formatter:function(value,row,index){
	                		return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
	                	}
	                },
	                
	            ];
	        $('#datatable').bootstrapTable("destroy");
	        $('#datatable').bootstrapTable({
	            url: portal.bp() + '/workflow/history/data',
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
	                	'pkId':pkId,
	                    'pageSize': params.limit,
	                    'pageNum': (params.offset / params.limit) + 1,
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 10,      //每页的记录行数（*）
	            pageList: [5, 10],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
	            columns: columns
	        });
	    }
	};