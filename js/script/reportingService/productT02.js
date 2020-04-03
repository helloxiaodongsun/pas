//机构号和机构层级可能的字段对应关系
var orgMap = {
		'ORG_NUM':'ORG_HIRCHY',
		'SUPER_ORG_NUM':'SUPER_ORG_HIRCHY'
}
//没有机构层级字段的对应表名和层级
var tableHirchyRel={
		'A_REB_CAPT_REP_REG_LINE-LS016':'4',
		'A_REB_CAPT_REP_SUB_BRCH-LS017':'5',
		'A_REB_DPST_REP_REG_LINE-LS018':'4',
		'A_REB_DPST_REP_SUB_BRCH-LS019':'5'
}
//默认机构全选
var selectAllTables = ['A_REB_CAPT_REP_REG_LINE-LS016','A_REB_CAPT_REP_SUB_BRCH-LS017'
                       ,'A_REB_DPST_REP_REG_LINE-LS018','A_REB_DPST_REP_SUB_BRCH-LS019'];
//五级机构名使用org_num=(除外的表)
var selectLSspecial= ['A_REB_CAPT_REP_REG_LINE-LS016','A_REB_CAPT_REP_SUB_BRCH-LS017'
    ,'A_REB_DPST_REP_REG_LINE-LS018','A_REB_DPST_REP_SUB_BRCH-LS019'];

//机构全选时加上分行编号23:中关村分行，19:北京分行
var selectAllAddBranch = ['A_REB_CAPT_REP_REG_LINE-LS016','A_REB_CAPT_REP_SUB_BRCH-LS017'
                       ,'A_REB_DPST_REP_REG_LINE-LS018','A_REB_DPST_REP_SUB_BRCH-LS019'];
//分行合计
var gedai999999Arr = ['A_REB_LOAN_SIZE_SITU_TAB-LS034','A_REB_LOAN_SIZE_SITU_TAB-LS035','A_REB_LOAN_SIZE_SITU_TAB-LS036'
                      ,'A_COB_DPST_BAL_ORG_TAB-GS001','A_COB_DPST_BAL_ORG_TAB-GS002','A_COB_DPST_BAL_ORG_TAB-GS003'
                      ,'A_COB_LOAN_BAL_ORG_TAB-GS006','A_COB_LOAN_BAL_ORG_TAB-GS007','A_COB_LOAN_BAL_ORG_TAB-GS008'
                      ,'A_COB_DPSIT_LOAN_RATIO_ORG-GS011'];
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
var levelorgcount=-1;
var lastQueryParams;
var sublastQueryParams;
var results;
var levels;
$(function () {
    $(function(){
        $(".date-dt").datetimepicker({
            language:"zh-CN",
            format:"yyyy-mm-dd",
            minView:2,
            autoclose:true,
            todayBtn:true,
            clearBtn:false,
        });
    });    
    var whereStr = "";
    var subWhereValue = {};
    var queryParams = {};
    $(document).attr('title', whereList[0].tableNameCn);
    $("#tableNameCn").text(whereList[0].tableNameCn);

    createHtml();
    createJs();
    if(mid=='3560'||mid=='3570'||mid=='3580'||mid=='35102'||mid=='35101'||mid=='35100'){
    	$("#CURR_CD").selectpicker('refresh').selectpicker('val', "02");
    }
    if(whereList[0].tableName=="A_COB_CUST_DPST_CHANGE_ORG-GS004"){
	    levels = "LV"+$("#SUPER_ORG_HIRCHY").val();
	    results= $.param.getOrgByLevels(levels,mid);   
	    $("#SUPER_ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
		.selectpicker('refresh').selectpicker('val', results[0].orgNum);
    }
    query();
      

    //初始化报表说明(备注)
    $.ajax({
           url: portal.bp() + '/table/queryNote',
           type: "get",
           async: false, // 同步 为全局变量赋值
           data: {
               'tableName': whereList[0].tableName
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
		            	var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>"+s[i].table_NOTE+"</td></tr>";
		            	$("#noteList").append(trHtml);
	           	}
	           	$("#noteList .no-records-found").hide();
        	}
           }
   });
    
    $("input").focus(function(){
        $(this).parent().children(".input_clear").show();
 	});
    
    $("input").blur(function(){        
        if($(this).val()==''){
        	$(this).parent().children(".input_clear").hide();
        }
 	});
    
    $(".input_clear").click(function(){
    	$(this).parent().find("input").val('');
    	$(this).hide();
    });
    
});

function queryIsPageFinder(tableName) {
    var res;
    $.ajax({
        url: portal.bp() + '/table/isPageFinder',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {
            'tableName': tableName
        },
        cache: false,
        success: function (data) {
            res = data.data;
        }
    });
    return res;
}

function createHtml() {
    var html = '';
    //复制
    var whereListCopy = JSON.parse(JSON.stringify(whereList));
    //去除不在页面上展示的字段
    for(var index=whereListCopy.length-1;index>=0;index--){
    	var item = whereListCopy[index];
    	if(item==null || item ==undefined){
            return;
	     }
	
	     if (item.formType == undefined || item.formType == null) {
	         whereListCopy.splice(index,1);
	     } else {
	         if (item.formType != '1' && item.formType != '2' && item.formType != '3') {
	         	whereListCopy.splice(index,1);
	         }
	     }
    }
    var flag = false;
    $.each(whereListCopy, function (index, item) {
        if (index % 3 == 0) {
            html += '<div class="form-group">';
        }

        html += '<label for="' + item.nameEn + '" class="control-label col-md-1">' + item.nameCn + ':</label>';
        html += '<div class="col-md-3">';
        if (item.formType == '1') {
/*        	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/
            html += '<input type="text" class="form-control" id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
        } else if (item.formType == '2') {
        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
	        		if(whereList[0].tableName=="A_COB_CUST_DPST_CHANGE_ORG-GS004"){
	            		html += '<select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
	        		}else{
	        			//机构号机构层级部分多选
	            		html += '<select multiple="multiple" data-actions-box="true"  class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
	            	
	        		}
        		}else{
        			html += '<select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
        	}
        } else if (item.formType == '3') {
/*        	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/
            html += '<input type="text" autocomplete="off" class="form-control date-dt" id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
        }
        html += '</div>';

        if (whereListCopy.length % 3 == 0) {
            flag = true;
        } else {
            if (index == whereListCopy.length - 1) {
                html += '<div class="col-md-1"><button onclick="query();" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>查询                        </button></div><div class="col-md-1"></div><div class="col-md-1"><button onclick="resetForm();" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>重置                        </button></div>';
            }
        }
        if (index % 3 == 2 || index == whereListCopy.length - 1) {
            html += '</div>';
        }
    });
    if (flag) {
        html += '<div class="form-group">';
        html += '<div class="col-md-4"></div><div class="col-md-1"><button onclick="query();" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>查询                        </button></div><div class="col-md-1"></div><div class="col-md-1"><button onclick="resetForm();" type="button" class="btn btn-primary"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>重置                        </button></div>';
        html += '</div>';
    }
    $("#formSearch").append(html);
}

function createJs() {
    $.each(whereList, function (index, item) {
        if (item.formType == '2') {
        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
        		$("#"+item.nameEn).on('changed.bs.select',function(a,b,c,d){
        			if(!$(this).selectpicker('val')){
        				//必选
        				document.getElementById(item.nameEn).options.selectedIndex = b;
        				$("#"+item.nameEn).selectpicker('refresh');
        				layer.msg("机构必选",{icon:3});
        			}
        			if(selectAllAddBranch.indexOf(whereList[0].tableName)>-1){
        				//查询条件，机构全选时显示分行
        				if($(this).selectpicker('val').length==levelorgcount){
        					$("#"+item.nameEn).siblings('button').children('span').eq(0).text('分行');
        					$("#"+item.nameEn).siblings('button').attr('title','分行');
        				}
        			}
        		})
            	//防止没有机构层级
            	findOrgByLevel(item.nameEn,orgMap[item.nameEn]);
            	//机构层级联动机构
            	$("#"+orgMap[item.nameEn]).change(function(){
            		findOrgByLevel(item.nameEn,orgMap[item.nameEn]);
            	});
            	$("#"+orgMap[item.nameEn]).change();
            }else{
            	if(item.codeParent!=undefined&&item.codeParent=='TB0056'){
            		//机构层级特殊处理，取权限范围内的机构层级
            		findAuthOrgHirchy(item.nameEn,item.isCheck);
            	}else{
	            	$("#" + item.nameEn).html("").append($.param.getSelectOptionOrder(item.codeParent));
	                $("#" + item.nameEn).selectpicker('refresh');
	                if (item.isCheck != undefined && item.isCheck != null) {
	                    $("#" + item.nameEn).selectpicker('val', item.isCheck).change();
	                }
            	}
            }
        } else if (item.formType == '3') {
        	if(item.isCheck!=undefined&&item.isCheck!=null&&item.isCheck=='0'){
    			$("#" + item.nameEn).val("");
    		}else{
    			$("#" + item.nameEn).val(date);
    		}
        }
    });

}
/**
 * 查询权限范围机构层级
 * @param eleId
 * @param isCheck
 */
function findAuthOrgHirchy(eleId,isCheck){
	var html = "";
	var flag = false;
	$.ajax({
		url : portal.bp() + '/org/findAuthOrgHirchy',
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'mid':mid
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				var s = data.data;
				var firstValue='';
				$.each(s,function(index,item){
					if(index==0){
						firstValue = item.ENCODE;
					}
					if(isCheck!=undefined&&item.ENCODE==isCheck){
						flag = true;
					}
					html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
				});
				$("#"+eleId).empty().append(html);
				if(flag){
					$("#"+eleId).selectpicker('refresh').selectpicker('val',isCheck).change();
				}else{
					$("#"+eleId).selectpicker('refresh').selectpicker('val',firstValue).change();
				}
			}
		}
	});
}
/**
 * 根据机构层级查找机构
 * @param eleId 机构id
 * @param levelEleId 机构层级id
 */
function findOrgByLevel(eleId,levelEleId){
	var html = "";
	var level = $("#"+levelEleId).val();
	if(!level){
		level = tableHirchyRel[whereList[0].tableName];
	}
	level = "LV" + level;
	
	$.ajax({
		url : portal.bp() + '/org/findAllOrgCountByLevel',
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'level' : level,
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				levelorgcount = data.data;
			}
		}
	});
	
	$.ajax({
		url : portal.bp() + '/org/findOrgByLevel',
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'level' : level,
			'mid':mid
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				var s = data.data;
				var tipsMap = {};
				$.each(s,function(index,item){
					eval("tipsMap."+item.orgName.replace(/[\u0000-\u00FF]/g,"")+"='"+item.childOrgNames+"'");
					html += '<option value="'+item.orgNum+'">'+item.orgName+'</option>';
				});
				$("#"+eleId).empty().append(html);
				//默认选中第一个
				document.getElementById(eleId).options.selectedIndex = 0;
				$("#"+eleId).selectpicker('refresh');
				if(selectAllTables.indexOf(whereList[0].tableName)>-1){
					//全选
					$("#"+eleId).selectpicker('selectAll')
				}
				
				if(level=='LV3'||level=='LV4'){
                	//主管行和管辖行新增鼠标移入移出事件
                	var tipsindex;
                	$("#"+eleId).parent().find(".dropdown-menu ul li").on('mouseover',function(){
                		
                		var tipsMsg = eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,""));
                		if(tipsMsg!=null&&tipsMsg!='null'){
                			tipsindex = layer.tips(eval("tipsMap."+$(this)[0].innerText.replace(/[\u0000-\u00FF]/g,"")),$(this));
                		}
                	});
                	$("#"+eleId).parent().find(".dropdown-menu ul li").on('mouseout',function(){
                		layer.close(tipsindex);
                	});
                }
			}
		}
	});
	if(whereList[0].tableName=="A_COB_CUST_DPST_CHANGE_ORG-GS004"){
	    levels = "LV"+$("#SUPER_ORG_HIRCHY").val();
	    results= $.param.getOrgByLevels(levels,mid); 
	    if(results.length>0){
	    	$("#SUPER_ORG_NUM").html("").append($.param.getOrgByLevel(levels,mid))
	    	.selectpicker('refresh').selectpicker('val', results[0].orgNum);	    	
	    }
    }
}
/**
 * 数组转in语句字符串
 * @param arr
 */
function dealOrgWhere(arr,id){
	var res = "";
	if(arr==null||arr==''){
		res += "'00000000'";
	}else{
		$.each(arr,function(index,item){
			if(index==arr.length-1){
				res += "'"+item+"'";
			}else{
				res += "'"+item+"',";
			}
		})
		if(selectAllAddBranch.indexOf(whereList[0].tableName)>-1){
			//查询条件，机构全选时需要添加分行编号23和19
			if(arr.length==levelorgcount){
				res = "'23','19'," + res;
			}
		}
	}
	return res;
}
//分页查询列表
var TableObj = {
    oTableInit: function () {
        var tjkj = $("#TJKJ").val();
        var tableType = whereList[0].tableName;
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }

        var columns = $.param.getTableHeaderByType(tableType);
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/table/T01/query',
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
                return createQueryParams(params, columns);
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50,100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
           // height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                /*var dw = $("#DW").val();
                if (dw != undefined && dw != null) {
                    var old = $("#queryTable thead tr:eq(1) th div:eq(0)").text();
                    if (old.indexOf("单位") > -1) {
                        $("#queryTable thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                    }
                }*/
               deal999999($("#queryTable"));
               countFormat();      //格式化金额
                $('#queryTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                $(window).trigger("resize");
            },
            columns: columns,
            rowStyle:rowStyle

        });
    }
};
//不分页查询列表
var TableObjNoPage = {
    oTableInit: function () {
        var tjkj = $("#TJKJ").val();
        var tableType = whereList[0].tableName;
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }

        var columns = $.param.getTableHeaderByType(tableType);
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/table/T01/queryNoPage',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return createQueryParams(params, columns);
            },
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
            onLoadSuccess: function (data) {
              /*  var dw = $("#DW").val();
                if (dw != undefined && dw != null) {
                    var old = $("#queryTable thead tr:eq(1) th div:eq(0)").text();
                    if (old.indexOf("单位") > -1) {
                        $("#queryTable thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                    }
                }*/
                deal999999($("#queryTable"));
                countFormat();
                $(window).trigger("resize");
            },
            columns: columns

        });
    }
};
window.operateEvents = {
    "click #showModel": function (e, value, row, index) {
        var tableName = $(this).attr("subTableName");
        var subTableWhere;
        var subWhereValue = {};
        $.ajax({
            url: portal.bp() + '/table/getTableWhere',
            type: 'get',
            async: false,
            data: {
                "tableName": tableName
            },
            dataType: "json"
        }).done(function (data) {
            if (data.code == '200') {
                subTableWhere = data.data;

                $.each(subTableWhere, function (index, item) {
                    if (item.iswhere == '1') {
                        $.each(row, function (key, val) {
                        	
                    		if (key == item.nameEn ||key == item.nameEn.toLowerCase()) {
                                subWhereValue[key] = val;
                            }else if(key == "org_num"){
                            	subWhereValue[key] = val;
                            }
                        });
                    }else{
                    	$.each(row, function (key, val) {
	                    	if (key == "org_name") {
	                            subWhereValue[key] = val;
	                        }else if(key == "org_num"){
	                        	subWhereValue[key] = val;
	                        }
                    	});
                    }
                });
            }
        });
        
        if (queryIsPageFinder(tableName)) {
            TableObjSub.oTableInit(tableName, subWhereValue, subTableWhere);
        } else {
            TableObjSubNoPage.oTableInit(tableName, subWhereValue, subTableWhere);
        }
        $("#detailModelTitle").text(subTableWhere[0].tableNameCn);
        $("#detailModel").modal("show");
    }

}

//下钻表分页查询列表
var TableObjSub = {
    oTableInit: function (tableName, subWhereValue, subTableWhere) {
        $('#detailModelTable').bootstrapTable('destroy');
        var tjkj = $("#TJKJ").val();
        var tableType = tableName;
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }
        var columns = $.param.getTableHeaderByType(tableType);
        $('#detailModelTable').bootstrapTable({
            url: portal.bp() + '/table/T01/query',
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
                return createSubQueryParams(params, columns, tableName, subWhereValue, subTableWhere);
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50,100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            //height:450, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                //
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                /*var dw = $("#DW").val();
                if (dw != undefined && dw != null) {
                    var old = $("#queryTable thead tr:eq(1) th div:eq(0)").text();
                    if (old.indexOf("单位") > -1) {
                        $("#queryTable thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                    }
                }*/
                deal999999($("#detailModelTable"));
                countFormat();
                $(window).trigger("resize");
            },
            columns: columns,
            rowStyle:rowStyle
        });
    }
};
//下钻表不分页查询列表
var TableObjSubNoPage = {
    oTableInit: function (tableName, subWhereValue, subTableWhere) {
        $('#detailModelTable').bootstrapTable('destroy');
        var tjkj = $("#TJKJ").val();
        var tableType = tableName;
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }

        var columns = $.param.getTableHeaderByType(tableType);
        $('#detailModelTable').bootstrapTable({
            url: portal.bp() + '/table/T01/queryNoPage',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return createSubQueryParams(params, columns, tableName, subWhereValue, subTableWhere);
            },
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
            onLoadSuccess: function (data) {
               /* var dw = $("#DW").val();
                if (dw != undefined && dw != null) {
                    var old = $("#queryTable thead tr:eq(1) th div:eq(0)").text();
                    if (old.indexOf("单位") > -1) {
                        $("#queryTable thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                    }
                }*/
                deal999999($("#detailModelTable"));
                countFormat();
                $(window).trigger("resize");
            },
            columns: columns

        });
    }
};

function createQueryParams(params, columns) {
    queryParams = {
        'pageSize': params.limit,
        'pageNum': (params.offset / params.limit) + 1,
        'logTableName':whereList[0].tableName,
        'logMenuId':mid,
    };
    var dw = $("#DW").val();
    if (dw != undefined && dw != null) {
        queryParams.DW = dw;
    }
    //查询结果
    var groupBy = []; //分组字段数组
    var isSeq = false;
    var currCdVal = "";
    queryParams.selectStr = function () {
        var res = '1';

        $.each(whereList, function (index, item) {
            if (item.nameEn.toUpperCase() == 'SEQ_NUM') {
                res = 'A.SEQ_NUM';
                isSeq = true;
                groupBy.push(res);
                return false;
            }
        });
        $.each(whereList, function (index, item) {
            if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {

            	if(item.nameEn.toUpperCase() == 'SEQ_NUM' && isSeq){
                }else{
	                res += ',A.' +item.nameEn;
	                groupBy.push("A."+item.nameEn);
                }
            }
            if(item.nameEn.toUpperCase()=='CURR_CD'){
            	currCdVal = $("#" + item.nameEn).val();
            }
        });
        $.each(columns, function (i, cols) {
            $.each(cols, function (index, item) {
                if (item.field != null && item.field != undefined) {
                    if(item.matrixingTag != undefined && item.matrixingTag != null){
                		//res += ', sum(' + item.field+') as '+item.field;
                    	if(item.field !='y_daily_index'&& item.field !='year_incremt_index'&& item.field !='mon_incremt_index'
                			&& item.field !='mon_target'&& item.field !='mon_index_diff'){
                    		if(whereList[0].tableName=='A_COB_CUST_DPST_CHANGE_ORG-GS004'){
                    			if (currCdVal == '01') {//人民币
       	               			 	res += ", sum(case when A.CURR_CD='01'  then A." + item.field+" else 0 end) as "+item.field;
       	                        } else if (currCdVal == '02') {//外折人
       	                       	 	res += ", sum(case when A.CURR_CD='02'  then A." + item.field+" else 0 end) as "+item.field;
       	                        } else if(currCdVal == '03'){//本外币
       	                       	 	res += ", sum(case when A.CURR_CD='00'  then A." + item.field+" else 0 end) as "+item.field;
       	                        }
                    		}else{
                    			if (currCdVal == '01') {//人民币
       	               			 res += ", sum(case when A.CURR_CD='01'  then A." + item.field+" else 0 end) as "+item.field;
       	                        } else if (currCdVal == '02') {//外折人
       	                       	 res += ", sum(case when A.CURR_CD<>'01'  then A." + item.field+" else 0 end) as "+item.field;
       	                        } else {//本外币
       	                    		res += ', sum(A.' + item.field+') as '+item.field;
       	                        }
                    		}
	                		
                    	}else{
                    		if(item.field =='mon_target' && whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS001'){//GS001
                    			
                    			res +=",  v.NEGU_INDEX_VAL  as "+item.field;
                    			
                    		}else if(item.field =='y_daily_index' && whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS002'){//GS002
                    			
                    			res +=",  v.NEGU_INDEX_VAL  as "+item.field;
                    			
                    		}else if(item.field =='mon_target' && whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS006'){//GS006
                    			
                    			res +=",  v.NEGU_INDEX_VAL  as "+item.field;
                    			
                    		}else if(item.field =='y_daily_index' && whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS007'){//GS007
                    			
                    			res +=",  v.NEGU_INDEX_VAL as "+item.field;
                    			
                    		}else{
	                			res += ',A.' + item.field;
	                			groupBy.push("A."+item.field);
                    		}
                		}
                	}else{
                		if(item.field =='target_rate' && whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS001'){//GS001
                			
                			res +=",  v.NEGU_INDEX_CMPLT_ratio as "+item.field;
                			
                		}else if(item.field =='y_daily_index_cmplt_rate' && whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS002'){//GS002
                			
                			res +=",  v.NEGU_INDEX_CMPLT_ratio  as "+item.field;
                			
                		}else if(item.field =='target_rate' && whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS006'){//GS006
                			
                			res +=",  v.NEGU_INDEX_CMPLT_ratio  as "+item.field;
                			
                		}else if(item.field =='y_daily_index_cmplt_rate' && whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS007'){//GS007
                			
                			res +=",  v.NEGU_INDEX_CMPLT_ratio  as "+item.field;
                			
                		}else if(item.field =='dpsit_loan_ratio' && whereList[0].tableName=='A_COB_DPSIT_LOAN_RATIO_ORG-GS011'){//GS011
                			
                			res +=",  case when sum(A.dpsit_daily_bal) != 0 THEN round(sum(A.loan_pnt_bal) /" +
                                " sum(A.dpsit_daily_bal)  * 100#2) END  as "+item.field;
                			
                		}else{
	                		//字段脱敏
	                        res += remSensitives(item);
	                		groupBy.push("A."+item.field);
                		}
                	}
                }
            });
        });

        return res;
    }
    //是否转换
    queryParams.matrixingTagStr = function () {
        var res = "0"
    	$.each(whereList, function (index, item) {
        	if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {
            	if(item.nameEn.toUpperCase() == 'SEQ_NUM' && isSeq){
                }else{
	                res += ',0';
	            }
            }
    	 });
        $.each(columns, function (i, cols) {
            $.each(cols, function (index, item) {

                if (item.field != null && item.field != undefined) {
                    if (item.matrixingTag != undefined && item.matrixingTag != null) {
                        res += ',' + item.matrixingTag;
                    } else {
                        res += ',0';
                    }

                }
            });
        });
        return res;
    }
    //表名
    queryParams.tableStr = function () {
        //return whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0];
        
        var val = $("#DATA_DT").val();
    	var res = whereList[0].tableName;
    	if(val!=""&&val!=null){

	    	if(res=="A_COB_DPST_BAL_ORG_TAB-GS001"){//GS001
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id and v.data_dt ='"+val+"' and v.ass_y = substr('"+val+"',1,4) and v.mon = substr('"+val+"',1,7) ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio','v.data_dt','v.ass_y');
	
	    	}else if(res=="A_COB_DPST_BAL_ORG_TAB-GS002"){//GS002
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id and v.data_dt ='"+val+"' and v.ass_y = substr('"+val+"',1,4) and v.mon = substr('"+val+"',1,7) ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio','v.data_dt','v.ass_y');
	
	    	}else if(res=="A_COB_LOAN_BAL_ORG_TAB-GS006"){//GS006
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id and v.data_dt ='"+val+"' and v.ass_y = substr('"+val+"',1,4) and v.mon = substr('"+val+"',1,7) ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio','v.data_dt','v.ass_y');
	
	    	}else if(res=="A_COB_LOAN_BAL_ORG_TAB-GS007"){//GS007
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id and v.data_dt ='"+val+"' and v.ass_y = substr('"+val+"',1,4) and v.mon = substr('"+val+"',1,7) ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio','v.data_dt','v.ass_y');
	
	    	}else{
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+" A";
	    	}
		
    	}else{
    		if(res=="A_COB_DPST_BAL_ORG_TAB-GS001"){//GS001
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id  ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio');
	
	    	}else if(res=="A_COB_DPST_BAL_ORG_TAB-GS002"){//GS002
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id  ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio');
	
	    	}else if(res=="A_COB_LOAN_BAL_ORG_TAB-GS006"){//GS006
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id  ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio');
	
	    	}else if(res=="A_COB_LOAN_BAL_ORG_TAB-GS007"){//GS007
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+
	    				" A left join "+whereList[0].dataBaseUser+".A_ORG_CONVT_RATIO_V V on A.org_id = v.org_id  ";
				groupBy.push('V.INDEX_NUM','v.NEGU_INDEX_VAL','v.NEGU_INDEX_CMPLT_ratio');
	
	    	}else{
	    		res = whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0]+" A";
	    	}
    	}
    	if (currCdVal == '01') {//人民币
    		if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS001"){//GS001
    			res += " and V.INDEX_NUM='KCP0003' "
	    	}else if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS002"){//GS002
	    		res += " and V.INDEX_NUM='KCP0002' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS006"){//GS006
	    		res += " and V.INDEX_NUM='KCP0103' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS007"){//GS007
	    		res += " and V.INDEX_NUM='KCP0106' "
	    	}
        } else if (currCdVal == '02') {//外折人
        	if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS001"){//GS001
        		res += " and V.INDEX_NUM='KCP0115' "
	    	}else if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS002"){//GS002
	    		res += " and V.INDEX_NUM='KCP0004' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS006"){//GS006
	    		res += " and V.INDEX_NUM='KCP0104' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS007"){//GS007
	    		res += " and V.INDEX_NUM='KCP0107' "
	    	}
        } else{//本外币
        	if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS001"){//GS001
        		res += " and V.INDEX_NUM='KCP0114' "
	    	}else if(whereList[0].tableName=="A_COB_DPST_BAL_ORG_TAB-GS002"){//GS002
	    		res += " and V.INDEX_NUM='KCP0001' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS006"){//GS006
	    		res += " and V.INDEX_NUM='KCP0105' "
	    	}else if(whereList[0].tableName=="A_COB_LOAN_BAL_ORG_TAB-GS007"){//GS007
	    		res += " and V.INDEX_NUM='KCP0108' "
	    	}
        }
        return res;
    }
    //where条件
    queryParams.whereStr = function () {
        var res = "1=1";
        //存放需要时间区间的字段
        var dateSection = [];
        var orgHirchy = $("#SUPER_ORG_HIRCHY").val();
        $.each(whereList, function (index, item) {
            var val = $("#" + item.nameEn).val();
            if ((val != null && val != undefined && val != '')||item.nameEn=='SUPER_ORG_NUM'||item.nameEn=='ORG_NUM') {
                if (item.nameEn.toUpperCase() == 'CURR_CD') {//币种特殊处理
                	if(whereList[0].tableName=="A_COB_DPSIT_LOAN_RATIO_ORG-GS011"){
	                    if (val == '01') {//人民币
	                        res += " and A.CURR_CD='01'";
	                    } else if (val == '02') {//外折人
	                        res += " and A.CURR_CD<>'01'";
	                    } else if (val == '03') {//本外币
	
	                    }
                	}else if(whereList[0].tableName=="A_COB_CUST_DPST_CHANGE_ORG-GS004"){
	                    if (val == '01') {//人民币
	                        res += " and A.CURR_CD='01'";
	                    } else if (val == '02') {//外折人
	                        res += " and A.CURR_CD ='02'";
	                    } else if (val == '03') {//本外币
	                    	res += " and A.CURR_CD='00'";
	                    }
                	}
                } else {
                    if (item.iswhere == '1') {
                        if (item.formType == '3') {
                            if (item.dateCode == undefined || item.dateCode == null) {
                                //非时间区间
                                res += " and A." + item.nameEn + "=date'" + val + "'";
                            } else {
                                dateSection.push(item.dateCode);
                            }
                        }else{
                        	if(whereList[0].tableName=="A_COB_CUST_DPST_CHANGE_ORG-GS004"){
	                        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
	                        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
	                        		if(orgHirchy == "5"){
	                        			if(val!=null&&val!=""){
			                        		res += " and A.seq_num = '1' and A.ORG_NUM='" + val + "'";
	                        			}else{
			                        		res += " and A.seq_num = '1' and A.ORG_NUM='0'";
	                        			}
	                        		}else{
	                        			if(val!=null&&val!=""){
			                        		res += " and A.seq_num = '2' and A.ORG_NUM='" + val + "'";
	                        			}else{
			                        		res += " and A.seq_num = '2' and A.ORG_NUM='0'";
	                        			}
	                        		}
	                        	}else{
	                        		res += " and A." + item.nameEn + "='" + val + "'";
	                        	}
                        	}else{
                        		if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
	                        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
	
	                        		if(gedai999999Arr.indexOf(whereList[0].tableName)>
	                        		-1&&($("#SUPER_ORG_HIRCHY").val()=='2'||$("#ORG_HIRCHY").val()=='2')){
	                            		res += " and (A.SUPER_ORG_NUM in (" + dealOrgWhere(val,item.nameEn) + ") or (A.SUPER_ORG_NUM in ('999999') and A.ORG_NUM in (" + dealOrgWhere(val,item.nameEn) + ")))";
	                            	}else if (!selectLSspecial.indexOf(whereList[0].tableName) > -1
	                                    &&($("#SUPER_ORG_HIRCHY").val()=='5'||$("#ORG_HIRCHY").val()=='5')) {
	                                    res += " and A." + "ORG_NUM" + " in (" + dealOrgWhere(val, item.nameEn) + ")";
	                                }else{
	                            		res += " and A." + item.nameEn + " in (" + dealOrgWhere(val,item.nameEn) + ")";
	                            	}
	                        		
	                        	}else{
	                        		res += " and A." + item.nameEn + "='" + val + "'";
	                        	}
                        	}
                        }
                    }
                }
            }
        });
        //去重
        dateSection = uniq(dateSection);
        //时间区间情况
        if (dateSection.length != 0) {
            for (var i = 0; i < dateSection.length; i++) {
                var ds = dateSection[i];
                $.each(whereList, function (index, item) {
                    if (item.dateCode == ds) {
                        var v1 = $("#" + item.dateCode + "_S").val();
                        var v2 = $("#" + item.dateCode + "_E").val();
                        if (v1 != null && v1 != '' && v2 != null && v2 != '') {
                            res += " and A." + ds + ">=date'" + v1 + "' and A." + ds + "<=date'" + v2 + "'";
                        } else if (v1 != null && v1 != '' && (v2 == null || v2 == '')) {
                            res += " and A." + ds + ">=date'" + v1 + "'";
                        } else if (v2 != null && v2 != '' && (v1 == null || v1 == '')) {
                            res += " and A." + ds + "<=date'" + v2 + "'";
                        }
                        return false;//跳出循环
                    }
                });
            }
        }
        //分组条件
        res +=' group by ';
        for (var i = 0; i < groupBy.length; i++) {
        	if(i==groupBy.length-1){
        		res += groupBy[i];
        	}else{
        		res += groupBy[i]+',';
        	}

        }
        whereStr = res;
        return res;
    }
    //排序
    queryParams.orderStr = function () {
        var resPrefix = ' order by ';
        var res = '';
        var flag = true;
        var orderFieldIndex = new Array();
        var orderField=new Object();
        $.each(whereList, function (index, item) {
            if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {
                flag = false;

                orderFieldIndex.push(item.isOrderBy);
                var orderTmp = new Array();
                orderTmp.push(item.nameEn);
                if(item.orderByType==null || item.orderByType ==undefined){
                    orderTmp.push('asc');
                }else {
                    orderTmp.push(item.orderByType);
                }
                orderField[item.isOrderBy]=orderTmp;
                if(groupBy.indexOf(item.nameEn)<0){

                    groupBy.push("A."+item.nameEn);
                }
            }
        });
        if (flag) {
            res = '';
        }else {
            var orderArray = orderFun(orderFieldIndex);

            for(var i=0;i<orderArray.length;i++){
                var orderFieldElement = orderField[orderArray[i]];

                if(i==0){

                    res += "A."+orderFieldElement[0]+' '+ orderFieldElement[1];
                }else{
                    res += ',A.'+ orderFieldElement[0]+' '+ orderFieldElement[1];
                }
            }

            res=resPrefix +res;
        }
        return res;
    }
    lastQueryParams = deepCopy(queryParams);
    return queryParams;
}


function createSubQueryParams(params, columns, tableName, subWhereValue, subTableWhere) {
    var subqueryParams = {
        'pageSize': params.limit,
        'pageNum': (params.offset / params.limit) + 1,
        'logTableName':tableName,
        'logMenuId':mid,
    };
    var dw = $("#DW").val();
    if (dw != undefined && dw != null) {
        subqueryParams.DW = dw;
    }
    //查询结果
    var ORG_SEARCH = undefined;
    var currCdVal = "";
    $.each(columns, function (i, cols) {
        $.each(cols, function (index, item) {
            if (item.mutipleOrg != null
                && item.mutipleOrg != undefined
                && item.mutipleOrg == '1'
                && (ORG_SEARCH == null
                    || ORG_SEARCH == undefined)) {
                var mutipleOrg = item.mutipleOrg;
                ORG_SEARCH = mutipleOrg;
            }
        });
    });
    $.each(whereList, function (index, item) {
    	if(item.nameEn.toUpperCase()=='CURR_CD'){
        	currCdVal = $("#" + item.nameEn).val();
        }
	 });
    var groupBy = []; //分组字段数组
    subqueryParams.selectStr = function () {
    	groupBy=[];
        var res = '1';


        $.each(columns, function (i, cols) {
            $.each(cols, function (index, item) {
                if (item.field != null && item.field != undefined) {
                    if(item.matrixingTag != undefined && item.matrixingTag != null){
                		                	
                		if(whereList[0].tableName=='A_COB_CUST_DPST_CHANGE_CUST-GS004_1'){
                			if (currCdVal == '01') {//人民币
   	               			 	res += ", sum(case when A.CURR_CD='01'  then A." + item.field+" else 0 end) as "+item.field;
   	                        } else if (currCdVal == '02') {//外折人
   	                       	 	res += ", sum(case when A.CURR_CD='02'  then A." + item.field+" else 0 end) as "+item.field;
   	                        } else if(currCdVal == '03'){//本外币
   	                       	 	res += ", sum(case when A.CURR_CD='00'  then A." + item.field+" else 0 end) as "+item.field;
   	                        }
                		}else{
                			res += ', sum(' + item.field+') AS '+item.field;
                			
                		}
                	}else{
                		if(item.field =='pnt_dpsit_loan_ratio' && tableName=='A_COB_DPSIT_LOAN_RATIO_CUST-GS011_1'){//GS011_1             			
                			res +=",  case when sum(DPSIT_PNT_BAL) = 0 then 0 else round(sum(LOAN_PNT_BAL) /sum(DPSIT_PNT_BAL) * 100#2) end  as "+item.field;
                			
                		}else if(item.field =='daily_dpsit_loan_ratio' && tableName=='A_COB_DPSIT_LOAN_RATIO_CUST-GS011_1'){//GS011_1             			
                			res +=",  case when sum(DPSIT_DAILY_BAL) = 0 then 0 else round(sum(LOAN_DAILY_BAL)/sum(DPSIT_DAILY_BAL)*100#2) end  as "+item.field;
                			
                		}else if(item.field =='dpsit_loan_ratio' && tableName=='A_COB_DPSIT_LOAN_RATIO_CUST-GS011_1'){//GS011_1             			
                			res +=",  case when sum(DPSIT_DAILY_BAL) = 0 then 0 else round(sum(LOAN_PNT_BAL)/sum(DPSIT_DAILY_BAL)*100#2) end as "+item.field;
                			
                		}else{
                			//字段脱敏
                            res += remSensitive(item);
                    		groupBy.push(item.field);
                		}
                	}
                }
            });
        });

        return res;
    }
    //是否转换
    subqueryParams.matrixingTagStr = function () {
        var res = "0"
    	/*$.each(whereList, function (index, item) {
        	if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {
            	if(item.nameEn.toUpperCase() == 'SEQ_NUM'){
                }else{
	                res += ',0';
	            }
            }
    	 });*/
        $.each(columns, function (i, cols) {
            $.each(cols, function (index, item) {

                if (item.field != null && item.field != undefined) {
                    if (item.matrixingTag != undefined && item.matrixingTag != null) {
                        res += ',' + item.matrixingTag;
                    } else {
                        res += ',0';
                    }

                }
            });
        });
        return res;
    }
    //表名
    subqueryParams.tableStr = function () {
        return whereList[0].dataBaseUser+'.'+tableName.split('-')[0];
    }
    //where条件
    subqueryParams.whereStr = function () {
        var whereStr = '1=1';
        var dateSection = [];

        $.each(whereList, function (index, item) {
            var val = $("#" + item.nameEn).val();
            if ((val != null && val != undefined && val != '')||item.nameEn=='SUPER_ORG_NUM'||item.nameEn=='ORG_NUM') {
                if (item.nameEn.toUpperCase() == 'CURR_CD') {//币种特殊处理
                	if(whereList[0].tableName=='A_COB_CUST_DPST_CHANGE_ORG-GS004'){
            		}else{
            			if (val == '01') {//人民币
                        	whereStr += " and CURR_CD='01'";
                        } else if (val == '02') {//外折人
                        	whereStr += " and CURR_CD<>'01'";
                        } else if (val == '03') {//本外币

                        }
            		}
                	
                } else {
                    if (item.iswhere == '1') {
                        if (item.formType == '3') {
                            if (item.dateCode == undefined || item.dateCode == null) {
                                //非时间区间
                            	whereStr += " and " + item.nameEn + "=date'" + val + "'";
                            } else {
                                dateSection.push(item.dateCode);
                            }
                        } else {
                        	if(item.nameEn.toUpperCase() == "SUPER_ORG_HIRCHY" || item.nameEn.toUpperCase() == "SUPER_ORG_NUM" ){

                        	}else{
                        		if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
                            			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
                        			whereStr += " and " + item.nameEn + " in (" + dealOrgWhere(val,item.nameEn) + ")";
                            	}else{
                        		    if(whereList[0].tableName == 'A_COB_CUST_DPST_CHANGE_ORG-GS004'&&item.nameEn.toUpperCase() == 'CUST_CLASS_CD'){

                                    }else{
                                        whereStr += " and " + item.nameEn + "='" + val + "'";
                                    }
                            	}
                        	}
                        }
                    }
                }
            }
        });
        if (ORG_SEARCH != null
            && ORG_SEARCH != undefined
            && ORG_SEARCH == '1') {
        	var isAll = false; //是否合计
        	var orgNames = "";
        	 $.each(subWhereValue, function (key, value) {
        		 if (key.toUpperCase() == 'ORG_NAME') {
        			 if(value.substr(value.length-2)=="合计"){
        				 isAll = true;
        				 orgNames = value.substr(0,value.length-2);
        			 }else{
        				 orgNames = value;
        			 }
        			 
        		 }
        	 })
        	 
            $.each(subWhereValue, function (key, value) {
                if (key.toUpperCase() == 'ORG_NUM') {
                    var org_hirchy = $('#SUPER_ORG_HIRCHY').val();
                    if(org_hirchy=="1"&&value=="-"){
                    	whereStr += " and LEV1_ORG_NUM='999999'";
                    }else if(org_hirchy=="1"&&(value=="23"||value=="28"||value=="19"||value=="26")){
                    	whereStr += " and LEV2_ORG_NUM='" + value + "'";
                    }else if(org_hirchy=="1"&&value!="-"&&value!="23"&&value!="28"&&value!="19"&&value!="26"){
                    	whereStr += " and LEV4_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="2"&&(value=="23"||value=="28"||value=="19"||value=="26")){
                    	whereStr += " and LEV2_ORG_NUM='" + value + "'";
                    }else if(org_hirchy=="2"&&value!="23"&&value!="28"&&value!="19"&&value!="26"){
                    	whereStr += " and LEV4_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="3"&&isAll){
                    	whereStr += " and LEV3_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="3"&&!isAll){
                    	whereStr += " and LEV4_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="4"&&isAll){
                    	whereStr += " and LEV4_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="4"&&!isAll){
                    	whereStr += " and LEV5_ORG_NAME='" + orgNames + "'";
                    }else if(org_hirchy=="5"){
                    	whereStr += " and LEV5_ORG_NAME='" + orgNames + "'";
                    }
 
                   /*}else{
	                    var org_num_field = $.param.getSelectOrgNumOrgNameRef(org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF');
	                    org_num_field = org_num_field == null || org_num_field == undefined ?
	                        $.param.getSelectOrgNumOrgNameRef('0' + org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF') : org_num_field;
	                    if (org_num_field == null || org_num_field == undefined) {
	                        whereStr += " and " + key + "='" + value + "'";
	                    } else {
	
	                        whereStr += " and " + org_num_field.name + "='" + value + "'";
	
	                    
                    }*/
                } 
            })

        } else {
            $.each(subWhereValue, function (key, value) {
            	whereStr += " and " + key + "='" + value + "'";
            })
        }



      //去重
        dateSection = uniq(dateSection);
        //时间区间情况
        if (dateSection.length != 0) {
            for (var i = 0; i < dateSection.length; i++) {
                var ds = dateSection[i];
                $.each(whereList, function (index, item) {
                    if (item.dateCode == ds) {
                        var v1 = $("#" + item.dateCode + "_S").val();
                        var v2 = $("#" + item.dateCode + "_E").val();
                        if (v1 != null && v1 != '' && v2 != null && v2 != '') {
                        	whereStr += " and " + ds + ">=date'" + v1 + "' and " + ds + "<=date'" + v2 + "'";
                        } else if (v1 != null && v1 != '' && (v2 == null || v2 == '')) {
                        	whereStr += " and " + ds + ">=date'" + v1 + "'";
                        } else if (v2 != null && v2 != '' && (v1 == null || v1 == '')) {
                        	whereStr += " and " + ds + "<=date'" + v2 + "'";
                        }
                        return false;//跳出循环
                    }
                });
            }
        }

        //分组条件
        whereStr +=' group by ';
        for (var i = 0; i < groupBy.length; i++) {
        	if(i==groupBy.length-1){
        		whereStr += groupBy[i];
        	}else{
        		whereStr += groupBy[i]+',';
        	}

        }
        if(whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS001'||whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS002'
        	||whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS003'){
        	whereStr +=',cust_id,min_open_acct_dt '
        	//whereStr +=',lev4_org_num,lev5_org_num,cust_id,min_open_acct_dt '
        }
        if(whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS006'||whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS007'
        	||whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS008'||whereList[0].tableName=='A_COB_DPSIT_LOAN_RATIO_ORG-GS011'){
        	whereStr +=',cust_id '
        	//whereStr +=',lev4_org_num,lev5_org_num,cust_id '

        }
        
        if(whereList[0].tableName=='A_COB_CUST_DPST_CHANGE_ORG-GS004'){
        	whereStr +=',lev4_org_num,lev5_org_num '
        }
        
        return whereStr;
    }
    //排序
    subqueryParams.orderStr = function () {
        var resPrefix = ' order by ';
        var flag = true;
        var res = '';
        var orderFieldIndex = new Array();
        var orderField=new Object();
        $.each(subTableWhere, function (index, item) {
            if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {
                flag = false;
                orderFieldIndex.push(item.isOrderBy);
                var orderTmp = new Array();
                orderTmp.push(item.nameEn);
                if(item.orderByType == null || item.orderByType == undefined){
                    orderTmp.push('asc');
                }else {
                    orderTmp.push(item.orderByType);
                }
                orderField[item.isOrderBy]=orderTmp;
                if(groupBy.indexOf(item.nameEn)<0){

                    groupBy.push(item.nameEn);
                }
            }
        });

        if (flag) {
            res = '';
        }else {
            var orderArray = orderFun(orderFieldIndex);

            for(var i=0;i<orderArray.length;i++){
                var orderFieldElement = orderField[orderArray[i]];

                if(i==0){

                    res += orderFieldElement[0]+' '+ orderFieldElement[1];
                }else{
                    res += ','+ orderFieldElement[0]+' '+ orderFieldElement[1];
                }
            }

            res=resPrefix +res;
        
        }
        if(whereList[0].tableName=='A_COB_CUST_DPST_CHANGE_ORG-GS004'){
        	res =' order by lev4_org_num,lev5_org_num '
        }
        
        if(whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS001'||whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS002'
        	||whereList[0].tableName=='A_COB_DPST_BAL_ORG_TAB-GS003'){
        	res =' order by lev4_org_num,lev5_org_num,cust_id,min_open_acct_dt '
        }
        if(whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS006'||whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS007'
        	||whereList[0].tableName=='A_COB_LOAN_BAL_ORG_TAB-GS008'||whereList[0].tableName=='A_COB_DPSIT_LOAN_RATIO_ORG-GS011'){
        	res =' order by lev4_org_num,lev5_org_num,cust_id '
        }
        
        
        return res;
    }
    
    sublastQueryParams = deepCopy(subqueryParams);
    return subqueryParams;
}

//查询
function query() {
	if($("#ORG_NUM").length>0){
		if($("#ORG_NUM").val()==undefined||$("#ORG_NUM").val()==null||$("#ORG_NUM").val()==""){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
	if($("#SUPER_ORG_NUM").length>0){
		if($("#SUPER_ORG_NUM").val()==undefined||$("#SUPER_ORG_NUM").val()==null||$("#SUPER_ORG_NUM").val()==""){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
    $('#queryTable').bootstrapTable('destroy');
    if (queryIsPageFinder(whereList[0].tableName)) {
        TableObj.oTableInit();
    } else {
        TableObjNoPage.oTableInit();
    }
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $.each(whereList, function (index, item) {
        if (item.formType == '2') {
            $("#" + item.nameEn).selectpicker('refresh');
            if (item.isCheck != undefined && item.isCheck != null) {
                $("#" + item.nameEn).selectpicker('val', item.isCheck).change();
            }
            if(tableHirchyRel.hasOwnProperty(whereList[0].tableName)){
        		if(selectAllTables.indexOf(whereList[0].tableName)>-1){
					//全选
					$("#ORG_NUM").selectpicker('selectAll');
				}else{
					if(document.getElementById(item.nameEn)&&document.getElementById(item.nameEn).options)
						document.getElementById(item.nameEn).options.selectedIndex = 0;
					$("#ORG_NUM").selectpicker('refresh');
				}
        	}
        } else if (item.formType == '3') {
        	if(item.isCheck!=undefined&&item.isCheck!=null&&item.isCheck=='0'){
    			$("#" + item.nameEn).val("");
    		}else{
    			$("#" + item.nameEn).val(date);
    		}

        }
    });
}

//冒泡排序
function orderFun(array) {
    var t=0;
    for(var i=0;i<array.length;i++){
        for(var j=0;j<array.length-i-1;j++){
            if(array[j]>array[j+1]){
                t = array[j + 1];
                array[j + 1] = array[j];
                array[j] = t;
            }
        }
    }
    return array;
}

function exportCurrentPageExcel(){
	var columns = $("#queryTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=false;
	publicReportExcel(lastQueryParams,"exportExcelT01");
}
function exportAllDataExcel(){
	var columns = $("#queryTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,0);
	lastQueryParams.tableHead = JSON.stringify(result);
	lastQueryParams.AllData=true;
	publicReportExcel(lastQueryParams,"exportExcelT01");
}

function subexportCurrentPageExcel(){
	var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,1);
	sublastQueryParams.tableHead = JSON.stringify(result);
	sublastQueryParams.AllData=false;
	publicReportExcel(sublastQueryParams,"exportExcelT01");
}
function subexportAllDataExcel(){
	var columns = $("#detailModelTable").bootstrapTable('getOptions').columns;
	var result = tableNeedCopy(columns,1);
	sublastQueryParams.tableHead = JSON.stringify(result);
	sublastQueryParams.AllData=true;
	publicReportExcel(sublastQueryParams,"exportExcelT01");
}