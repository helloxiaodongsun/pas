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
//机构全选时加上分行编号23:中关村分行，19:北京分行
var selectAllAddBranch = ['A_REB_CAPT_REP_REG_LINE-LS016','A_REB_CAPT_REP_SUB_BRCH-LS017'
                       ,'A_REB_DPST_REP_REG_LINE-LS018','A_REB_DPST_REP_SUB_BRCH-LS019'];
//五级机构名使用org_num=(除外的表)
var selectLSspecial= ['A_REB_CAPT_REP_REG_LINE-LS016','A_REB_CAPT_REP_SUB_BRCH-LS017'
    ,'A_REB_DPST_REP_REG_LINE-LS018','A_REB_DPST_REP_SUB_BRCH-LS019'];
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
var levelorgcount=-1;
var lastQueryParams;
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
    $(document).attr('title', whereList[0].tableNameCn);
    $("#tableNameCn").text(whereList[0].tableNameCn);

    createHtml();
    createJs();
    $("#inputData").val("");
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

     $("#DATA_DT_S").change(function(){
        var data_s = $(this).val();
        var nowData = new Date();
        if(data_s ==""){
            $("#DATA_DT_S").val(date);
        }
    });

    $("#DATA_DT_E").change(function(){
        var data_e = $(this).val();
        var nowData = new Date();
        if(data_e ==""){
            $("#DATA_DT_E").val(date);
        }

    });
    
    
    $("#inputData").change(function(){
        var data = $(this).val();       
        if(data ==""){
        	if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
        	
        		layer.msg("授信额度不能为空",{icon:3});
        	}else if(whereList[0].tableName=="A_REB_LARGE_CHANGE_MONITOR-LS022"){
        		
        		layer.msg("变动规模不能为空",{icon:3});
        	}
            $("#inputData").val("0");
        }

    });
    
    if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
    	$("#CRDT_LMT").show();
    }else if(whereList[0].tableName=="A_REB_LARGE_CHANGE_MONITOR-LS022"){
    	$("#ASSET_BAL").show();
    }    
	$("#selectData").show();	
	$("#inputData").hide();
    
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

            if(item.nameEn=="CRDT_LMT"){//授信额度
            	html +='<div class="input-group"><span id="selectData"><select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" onchange=changeCrdt()></select></span>'+
            		'<input type="text" class="form-control"  id="inputData" name="inputData"/><div class="input-group-addon">万以下</div></div>';
            }else if(item.nameEn=="ASSET_BAL"){//大额变动规模
                html +='<div class="input-group"><span id="selectData"><select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" onchange=changeAsset()></select></span>'+
                	'<input type="text" class="form-control"  id="inputData" name="inputData"/><div class="input-group-addon">万以上</div></div>';
            }else{
/*            	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close fa fa-times-circle" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/                html += '<input type="text" class="form-control"  id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
            }
        } else if (item.formType == '2') {
        	if(item.nameEn=="CRDT_LMT"){//授信额度
             	html +='<div class="input-group"><span id="selectData"><select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" onchange=changeCrdt()></select></span>'+
             		'<input type="text" class="form-control"  id="inputData" name="inputData"/><div class="input-group-addon">万以下</div></div>';
             }else if(item.nameEn=="ASSET_BAL"){//大额变动规模
                 html +='<div class="input-group"><span id="selectData"><select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" onchange=changeAsset()></select></span>'+
                 	'<input type="text" class="form-control"  id="inputData" name="inputData"/><div class="input-group-addon">万以上</div></div>';
             }else if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
        		//机构号机构层级部分多选
        		html += '<select multiple="multiple" data-actions-box="true"  class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
        	}else{
        		html += '<select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
        	}
        	 
        } else if (item.formType == '3') {
/*        	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close fa fa-times-circle" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/            html += '<input type="text" class="form-control date-dt" id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
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
                    if (item.tableName == 'A_COB_MICRO_CUST_MGR_PER_TAB-GS027'
                        && item.nameEn == 'NEW_CORP_SIZE_CD') {
                        var codeArray = $.param.getSelectObject(item.codeParent);
                        var htmlSpecial;
                        if (codeArray != null && codeArray.length > 0) {
                            $.each(codeArray, function (index, value) {
                                if (value['encode'] != '01' && value['encode'] != '05') {
                                    htmlSpecial += "<option value='" + value.encode + "'>" + value.name + "</option>"
                                }
                            });
                            $("#" + item.nameEn).html("").append(htmlSpecial);
                        }
                    } else {
                        $("#" + item.nameEn).html("").append($.param.getSelectOptionOrder(item.codeParent));
                    }
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
        var tableType = whereList[0].tableName
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }
        var columns = $.param.getTableHeaderByType(tableType);
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/table/T03/query',
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
                countFormat();
                $('#queryTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                resizeTables();
            },
            columns: columns

        });
    }
};

var TableObjNotPage = {
    oTableInit: function () {
        var tjkj = $("#TJKJ").val();
        var tableType = whereList[0].tableName
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }

        var columns = $.param.getTableHeaderByType(tableType);
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/table/T03/queryNoPage',
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
                /*var dw = $("#DW").val();
                if (dw != undefined && dw != null) {
                    var old = $("#queryTable thead tr:eq(1) th div:eq(0)").text();
                    if (old.indexOf("单位") > -1) {
                        $("#queryTable thead tr:eq(1) th div:eq(0)").text(old + $.param.getDisplay('MONETARY_UNIT', dw));
                    }
                }*/
                deal999999($("#queryTable"));
                countFormat();
                resizeTables();
            },
            columns: columns

        });
    }
};

function createQueryParams(params, columns) {
    var queryParams = {
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
    var ORG_SEARCH = undefined;
    var groupBy = []; //分组字段数组
    var noGroupBy = [];//未分组字段
    var isSeq = false;
    var isOrgNum = false;
    var  date_s;//开始日期
    var  date_e;//终止日期
    queryParams.selectStr = function () {
        var res = '1';
        $.each(whereList, function (index, item) {
            if (item.nameEn.toUpperCase() == 'SEQ_NUM') {
                res = 'SEQ_NUM';
                isSeq = true;
                groupBy.push(res);
                return false;
            }
        });
        $.each(whereList, function (index, item) {
            if (item.iswhere == '1') {
                if (item.formType == '3') {
                    if (item.dateCode == undefined || item.dateCode == null) {
                        //非时间区间
                        //res += " and " + item.nameEn + "=date'" + val + "'";
                    } else {
                        date_s = $("#" + item.dateCode + "_S").val();
                        date_e = $("#" + item.dateCode + "_E").val();
                        //dateSection.push(item.dateCode);
                    }
                }
            }
            if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {                
            	if(item.nameEn.toUpperCase() == 'SEQ_NUM' && isSeq){

                }else if(item.nameEn.toUpperCase() == 'ORG_NUM'||item.nameEn.toUpperCase() == 'SUPER_ORG_NUM'){
                    isOrgNum=true;
                }else{
                    res += ',' +item.nameEn;
                    groupBy.push(item.nameEn);

                }
            }
        });
        $.each(columns, function (i, cols) {
            $.each(cols, function (index, item) {
                if (item.mutipleOrg != null
                    && item.mutipleOrg != undefined
                    && item.mutipleOrg == '1'
                    && (ORG_SEARCH == null
                        || ORG_SEARCH == undefined)) {
                    ORG_SEARCH = item.mutipleOrg;
                }
                if (item.field != null && item.field != undefined) {
                	if(item.matrixingTag != undefined && item.matrixingTag != null){
                		if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
                			if(item.field.toUpperCase() == 'LOAN_BAL'){
                                res+= ",sum(case when DATA_DT =date'"+date_e+"' then "+ item.field +" else 0 end) as "+item.field;
                    	    }else if (item.field.toUpperCase() == 'LOAN_BAL_ANY') {
                                res += ",sum(case when DATA_DT =date'"+date_e+"' then LOAN_BAL else 0 end) " +
                                    "- sum(case when DATA_DT =date'"+date_s+"' then LOAN_BAL else 0 end) as "+item.field;
                            }else if(item.field.toUpperCase() == 'DISTR_AMT'){
                                res += ",sum(case when DATA_DT =date'"+date_e+"' then "+item.field+" else 0 end) " +
                                    "- sum(case when DATA_DT =date'"+date_s+"' then "+item.field+" else 0 end) as "+item.field;
                            }else{
                                res += ', sum(' + item.field+') AS '+item.field;
                            }
                		}else if(whereList[0].tableName=="A_REB_LARGE_CHANGE_MONITOR-LS022"){
                			if(item.field.toUpperCase() == 'STATR_FUNDS'){
                				res+= ",sum(case when data_dt =date'"+date_s+"'  then ASSET_BAL else 0 end) as "+item.field;
                			}else if(item.field.toUpperCase() == 'END_FUNDS'){
                				res+= ",sum(case when data_dt =date'"+date_e+"'  then ASSET_BAL else 0 end) as "+item.field;
                			}else if(item.field.toUpperCase() == 'FUNDS_DIFF'){
                				res += ",sum(case when DATA_DT =date'"+date_s+"' then ASSET_BAL else 0 end) " +
                                "- sum(case when DATA_DT =date'"+date_e+"' then ASSET_BAL else 0 end) as "+item.field;
                			}else{
                				res += ', sum(' + item.field+') AS '+item.field;
                			}
                		}else{
                			res += ', sum(' + item.field+') AS '+item.field;
                		}
                	    
                	}else{
                		if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
                			if(item.field.toUpperCase() == 'LOAN_NUM'){
                                res+= ",sum(case when DATA_DT =date'"+date_e+"' then "+item.field+" else 0 end) as "+item.field;
                            }else if(item.field.toUpperCase() == 'LOAN_NUM_ANY'){
                                res += ",sum(case when DATA_DT =date'"+date_e+"' then LOAN_NUM else 0 end) " +
                                    "- sum(case when DATA_DT =date'"+date_s+"' then LOAN_NUM else 0 end) as "+item.field;
                            }else{
                            	//字段脱敏
                                res += remSensitive(item);
                                groupBy.push(item.field);
                            }

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
    queryParams.matrixingTagStr = function () {
        var res = "0"
        	
    	$.each(whereList, function (index, item) {
        	if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {
            	if(item.nameEn.toUpperCase() == 'SEQ_NUM' && isSeq){

                }else if(item.nameEn.toUpperCase() == 'ORG_NUM'||item.nameEn.toUpperCase() == 'SUPER_ORG_NUM') {

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
        return whereList[0].dataBaseUser+'.'+whereList[0].tableName.split('-')[0];
    }
    //where条件
    queryParams.whereStr = function () {
        var res = "1=1";
        //存放需要时间区间的字段
        var dateSection = [];
        $.each(whereList, function (index, item) {
            var val = $("#" + item.nameEn).val();
            if ((val != null && val != undefined && val != '')||item.nameEn=='SUPER_ORG_NUM'||item.nameEn=='ORG_NUM') {
                if (item.nameEn.toUpperCase() == 'CURR_CD') {//币种特殊处理
                    if (val == '01') {//人民币
                        res += " and CURR_CD='01'";
                    } else if (val == '02') {//外折人
                        res += " and CURR_CD<>'01'";
                    } else if (val == '03') {//本外币

                    }
                } else if(item.nameEn.toUpperCase() == 'NEW_CORP_SIZE_CD'){
                    if(val == 'all'){//四部委划型
                    }else{
                        res += " and "+item.nameEn+"='"+val+"'";
                    }
                }else {
                    if (item.iswhere == '1') {
                    	
                        if(item.formType =='2'&&item.nameEn.toUpperCase()=='CRDT_LMT'){
                        	var inputData = $("#inputData").val();
                        	if(inputData!=""&&inputData!=undefined){
                        		inputData = inputData +"0000";
                        		res += " and " + item.nameEn + "<='" + inputData + "'";
                        	}else{
                        		val = val +"0000";
                                res += " and " + item.nameEn + "<='" + val + "'";
                        	}
                        }
                        if(item.formType =='2'&&item.nameEn.toUpperCase()=='ASSET_BAL'){
                        	var inputData = $("#inputData").val();
                        	if(inputData!=""&&inputData!=undefined){
                        		inputData = inputData +"0000";
                        		res += " and " + item.nameEn + ">='" + inputData + "'";
                        	}else{
                        		val = val +"0000";
                                res += " and " + item.nameEn + ">='" + val + "'";
                        	}
                        }
                        if(item.formType=='1'&&(item.nameEn.toUpperCase()=='EMP_NUM'||item.nameEn.toUpperCase()=='EMP_NAME')){
                            res += " and " + item.nameEn + "='" + val + "'";
                        }
                        if (item.formType == '3') {
                            if (item.dateCode == undefined || item.dateCode == null) {
                                //非时间区间
                                res += " and " + item.nameEn + "=date'" + val + "'";
                            } else {
                                dateSection.push(item.dateCode);
                            }
                        } else if (ORG_SEARCH != null && ORG_SEARCH != undefined) {
                            if (item.nameEn.toUpperCase() == 'ORG_NUM'
                                || item.nameEn.toUpperCase() == 'SUPER_ORG_NUM'
                                || item.nameEn.toUpperCase() == 'SUPER_ORG_HIRCHY') {
                     
                                    var org_num = $('#ORG_NUM').val() == null || $('#ORG_NUM').val() == undefined ?
                                        $('#SUPER_ORG_NUM').val() : $('#ORG_NUM').val();
                                    var org_hirchy = $('#ORG_HIRCHY').val() == null|| $('#ORG_HIRCHY').val() == undefined ?
                                        $('#SUPER_ORG_HIRCHY').val(): $('#ORG_HIRCHY').val();
                                    var org_num_field = $.param.getSelectOrgNumOrgNameRef(org_hirchy, 'ORG_HIRCHY_ORG_NUM_REF');
                                    org_num_field = org_num_field == null || org_num_field == undefined ?
                                        $.param.getSelectOrgNumOrgNameRef('0' + org_hirchy, 'ORG_HIRCHY_ORG_NUM_REF') : org_num_field;
                                    if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
                                    	&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
                                    	res += " and " + org_num_field.name + " in (" + dealOrgWhere(org_num,item.nameEn) + ")";
                                    } else{
                                    	res += " and " + org_num_field.name + "='" + org_num + "'";
                                    }

                            }
                            /*else{
                                res += " and " + item.nameEn + "='" + val + "'";
                            }*/
                        } else {
                        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
                        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){

                            if (!selectLSspecial.indexOf(whereList[0].tableName) > -1
                                    &&($("#SUPER_ORG_HIRCHY").val()=='5'||$("#ORG_HIRCHY").val()=='5')) {
                                    res += " and " + "ORG_NUM" + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                }else {
                                res += " and " + item.nameEn + " in (" + dealOrgWhere(val,item.nameEn) + ")";
                            }
                        	}else{
                        		res += " and " + item.nameEn + "='" + val + "'";
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
                            res += " and " + ds + ">=date'" + v1 + "' and " + ds + "<=date'" + v2 + "'";
                        } else if (v1 != null && v1 != '' && (v2 == null || v2 == '')) {
                            res += " and " + ds + ">=date'" + v1 + "'";
                        } else if (v2 != null && v2 != '' && (v1 == null || v1 == '')) {
                            res += " and " + ds + "<=date'" + v2 + "'";
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
                if(ORG_SEARCH != null && ORG_SEARCH != undefined){
                    if (item.nameEn.toUpperCase() == 'ORG_NUM'
                        || item.nameEn.toUpperCase() == 'SUPER_ORG_NUM'
                        || item.nameEn.toUpperCase() == 'SUPER_ORG_HIRCHY') {

                        var org_num = $('#ORG_NUM').val() == null || $('#ORG_NUM').val() == undefined ?
                            $('#SUPER_ORG_NUM').val() : $('#ORG_NUM').val();
                        var org_hirchy = $('#ORG_HIRCHY').val() == null|| $('#ORG_HIRCHY').val() == undefined ?
                            $('#SUPER_ORG_HIRCHY').val():$('#ORG_HIRCHY').val();
                        var org_num_field = $.param.getSelectOrgNumOrgNameRef(org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF');
                        org_num_field = org_num_field == null || org_num_field == undefined ?
                            $.param.getSelectOrgNumOrgNameRef('0' + org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF') : org_num_field;

                        if(groupBy.indexOf(org_num_field.name)<0){

                            groupBy.push(org_num_field.name);
                        }

                        orderFieldIndex.push(item.isOrderBy);
                        var orderTmp = new Array();
                        orderTmp.push(org_num_field.name);
                        if(item.orderByType==null || item.orderByType ==undefined){
                            orderTmp.push('asc');
                        }else {
                            orderTmp.push(item.orderByType);
                        }
                        orderField[item.isOrderBy]=orderTmp;
                    }
                }else{
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

                        groupBy.push(item.nameEn);
                    }
                }

            }

        });
        
        if(whereList[0].tableName =="A_COB_MICRO_CUST_MGR_PER_TAB-GS027" ){
        	res = ' order by lev4_org_num,lev5_org_num,NEW_CORP_SIZE_CD,EMP_NUM,BIZ_BREED '
        }
        
        return res;
    }

    
    lastQueryParams = deepCopy(queryParams);

    return queryParams;
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
	if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
		var crdt = $("#CRDT_LMT").val(); 
		var inputCrdt = $("#inputData").val();
		//debugger;
		if(inputCrdt==""){		
			$('#queryTable').bootstrapTable('destroy');
		    if (queryIsPageFinder(whereList[0].tableName)) {
		        TableObj.oTableInit();
		    } else {
		        TableObjNotPage.oTableInit();
		    }
		}else{
			if(/^\d+$/.test(inputCrdt) && parseInt(inputCrdt)>=0){	
				$('#queryTable').bootstrapTable('destroy');
			    if (queryIsPageFinder(whereList[0].tableName)) {
			        TableObj.oTableInit();
			    } else {
			        TableObjNotPage.oTableInit();
			    }
			}else{
				layer.msg("授信额度为非负整数",{icon:3});
			}
		}
		
	}else if(whereList[0].tableName=="A_REB_LARGE_CHANGE_MONITOR-LS022"){
		var asset = $("#ASSET_BAL").val(); 
		var inputAsset = $("#inputData").val();
		if(inputAsset==""){
			$('#queryTable').bootstrapTable('destroy');
		    if (queryIsPageFinder(whereList[0].tableName)) {
		        TableObj.oTableInit();
		    } else {
		        TableObjNotPage.oTableInit();
		    }
		}else{
			if(/^\d+$/.test(inputAsset) && parseInt(inputAsset)>=0){
				$('#queryTable').bootstrapTable('destroy');
			    if (queryIsPageFinder(whereList[0].tableName)) {
			        TableObj.oTableInit();
			    } else {
			        TableObjNotPage.oTableInit();
			    }
			}else{
				layer.msg("变动规模为非负整数",{icon:3});
			}
		}
		
	}else{
	    $('#queryTable').bootstrapTable('destroy');
	    if (queryIsPageFinder(whereList[0].tableName)) {
	        TableObj.oTableInit();
	    } else {
	        TableObjNotPage.oTableInit();
	    }
	}
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    if(whereList[0].tableName=="A_COB_MICRO_CUST_MGR_PER_TAB-GS027"){
    	$("#CRDT_LMT").show();
    	
    }else if(whereList[0].tableName=="A_REB_LARGE_CHANGE_MONITOR-LS022"){
    	$("#ASSET_BAL").show();
    }    
	$("#selectData").show();	
	$("#inputData").hide();
	$("#inputData").val("");

	
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
}

function changeCrdt(){
	var crdt = $("#CRDT_LMT").val();
	if(crdt=="other"){
		$("#CRDT_LMT").hide();
		$("#selectData").hide();	
		$("#inputData").show();
		$("#inputData").val("0");
	}

}

function changeAsset(){
	var asset = $("#ASSET_BAL").val();
	if(asset=="other"){
		$("#ASSET_BAL").hide();
		$("#selectData").hide();	
		$("#inputData").show();
		$("#inputData").val("0");
	}
	
}
//导出
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
