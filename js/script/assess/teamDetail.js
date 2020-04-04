$(function(){
	TableObj_td.teamMemberTableFactory();
});
var TableObj_td = {
	    teamMemberTableFactory: function () {
	        //操作列是否展示
	        var columns;
	        if('01' == teamTypeCd){
	            columns = [
	                {
	                    field: 'Number',
	                    title: '序号',
	                    align: 'center',
	                    formatter: function (value, row, index) {
	                        return index + 1;
	                    }
	                }, {
	                    field: 'MEMBERID',
	                    title: '成员编号',
	                }, {
	                    field: 'MEMBERNAME',
	                    title: '成员名称',
	                }, {
	                    field: 'MEMBEROFORG',
	                    title: '所属机构',
	                }, {
	                    field: 'MEMBEROFCAPTAIN',
	                    title: '是否队长',
	                    formatter: function (value, row, index) {
	                        if (row.MEMBEROFCAPTAIN == '1') {
	                            return '是';
	                        }
	                        return '否';
	                    }
	                }

	            ]
	        }else{

	            columns = [
	                {
	                    field: 'Number',
	                    title: '序号',
	                    align: 'center',
	                    formatter: function (value, row, index) {
	                        return index + 1;
	                    }
	                }, {
	                    field: 'MEMBERID',
	                    title: '成员编号',
	                }, {
	                    field: 'MEMBERNAME',
	                    title: '成员名称',
	                }, {
	                    field: 'MEMBEROFORG',
	                    title: '上级机构',
	                }, {
	                    field: 'MEMBEROFCAPTAIN',
	                    title: '是否队长',
	                    formatter: function (value, row, index) {
	                        if (row.MEMBEROFCAPTAIN == '1') {
	                            return '是';
	                        }
	                        return '否';
	                    }
	                }

	            ]

	        }
	        //团队成员表格
	        $('#teamMemberTable').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + './json/team/queryTeamMemberByPage/json',
	            method: 'post',      //请求方式（*）
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
	                    'teamId': teamId,
	                    'teamTypeCd': teamTypeCd,
	                    'pkId': pkId,
	                    'validTag': validTag,
	                    'operType': operType
	                };
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            pageNum: 1,      //初始化加载第一页，默认第一页
	            pageSize: 10,      //每页的记录行数（*）
	            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable: true,			//是否可调整列宽度
	            //height:500, //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
	            columns: columns,
	            onLoadSuccess: function (res) {
					$('#teamMemberTable').bootstrapTable('resetView',{
	                    height:getTableHeight(document)
	                });
					resizeTables();
				},
	        });
	    },
	};
