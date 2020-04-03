var objType = '';
var assObjType = '';
var assPropType = '';
var iszhdf = '';
//考核对象类型对应机构
var obj_jg = ['01','02','03'];
//考核对象类型对应团队
var obj_td = ['04'];
$(function(){
	getObjType();
	if(iszhdf=='1'){
		var step1=new SetStep({
			content:'.stepCont1',
			textMaxWidth:120,
			steps:['方案基本信息','选择考核对象','占比分配'],
			stepCounts:3,
			curStep:2,
		});
	}else{
		var step1=new SetStep({
			content:'.stepCont1',
			textMaxWidth:120,
			steps:['方案基本信息','选择考核对象','选择考核指标','指标分配'],
			stepCounts:4,
			curStep:2,
		});
	}
	initBelongOrgId();
	initPostList();
	//获取团队性质
    $("#teamCharCd").html("").append($.param.getSelectOptionOrder("TEAM_CHAR"));
    $('#teamCharCd').selectpicker('refresh');
    if(assPropType=='01'){
    	//规范性考核团队，团队性质默认选择为规范性考核团队且不可修改
    	$("#teamCharCd").selectpicker('val','01').trigger("change").prop('disabled',true).selectpicker('refresh');
    }
	if(obj_jg.indexOf(objType)>-1){
		//机构
		assObjType='03';
		$("#assObjIdLabel").text("机构编号:");
		$("#assObjId").attr("placeholder","机构编号");
		$("#assObjNameLabel").text("机构名称:");
		$("#assObjName").attr("placeholder","机构名称");
		$(".postListDIV").hide();
		$(".teamCharCdDIV").hide();
		TableObj_jg.oTableInit();
		TableObj_jg.oTableInitExist();
	}else if(obj_td.indexOf(objType)>-1){
		//团队
		assObjType='01';
		$("#assObjIdLabel").text("团队编号:");
		$("#assObjId").attr("placeholder","团队编号");
		$("#assObjNameLabel").text("团队名称:");
		$("#assObjName").attr("placeholder","团队名称");
		$(".postListDIV").hide();
		$(".teamCharCdDIV").show();
		TableObj_td.oTableInit();
		TableObj_td.oTableInitExist();
	}else{
		//员工
		assObjType='02';
		$("#assObjIdLabel").text("员工工号:");
		$("#assObjId").attr("placeholder","员工工号");
		$("#assObjNameLabel").text("员工姓名:");
		$("#assObjName").attr("placeholder","员工姓名");
		$(".postListDIV").show();
		$(".teamCharCdDIV").hide();
		TableObj_yg.oTableInit();
		TableObj_yg.oTableInitExist();
	}
	
    
    
    $("#btn_add").click(function(){
    	var checklist = $('#datatable').bootstrapTable("getSelections");
    	if(checklist==null||checklist.length==0){
    		layer.msg('请选择',{icon:3});
    		return;
    	}
    	var flag = false;
    	var data = {'assPropNum':assPropNum,'assObjType':assObjType};
    	var assObjNums = [];
    	if(assObjType=='03'){
    		//机构
    		$.each(checklist,function(index,item){
    			if(item.assPropNum!=undefined&&item.assPropNum!=null){
    				var msg = item.orgName+'已被'+item.assEmpNum+'添加到'+item.assPropName+'考核方案中';
    				layer.msg(msg,{icon:3});
    				flag = true;
    				return false;
    			}
    			assObjNums.push(item.orgId);
    		});
    	}else if(assObjType=='01'){
    		//团队
    		$.each(checklist,function(index,item){
    			if(item.assPropNum!=undefined&&item.assPropNum!=null){
    				var msg = item.teamName+'已被'+item.assEmpNum+'添加到'+item.assPropName+'考核方案中';
    				layer.msg(msg,{icon:3});
    				flag = true;
    				return false;
    			}
    			assObjNums.push(item.teamId);
    		});
    	}else{
    		//员工
    		$.each(checklist,function(index,item){
    			if(item.assPropNum!=undefined&&item.assPropNum!=null){
    				var msg = item.empName+'已被'+item.assEmpNum+'添加到'+item.assPropName+'考核方案中';
    				layer.msg(msg,{icon:3});
    				flag = true;
    				return false;
    			}
    			assObjNums.push(item.empNum);
    		});
    	}
    	data.assObjNum = assObjNums;
    	if(flag){
    		return;
    	}
    	
    	$.ajax({
            url: portal.bp() + '/assess/add_obj_index_rel?r='+Math.random(),
            type: 'post',
            async: false,
            data:data,
            dataType: "json"
        }).done(function (data) {
            if (data.code == '200') {
            	query();
            }else{
            	layer.msg(data.message,{icon:2});
            }
        });
    });
    
    $("#btn_del").click(function(){
    	var checklist = $('#datatableExist').bootstrapTable("getSelections");
    	if(checklist==null||checklist.length==0){
    		layer.msg('请选择',{icon:3});
    		return;
    	}
    	var data = {'assPropNum':assPropNum,'assObjType':assObjType};
    	var assObjNums = [];
    	if(assObjType=='03'){
    		//机构
    		$.each(checklist,function(index,item){
    			assObjNums.push(item.orgId);
    		});
    	}else if(assObjType=='01'){
    		//团队
    		$.each(checklist,function(index,item){
    			assObjNums.push(item.teamId);
    		});
    	}else{
    		//员工
    		$.each(checklist,function(index,item){
    			assObjNums.push(item.empNum);
    		});
    	}
    	data.assObjNum = assObjNums;
    	
    	$.ajax({
            url: portal.bp() + '/assess/del_obj_index_rel?r='+Math.random(),
            type: 'post',
            async: false,
            data:data,
            dataType: "json"
        }).done(function (data) {
            if (data.code == '200') {
            	query();
            }else{
            	layer.msg(data.message,{icon:2});
            }
        });
    });
});
function next(){
	var len = $('#datatableExist').bootstrapTable("getData").length;
	if(len==0){
		layer.msg("至少选择一项考核对象",{icon:3});
		return;
	}
	window.location.href=portal.bp()+"/assess/edit_3?assPropNum="+assPropNum+"&operateType="+operateType;
}
function prev(){
	window.location.href=portal.bp()+"/assess/edit_1?assPropNum="+assPropNum+"&operateType="+operateType;
}
function query(){
	if(assObjType=='03'){
		//机构
		TableObj_jg.oTableInit();
		TableObj_jg.oTableInitExist();
	}else if(assObjType=='01'){
		//团队
		TableObj_td.oTableInit();
		TableObj_td.oTableInitExist();
	}else{
		//员工
		TableObj_yg.oTableInit();
		TableObj_yg.oTableInitExist();
	}
}
//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('#belongOrg').selectpicker('refresh');
    $('#postList').selectpicker('refresh');
    $('#teamCharCd').selectpicker('refresh');
}
/**
 * 初始化机构列表
 */
function initBelongOrgId(){
	var html = "";
	$.ajax({
        url: portal.bp() + '/assess/objorg?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'assPropNum':assPropNum},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var html;
            var list = data.data;
            $.each(list,function(key,value){
                html += '<optgroup label="'+key+'">';
                $.each(value,function(index,item){
                	if(objType=='01'){
                		//分行
                		if(item.orgHirchy=='LV2'){
                			html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                		}
                	}else if(objType=='02'){
                		//管辖行
                		if(item.orgHirchy=='LV4'){
                			html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                		}
                	}else if(objType=='03'){
                		//支行
                		if(item.orgHirchy=='LV5'){
                			html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                		}
                	}else{
                		//团队和员工
                		if(item.orgHirchy!='LV2'){
                			html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                		}
                	}
                })
                html += '</optgroup>';
            })
            $('#belongOrg').html(html);
            $('#belongOrg').selectpicker('refresh');
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function initPostList(){
	var html = "";
	$.ajax({
        url: portal.bp() + '/assess/assess_post_list?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'assPropType':assPropType,'assObjType':objType},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var posts = data.data.postList;
        	$.each(posts,function(index,item){
        		html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
        	});
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
	$("#postList").html("").append(html);
    $('#postList').selectpicker('refresh');
}
function getObjType(){
	$.ajax({
        url: portal.bp() + '/assess/getBasicInfoMgmt?r='+Math.random(),
        type: 'get',
        async: false,
        data:{'assPropNum':assPropNum},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	objType = data.data.assObjTypeCd;
        	assPropType = data.data.assPropTypeCd;
        	iszhdf = data.data.iszhdf;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
//分页查询机构列表	 
var TableObj_jg = {
    oTableInit: function () {
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
        $('#datatable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/assess/show_obj_list_jg',
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
                    'belongOrg': $('#belongOrg').val(),
                    'assObjId': $('#assObjId').val(),
                    'assObjName': $('#assObjName').val(),
                    //'postList': $('#postList').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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
        });
    },
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
            url: portal.bp() + '/assess/show_exist_obj_list_jg',
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
                    'belongOrg': $('#belongOrg').val(),
                    'assObjId': $('#assObjId').val(),
                    'assObjName': $('#assObjName').val(),
                    //'postList': $('#postList').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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
        });
    }
};
//分页查询员工列表	 
var TableObj_yg = {
    oTableInit: function () {
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
        $('#datatable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/assess/show_obj_list_yg',
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
                    'belongOrg': $('#belongOrg').val(),
                    'assObjId': $('#assObjId').val(),
                    'assObjName': $('#assObjName').val(),
                    'postList': $('#postList').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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
        });
    },
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
            url: portal.bp() + '/assess/show_exist_obj_list_yg',
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
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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

    var htmltext = '<a id="toTeamDetail class="oper-left"  onclick="teamDetailaClick(' + '\'' + pkId + '\',\'' + teamTypeCd + '\',\'' + teamId + '\',\'' + validTag + '\',\'' + operType + '\')"><b>'+row.teamName+'</b></a>'

    return htmltext;

}
function teamDetailaClick(pkId, teamTypeCd, teamId, validTag, operType) {
	layer.open({
        type:2,
        title:'团队成员',
        shadeClose:true,
        shade:0.8,
        area:['800px','620px'],
        content:portal.bp() + '/assess/showTeamDetail?pkId='+pkId+'&teamTypeCd='+teamTypeCd
        						+'&teamId='+teamId+'&validTag='+validTag+'&operType='+operType
    });
};
//分页查询团队列表	 
var TableObj_td = {
    oTableInit: function () {
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
        $('#datatable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/assess/show_obj_list_td',
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
                    'belongOrg': $('#belongOrg').val(),
                    'assObjId': $('#assObjId').val(),
                    'assObjName': $('#assObjName').val(),
                    'teamCharCd': $('#teamCharCd').val(),
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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
        });
    },
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
            url: portal.bp() + '/assess/show_exist_obj_list_td',
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
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            height:300, //表格固定高度
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
        });
    },
};
