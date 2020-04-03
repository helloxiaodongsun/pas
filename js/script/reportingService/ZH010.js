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
//分行合计
var gedai999999Arr = ['A_REB_LOAN_SIZE_SITU_TAB-LS034','A_REB_LOAN_SIZE_SITU_TAB-LS035','A_REB_LOAN_SIZE_SITU_TAB-LS036'
                      ,'A_COB_DPST_BAL_ORG_TAB-GS001','A_COB_DPST_BAL_ORG_TAB-GS002','A_COB_DPST_BAL_ORG_TAB-GS003'
                      ,'A_COB_LOAN_BAL_ORG_TAB-GS006','A_COB_LOAN_BAL_ORG_TAB-GS007','A_COB_LOAN_BAL_ORG_TAB-GS008'
                      ,'A_PLF_CUST_DPSIT_TAB-JC001','A_PLF_CUST_DPSIT_TAB-JC002','A_PLF_CUST_DPSIT_TAB-JC003','A_PLF_CUST_LOAN_TAB-JC004'
                      ,'A_PLF_CUST_LOAN_TAB-JC005','A_PLF_CUST_LOAN_TAB-JC006','A_PLF_CUST_AMT_FUND_TAB-JC007'
                      ];
//排序管辖行-支行
var orderOrgNum = ['A_PLF_OPRR_PURE_CORP_MDL_BIZ_INCOM-JC011','A_PLF_OPRR_ALL_CORP_MDL_BIZ_INCOM-JC012','A_PLF_OPRR_MDL_BIZ_TWO_ACCM_INCOM-JC013'];
//默认分页最多50行
var pageSizeMax = ['A_INS_Y_NEW_REB_CUST_PER_TAB-ZH006','A_INS_Y_NEW_COB_CUST_PER_TAB-ZH007','A_INS_ORG_REB_CUST_PER_TAB-ZH008'
                   ,'A_INS_ORG_COB_CUST_PER_TAB-ZH009','A_INS_EMP_CORP_PER_TAB_CUST-ZH010','A_COB_CUST_MGR_PER_RK_TAB-ZH012'
                   ,'A_REB_CUST_MGR_PER_RK_TAB-ZH013','A_COB_TEM_PER_RK_TAB-ZH014','A_REB_CUST_CONTR_RK_TAB-ZH015','A_COB_CUST_CONTR_RK_TAB-ZH016'];
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
var href="";
var levelorgcount=-1;
var lastQueryParams;
var isCustMgr ="";
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
    $('#tableNameCn').text(whereList[0].tableNameCn);

    createHtml();
    createJs();
    isCustMgr = $.param.getEmpRole(empNum,mid);
    if(isCustMgr=="1"){
        $("#EMP_ID").val(empNum);
        $("#EMP_ID").attr("disabled","true");
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
		            	var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>"+s[i].table_NOTE+"</td></tr>";
		            	$("#noteList").append(trHtml);
	            	}
	            	$("#noteList .no-records-found").hide();
            	}
            	
            	
            	
               
            }
    });

    //初始化查询是否存在补录报表
    $.ajax({
        url: portal.bp() + '/table/queryIsReplenish',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {
            'tableName': whereList[0].tableName,
            'mid':mid
        },
        cache: false,
        success: function (data) {
            var s = data.data;
            if(s.length == 0){
                $("#bulu").hide();
               
            }else{
                for(var i = 0;i<s.length;i++){
                    //console.log(s[i].replenUrl);
                     $("#urla").attr("href",portal.bp()+s[i].replenUrl);
                    // href = portal.bp()+s[i].replenUrl;
                }

            }




        }
    });
    
    /*$("#urla").click(function(){
       window.location.href=href;
	});*/
    
    
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
        		html += '<div class="input-group"><input type="text" class="form-control"  id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/><div class="input-group-addon">万以下</div></div>';
            }else if(item.nameEn=="ASSET_BAL"){//大额变动规模
            	html += '<div class="input-group"><input type="text" class="form-control"  id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/><div class="input-group-addon">万以上</div></div>';
            }else{
/*            	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/                html += '<input type="text"  class="form-control"  id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
            }
        } else if (item.formType == '2') {
        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT'){
        		//机构号机构层级部分多选
        		html += '<select multiple="multiple" data-actions-box="true"  class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
         	}else{
        		html += '<select class="selectpicker show-tick form-control" data-live-search="true" title="' + item.nameCn + '" id="' + item.nameEn + '" name="' + item.nameEn + '" ></select>';
        	}
            
        } else if (item.formType == '3') {
/*        	html += '<div style="position:absolute;right:16px;top:-2px;cursor:pointer;display:none;" class="input_clear"><button type="button" class="close" data-dismiss="modle" aria-hidden="true"><i class="fa fa-times-circle">x</i></button></div>';
*/
            html += '<input type="text" class="form-control date-dt" id="' + item.nameEn + '" name="' + item.nameEn + '" placeholder="' + item.nameCn + '"/>';
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
				if(document.getElementById(eleId)&&document.getElementById(eleId).options)
					document.getElementById(eleId).options.selectedIndex = 0;
				$("#"+eleId).selectpicker('refresh');
				if(selectAllTables.indexOf(whereList[0].tableName)>-1){
					//全选
					$("#"+eleId).selectpicker('selectAll');
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
// 分页查询列表
var TableObj = {
    oTableInit: function () {
        var tjkj = $("#TJKJ").val();
        var tableType = whereList[0].tableName
        if (tjkj != undefined && tjkj != null && tjkj != '' && tjkj != 'undefined') {
            tableType += '-' + tjkj;
        }
        var columns = $.param.getTableHeaderByType(tableType);
        var size,size1,size2;
        if(pageSizeMax.indexOf(whereList[0].tableName)>-1){
        	size = 50;
        	size1 = 25;
        	size2 = 50;
        }else{
        	size = 100;
        	size1 = 50;
        	size2 = 100;
        }
        $('#queryTable').bootstrapTable({
            url: portal.bp() + '/table/ZH010/query',
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
            pageSize: size,      //每页的记录行数（*）
            pageList: [size1,size2],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
          //  height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {          
            	deal999999($("#queryTable"));
                countFormat();
            	
                $('#queryTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });        
                var sum1 = 0;var sum2 = 0;var sum3 = 0;var sum4 = 0;var sum5 = 0;
            	var sum6 = 0;var sum7 = 0;var sum8 = 0;var sum9 = 0;var sum10 = 0;
            	var sum11 = 0;var sum12 = 0;var sum13 = 0;var sum14 = 0;var sum15 = 0;
            	var sum16 = 0;var sum17 = 0;var sum18 = 0;var sum19 = 0;var sum20 = 0;
            	var sum21 = 0;var sum22 = 0;var sum23 = 0;var sum24 = 0;var sum25 = 0;
            	var sum26 = 0;var sum27 = 0;var sum28 = 0;var sum29 = 0;var sum30 = 0;
            	var sum31 = 0;var sum32 = 0;var sum33 = 0;var sum34 = 0;var sum35 = 0;
            	var sum36 = 0;var sum37 = 0;var sum38 = 0;var sum39 = 0;var sum40 = 0;
            	var sum41 = 0;var sum42 = 0;var sum43 = 0;var sum44 = 0;var sum45 = 0;
            	var sum46 = 0;var sum47 = 0;var sum48 = 0;var sum49 = 0;var sum50 = 0;
            	var sum51 = 0;var sum52 = 0;var sum53 = 0;var sum54 = 0;var sum55 = 0;
            	for(var i in data.rows){
            		sum1=parseFloat(sum1)+parseFloat(data.rows[i].curr_dpst_pnt==null?0:data.rows[i].curr_dpst_pnt);
            		sum2=parseFloat(sum2)+parseFloat(data.rows[i].curr_dpst_y_daily==null?0:data.rows[i].curr_dpst_y_daily);
            		sum3=parseFloat(sum3)+parseFloat(data.rows[i].curr_dpst_ftp_ass_prft==null?0:data.rows[i].curr_dpst_ftp_ass_prft);
            		sum4=parseFloat(sum4)+parseFloat(data.rows[i].time_dpst_pnt==null?0:data.rows[i].time_dpst_pnt);
            		sum5=parseFloat(sum5)+parseFloat(data.rows[i].time_dpst_y_daily==null?0:data.rows[i].time_dpst_y_daily);
            		sum6=parseFloat(sum6)+parseFloat(data.rows[i].time_dpst_ftp_ass_prft==null?0:data.rows[i].time_dpst_ftp_ass_prft);
            		sum7=parseFloat(sum7)+parseFloat(data.rows[i].stru_dpst_pnt==null?0:data.rows[i].stru_dpst_pnt);
            		sum8=parseFloat(sum8)+parseFloat(data.rows[i].stru_dpst_y_daily==null?0:data.rows[i].stru_dpst_y_daily);
            		sum9=parseFloat(sum9)+parseFloat(data.rows[i].stru_dpst_ftp_ass_prft==null?0:data.rows[i].stru_dpst_ftp_ass_prft);
            		sum10=parseFloat(sum10)+parseFloat(data.rows[i].advise_dpst_pnt==null?0:data.rows[i].advise_dpst_pnt);
            		sum11=parseFloat(sum11)+parseFloat(data.rows[i].advise_dpst_y_daily==null?0:data.rows[i].advise_dpst_y_daily);
            		sum12=parseFloat(sum12)+parseFloat(data.rows[i].advise_dpst_ftp_ass_prft==null?0:data.rows[i].advise_dpst_ftp_ass_prft);
            		sum13=parseFloat(sum13)+parseFloat(data.rows[i].dmnd_margin_pnt==null?0:data.rows[i].dmnd_margin_pnt);
            		sum14=parseFloat(sum14)+parseFloat(data.rows[i].dmnd_margin_y_daily==null?0:data.rows[i].dmnd_margin_y_daily);
            		sum15=parseFloat(sum15)+parseFloat(data.rows[i].dmnd_margin_ftp_ass_prft==null?0:data.rows[i].dmnd_margin_ftp_ass_prft);
            		sum16=parseFloat(sum16)+parseFloat(data.rows[i].time_margin_pnt==null?0:data.rows[i].time_margin_pnt);
            		sum17=parseFloat(sum17)+parseFloat(data.rows[i].time_margin_y_daily==null?0:data.rows[i].time_margin_y_daily);
            		sum18=parseFloat(sum18)+parseFloat(data.rows[i].time_margin_ftp_ass_prft==null?0:data.rows[i].time_margin_ftp_ass_prft);
            		sum19=parseFloat(sum19)+parseFloat(data.rows[i].brk_evn_fin_pnt==null?0:data.rows[i].brk_evn_fin_pnt);
            		sum20=parseFloat(sum20)+parseFloat(data.rows[i].brk_evn_fin_y_daily==null?0:data.rows[i].brk_evn_fin_y_daily);
            		sum21=parseFloat(sum21)+parseFloat(data.rows[i].brk_evn_fin_ftp_ass_prft==null?0:data.rows[i].brk_evn_fin_ftp_ass_prft);
            		sum22=parseFloat(sum22)+parseFloat(data.rows[i].dpst_size_pnt==null?0:data.rows[i].dpst_size_pnt);
            		sum23=parseFloat(sum23)+parseFloat(data.rows[i].dpst_size_y_daily==null?0:data.rows[i].dpst_size_y_daily);
            		sum24=parseFloat(sum24)+parseFloat(data.rows[i].dpst_size_ftp_ass_prft==null?0:data.rows[i].dpst_size_ftp_ass_prft);
            		sum25=parseFloat(sum25)+parseFloat(data.rows[i].stln_pnt==null?0:data.rows[i].stln_pnt);
            		sum26=parseFloat(sum26)+parseFloat(data.rows[i].stln_y_daily==null?0:data.rows[i].stln_y_daily);
            		sum27=parseFloat(sum27)+parseFloat(data.rows[i].stln_ftp_ass_prft==null?0:data.rows[i].stln_ftp_ass_prft);
            		sum28=parseFloat(sum28)+parseFloat(data.rows[i].mlln_pnt==null?0:data.rows[i].mlln_pnt);
            		sum29=parseFloat(sum29)+parseFloat(data.rows[i].mlln_y_daily==null?0:data.rows[i].mlln_y_daily);
            		sum30=parseFloat(sum30)+parseFloat(data.rows[i].mlln_ftp_ass_prft==null?0:data.rows[i].mlln_ftp_ass_prft);
            		sum31=parseFloat(sum31)+parseFloat(data.rows[i].tdfn_pnt==null?0:data.rows[i].tdfn_pnt);
            		sum32=parseFloat(sum32)+parseFloat(data.rows[i].tdfn_y_daily==null?0:data.rows[i].tdfn_y_daily);
            		sum33=parseFloat(sum33)+parseFloat(data.rows[i].tdfn_ftp_ass_prft==null?0:data.rows[i].tdfn_ftp_ass_prft);
            		sum34=parseFloat(sum34)+parseFloat(data.rows[i].cgfn_pnt==null?0:data.rows[i].cgfn_pnt);
            		sum35=parseFloat(sum35)+parseFloat(data.rows[i].cgfn_y_daily==null?0:data.rows[i].cgfn_y_daily);
            		sum36=parseFloat(sum36)+parseFloat(data.rows[i].cgfn_ftp_ass_prft==null?0:data.rows[i].cgfn_ftp_ass_prft);
            		sum37=parseFloat(sum37)+parseFloat(data.rows[i].discount_pnt==null?0:data.rows[i].discount_pnt);
            		sum38=parseFloat(sum38)+parseFloat(data.rows[i].discount_y_daily==null?0:data.rows[i].discount_y_daily);
            		sum39=parseFloat(sum39)+parseFloat(data.rows[i].discount_ftp_ass_prft==null?0:data.rows[i].discount_ftp_ass_prft);
            		sum40=parseFloat(sum40)+parseFloat(data.rows[i].buy_bill_pnt==null?0:data.rows[i].buy_bill_pnt);
            		sum41=parseFloat(sum41)+parseFloat(data.rows[i].buy_bill_y_daily==null?0:data.rows[i].buy_bill_y_daily);
            		sum42=parseFloat(sum42)+parseFloat(data.rows[i].buy_bill_ftp_ass_prft==null?0:data.rows[i].buy_bill_ftp_ass_prft);
            		sum43=parseFloat(sum43)+parseFloat(data.rows[i].dmt_lc_fin_pnt==null?0:data.rows[i].dmt_lc_fin_pnt);
            		sum44=parseFloat(sum44)+parseFloat(data.rows[i].dmt_lc_fin_y_daily==null?0:data.rows[i].dmt_lc_fin_y_daily);
            		sum45=parseFloat(sum45)+parseFloat(data.rows[i].dmt_lc_fin_ftp_ass_prft==null?0:data.rows[i].dmt_lc_fin_ftp_ass_prft);
            		sum46=parseFloat(sum46)+parseFloat(data.rows[i].loan_sum_pnt==null?0:data.rows[i].loan_sum_pnt);
            		sum47=parseFloat(sum47)+parseFloat(data.rows[i].loan_sum_y_daily==null?0:data.rows[i].loan_sum_y_daily);
            		sum48=parseFloat(sum48)+parseFloat(data.rows[i].loan_sum_ftp_ass_prft==null?0:data.rows[i].loan_sum_ftp_ass_prft);
            		sum49=parseFloat(sum49)+parseFloat(data.rows[i].ovdue_loan_pnt_bal==null?0:data.rows[i].ovdue_loan_pnt_bal);
            		sum50=parseFloat(sum50)+parseFloat(data.rows[i].trd_bank_mdl_biz_incom==null?0:data.rows[i].trd_bank_mdl_biz_incom);
            		sum51=parseFloat(sum51)+parseFloat(data.rows[i].inv_line_mdl_biz_incom==null?0:data.rows[i].inv_line_mdl_biz_incom);
            		sum52=parseFloat(sum52)+parseFloat(data.rows[i].inter_mdl_biz_incom==null?0:data.rows[i].inter_mdl_biz_incom);
            		sum53=parseFloat(sum53)+parseFloat(data.rows[i].ibank_mdl_biz_incom==null?0:data.rows[i].ibank_mdl_biz_incom);
            		sum54=parseFloat(sum54)+parseFloat(data.rows[i].mdl_biz_incom_sum==null?0:data.rows[i].mdl_biz_incom_sum);
            		sum55=parseFloat(sum55)+parseFloat(data.rows[i].prft_sum==null?0:data.rows[i].prft_sum);

            	}
            	var rows = [];
            	rows.push({
            		org_code:"合计",
            		curr_dpst_pnt:sum1.toFixed(2),
            		curr_dpst_y_daily:sum2.toFixed(2),
            		curr_dpst_ftp_ass_prft:sum3.toFixed(2),
            		time_dpst_pnt:sum4.toFixed(2),
            		time_dpst_y_daily:sum5.toFixed(2),
            		time_dpst_ftp_ass_prft:sum6.toFixed(2),
            		stru_dpst_pnt:sum7.toFixed(2),
            		stru_dpst_y_daily:sum8.toFixed(2),
            		stru_dpst_ftp_ass_prft:sum9.toFixed(2),
            		advise_dpst_pnt:sum10.toFixed(2),
            		advise_dpst_y_daily:sum11.toFixed(2),
            		advise_dpst_ftp_ass_prft:sum12.toFixed(2),
            		dmnd_margin_pnt:sum13.toFixed(2),
            		dmnd_margin_y_daily:sum14.toFixed(2),
            		dmnd_margin_ftp_ass_prft:sum15.toFixed(2),
            		time_margin_pnt:sum16.toFixed(2),
            		time_margin_y_daily:sum17.toFixed(2),
            		time_margin_ftp_ass_prft:sum18.toFixed(2),
            		brk_evn_fin_pnt:sum19.toFixed(2),
            		brk_evn_fin_y_daily:sum20.toFixed(2),
            		brk_evn_fin_ftp_ass_prft:sum21.toFixed(2),
            		dpst_size_pnt:sum22.toFixed(2),
            		dpst_size_y_daily:sum23.toFixed(2),
            		dpst_size_ftp_ass_prft:sum24.toFixed(2),
            		stln_pnt:sum25.toFixed(2),
            		stln_y_daily:sum26.toFixed(2),
            		stln_ftp_ass_prft:sum27.toFixed(2),
            		mlln_pnt:sum28.toFixed(2),
            		mlln_y_daily:sum29.toFixed(2),
            		mlln_ftp_ass_prft:sum30.toFixed(2),
            		tdfn_pnt:sum31.toFixed(2),
            		tdfn_y_daily:sum32.toFixed(2),
            		tdfn_ftp_ass_prft:sum33.toFixed(2),
            		cgfn_pnt:sum34.toFixed(2),
            		cgfn_y_daily:sum35.toFixed(2),
            		cgfn_ftp_ass_prft:sum36.toFixed(2),
            		discount_pnt:sum37.toFixed(2),
            		discount_y_daily:sum38.toFixed(2),
            		discount_ftp_ass_prft:sum39.toFixed(2),
            		buy_bill_pnt:sum40.toFixed(2),
            		buy_bill_y_daily:sum41.toFixed(2),
            		buy_bill_ftp_ass_prft:sum42.toFixed(2),
            		dmt_lc_fin_pnt:sum43.toFixed(2),
            		dmt_lc_fin_y_daily:sum44.toFixed(2),
            		dmt_lc_fin_ftp_ass_prft:sum45.toFixed(2),
            		loan_sum_pnt:sum46.toFixed(2),
            		loan_sum_y_daily:sum47.toFixed(2),
            		loan_sum_ftp_ass_prft:sum48.toFixed(2),
            		ovdue_loan_pnt_bal:sum49.toFixed(2),
            		trd_bank_mdl_biz_incom:sum50.toFixed(2),
            		inv_line_mdl_biz_incom:sum51.toFixed(2),
            		inter_mdl_biz_incom:sum52.toFixed(2),
            		ibank_mdl_biz_incom:sum53.toFixed(2),
            		mdl_biz_incom_sum:sum54.toFixed(2),
            		prft_sum:sum55.toFixed(2)
            	});
            	$("#queryTable").bootstrapTable('append',rows);
            	var length = $("#queryTable").bootstrapTable("getData").length;
            	$("#queryTable").bootstrapTable('mergeCells',{index:length-1,field:"org_code",colspan:1,rowspan:1});
            	resizeTables();
            },
            columns: columns,
            rowStyle:rowStyle

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
            url: portal.bp() + '/table/ZH010/queryNoPage',
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
    var isSeq = false;
    var isOrgNum = false;
    var currCdVal = "";
    var isDisplay = "";
    var isDisplayPntBal = "";
    var isCntnNp = "";
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
            if (item.isOrderBy != undefined && item.isOrderBy != null && item.isOrderBy != 0) {                
            	if(item.nameEn.toUpperCase() == 'SEQ_NUM' && isSeq){

                }else if(item.nameEn.toUpperCase() == 'ORG_NUM'||item.nameEn.toUpperCase() == 'SUPER_ORG_NUM'){
                    isOrgNum=true;
                }else{
                    res += ',' +item.nameEn;
                    groupBy.push(item.nameEn);
                }
            }
            if(item.nameEn.toUpperCase()=='CURR_CD'){
            	currCdVal = $("#" + item.nameEn).val();
            }
            if(item.nameEn.toUpperCase()=='WHETHER_DISPLAY_TOTAL'){
            	isDisplay = $("#" + item.nameEn).val();
            }
            if(item.nameEn.toUpperCase()=='WHETHER_DISPLAY_BALANCE'){
            	isDisplayPntBal = $("#" + item.nameEn).val();
            }
            
            if(item.nameEn=='IS_Cntn_NP'){
            	isCntnNp = $("#" + item.nameEn).val();
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

                     	res += ', sum(' + item.field+') as '+item.field;

                	}else{
                		//字段脱敏
                        res += remSensitive(item);
                        groupBy.push(item.field);
	                        
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

                       /* var org_num = $('#ORG_NUM').val() == null || $('#ORG_NUM').val() == undefined ?
                            $('#SUPER_ORG_NUM').val() : $('#ORG_NUM').val();*/
                        var org_hirchy = $('#ORG_HIRCHY').val() == null|| $('#ORG_HIRCHY').val() == undefined ?
                            $('#SUPER_ORG_HIRCHY').val():$('#ORG_HIRCHY').val();
                        var org_num_field = $.param.getSelectOrgNumOrgNameRef(org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF');
                        org_num_field = org_num_field == null || org_num_field == undefined ?
                            $.param.getSelectOrgNumOrgNameRef('0' + org_hirchy, 'ORG_HIRCHY_ORG_NAME_REF') : org_num_field;
                        if(groupBy.indexOf(org_num_field.name.toLowerCase())<0){
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
                    if(groupBy.indexOf(item.nameEn.toLowerCase())<0){
                        groupBy.push(item.nameEn);
                    }
                }

            }


        });

        if(orderOrgNum.indexOf(whereList[0].tableName)>-1){       	      
	        res = ' order by lev4_org_num,lev5_org_num '
        }else{
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
        }
        return res;
    }


    //where条件
    queryParams.whereStr = function () {
        var res = "1=1";
        //存放需要时间区间的字段
        var dateSection = [];
        var flag = true;
        $.each(whereList, function (index, item) {
            flag = true;
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
                }else if(item.nameEn.toUpperCase() == 'CAPT_QTTY_PER_STAT_CALI'){
                	if(val=='001'){
                		res += " and CAPT_QTTY_PER_STAT_CALI in ('001','999') "
                	}else if(val=='002'){
                		res += " and CAPT_QTTY_PER_STAT_CALI in ('002','999') "
                	}
                }else {
                    if (item.iswhere == '1') {
                        if (item.formType == '3') {
                            if (item.dateCode == undefined || item.dateCode == null) {
                                //非时间区间
                                res += " and " + item.nameEn + "=date'" + val + "'";
                            } else {
                                dateSection.push(item.dateCode);
                            }
                        } else if (ORG_SEARCH != null && ORG_SEARCH != undefined) {
                            if (item.nameEn.toUpperCase() == 'ORG_NUM'
                            	|| item.nameEn.toUpperCase() == 'ORG_HIRCHY'
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
                                    	if(gedai999999Arr.indexOf(whereList[0].tableName)>-1&&($("#SUPER_ORG_HIRCHY").val()=='2'||$("#ORG_HIRCHY").val()=='2')){
                                    		res += " and (SUPER_ORG_NUM in ("+ dealOrgWhere(org_num,item.nameEn) +") or (SUPER_ORG_NUM in ('999999') and ORG_NUM in (" + dealOrgWhere(org_num,item.nameEn) + ")))";
                                    	}else if (!selectLSspecial.indexOf(whereList[0].tableName) > -1
                                            &&($("#SUPER_ORG_HIRCHY").val()=='5'||$("#ORG_HIRCHY").val()=='5')) {
                                            res += " and " + org_num_field.name + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                        }else{
                                    		res += " and " + org_num_field.name + " in (" + dealOrgWhere(org_num,item.nameEn) + ")";
                                    	}
                                    }
                                

                            }else{

                                if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
                                    &&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT') {

                                    if (gedai999999Arr.indexOf(whereList[0].tableName)>-1
                                        &&($("#SUPER_ORG_HIRCHY").val()=='2'
                                            ||$("#ORG_HIRCHY").val()=='2')) {
                                        res += " and (SUPER_ORG_NUM in ("+ dealOrgWhere(val, item.nameEn) +") or (SUPER_ORG_NUM in ('999999') and ORG_NUM in (" + dealOrgWhere(val, item.nameEn) + ")))";
                                    } else if (!selectLSspecial.indexOf(whereList[0].tableName) > -1
                                        &&($("#SUPER_ORG_HIRCHY").val()=='5'||$("#ORG_HIRCHY").val()=='5')) {
                                        res += " and " + "ORG_NUM" + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                    } else {
                                        res += " and " + item.nameEn + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                    }

                                }else {
                                    res += " and " + item.nameEn + "='" + val + "'";
                                }
                            }
                        }else {
                        	if(orgMap.hasOwnProperty(item.nameEn.toUpperCase())
                        			&&item.codeParent!=null&&item.codeParent.toUpperCase()=='ORG_REPORT') {

                                    if (gedai999999Arr.indexOf(whereList[0].tableName)>-1
                                        &&($("#SUPER_ORG_HIRCHY").val()=='2'
                                            ||$("#ORG_HIRCHY").val()=='2')) {
                                        res += " and (SUPER_ORG_NUM in ("+ dealOrgWhere(val, item.nameEn) +") or (SUPER_ORG_NUM in ('999999') and ORG_NUM in (" + dealOrgWhere(val, item.nameEn) + ")))";
                                    } else if (!selectLSspecial.indexOf(whereList[0].tableName) > -1
                                        &&($("#SUPER_ORG_HIRCHY").val()=='5'||$("#ORG_HIRCHY").val()=='5')) {
                                        res += " and " + "ORG_NUM" + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                    } else {
                                        res += " and " + item.nameEn + " in (" + dealOrgWhere(val, item.nameEn) + ")";
                                    }

                            }else {
                                res += " and " + item.nameEn + "='" + val + "'";
                            }

                        }
                    }
                }
            }
        });
        if(isDisplay=='0'){
        	 res += "and (REG_LINE_NUM='999999' OR seq_num='1')";
        }
        //是否展示时点余额为0数据
        if(isDisplayPntBal=='0'){
        	res+="and PNT_BAL = 0 "
        }else if(isDisplayPntBal=='1'){
        	res+="and PNT_BAL <> 0 "
        }else{        	
        }
        //是否包含不良
        if(isCntnNp =='0'){
        	res+="and IS_Cntn_NP = 0 "
        }else if(isCntnNp=='1'){
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


    lastQueryParams = deepCopy(queryParams);
    return queryParams;
}

//查询
function query() {
	if($("#ORG_NUM").length>0){
		if($("#ORG_NUM").val()==undefined||$("#ORG_NUM").val()==null||$("#ORG_NUM").val()==null){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
	if($("#SUPER_ORG_NUM").length>0){
		if($("#SUPER_ORG_NUM").val()==undefined||$("#SUPER_ORG_NUM").val()==null||$("#SUPER_ORG_NUM").val()==null){
			layer.msg("机构必选",{icon:3});
			return;
		}
	}
    $('#queryTable').bootstrapTable('destroy');
    if (queryIsPageFinder(whereList[0].tableName)) {
        TableObj.oTableInit();
    } else {
        TableObjNotPage.oTableInit();
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