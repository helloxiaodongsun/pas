var objType = '';
var assObjType = '';
var assPropType = '';
//考核对象类型对应机构
var obj_jg = ['01','02','03'];
//考核对象类型对应团队
var obj_td = ['04'];
$(function(){
	getObjType();
	if(obj_jg.indexOf(objType)>-1){
		//机构
		assObjType='03';
		TableObj_jg.oTableInitExist();
	}else if(obj_td.indexOf(objType)>-1){
		//团队
		assObjType='01';
		TableObj_td.oTableInitExist();
	}else{
		//员工
		assObjType='02';
		TableObj_yg.oTableInitExist();
	}
    
});
function query(){
	if(assObjType=='03'){
		//机构
		TableObj_jg.oTableInitExist();
	}else if(assObjType=='01'){
		//团队
		TableObj_td.oTableInitExist();
	}else{
		//员工
		TableObj_yg.oTableInitExist();
	}
}
function getObjType(){
	$.ajax({
        url: portal.bp() + './json/assess/getBasicInfoMgmt.json?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'assPropNum':assPropNum,'isValid':flag},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	objType = data.data.assObjTypeCd;
        	assPropType = data.data.assPropTypeCd;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
//分页查询机构列表	 
var TableObj_jg = {
    oTableInitExist: function () {
        var columns = [
                {
                    field: 'check',
                    checkbox: true
                },
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'orgNum',
                    title: '机构编号',
                }, {
                    field: 'orgName',
                    title: '机构名称',
                }, {
                    field: 'orgHirchyName',
                    title: '机构类型',
                }, {
                    field: 'superOrgName',
                    title: '上级机构',
                }, 
            ];
        $('#datatableExist').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/assess/show_exist_obj_list_jg.json',
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
                    'assPropNum': assPropNum,
                    'flag':flag,
                    //'postList': $('#postList').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 20,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            //height:300, //表格固定高度
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
				$('#datatableExist').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
				resizeTables();
			},
        });
    }
};
//分页查询员工列表	 
var TableObj_yg = {
    oTableInitExist: function () {
        var columns = [
                {
                    field: 'check',
                    checkbox: true
                },
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },  {
                    field: 'empNum',
                    title: '员工工号',
                }, {
                    field: 'empName',
                    title: '员工名称',
                }, {
                    field: 'belongPostDesc',
                    title: '所属岗位',
                }, {
                    field: 'belongOrgDesc',
                    title: '所属机构',
                },
                {
                    field: 'belongLineDesc',
                    title: '所属条线',
                },
            ];
        $('#datatableExist').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/assess/show_exist_obj_list_yg.json',
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
                    'assPropNum': assPropNum,
                    'flag':flag,
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 20,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            //height:300, //表格固定高度
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
				$('#datatableExist').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
				resizeTables();
			},
        });
    }
};
//添加团队详情
function teamDetailLink(value, row, index) {
    var pkId = row.pkId;
    var teamTypeCd = row.teamTypeCd;
    var teamId = row.teamId;
    var validTag = row.validTag;
    var operType = row.operType;
    var teamName = row.teamName;
    
    var htmltext = '<a id="toTeamDetail class="oper-left"  onclick="teamDetailaClick(' + '\'' + pkId + '\',\'' + teamTypeCd + '\',\'' + teamId + '\',\'' + validTag + '\',\'' + operType + '\',\'' + teamName + '\')"><b>'+row.teamName+'</b></a>'

    return htmltext;

}
function teamDetailaClick(pkId, teamTypeCd, teamId, validTag, operType,teamName) {
	layer.open({
        type:2,
        title:teamName+'团队成员',
        shadeClose:true,
        shade:0.8,
        area:['700px','520px'],
        content:portal.bp() + '/teamDetail.html?pkId='+pkId+'&teamTypeCd='+teamTypeCd
        						+'&teamId='+teamId+'&validTag='+validTag+'&operType='+operType
    });
};
//分页查询团队列表	 
var TableObj_td = {
    oTableInitExist: function () {
        var columns = [
                {
                    field: 'check',
                    checkbox: true
                },
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'teamId',
                    title: '团队编号',
                }, {
                    field: 'teamName',
                    title: '团队名称',
                    clickToSelect: false,
                    formatter: teamDetailLink
                }, {
                    field: 'effDt',
                    title: '生效日期',
                }, {
                    field: 'invalidDt',
                    title: '失效日期'

                },
                {
                    field: 'teamType',
                    title: '团队类型',
                },
                {
                    field: 'teamChar',
                    title: '团队性质',
                },
                {
                    field: 'belongLineDesc',
                    title: '所属条线',
                }
                ,
                {
                    field: 'belongOrgName',
                    title: '所属机构',
                }
            ];
        $('#datatableExist').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/assess/show_exist_obj_list_td.json',
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
                    'assPropNum': assPropNum,
                    'flag':flag,
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 20,      //每页的记录行数（*）
            pageList: [10, 20, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            //height:300, //表格固定高度
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
				$('#datatableExist').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
				resizeTables();
			},
        });
    },
};
