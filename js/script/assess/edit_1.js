//考核对象类型
var objListMap = {};
var assPropNumSeq = "";
//考核对象类型对应机构
var obj_jg = ['01','02','03'];
//考核对象类型对应团队
var obj_td = ['04'];
//默认选中机构ID
var checkOrgId = '';
//本人所在分行机构ID
var branchOrgId = '';
$(function(){
	addValidator();
	initSuperOrgName();
	
	var step1=new SetStep({
        content:'.stepCont1',
        textMaxWidth:120,
        steps:['方案基本信息','选择考核对象','选择考核指标','指标分配'],
        stepCounts:4,
        curStep:1,
    })
	
	$("#assYear").datetimepicker({
		language:"zh-CN",
		format:"yyyy",
		minView:4,
		startView:4,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	});
	$("#assYear").val(new Date().Format("yyyy"));
	
	$("#effDt").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		startView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	}).on('changeDate',function(ev){
		var effDt = $("#effDt").val();
		$('#invalidDt').datetimepicker('setStartDate',effDt);
		$("#effDt").datetimepicker('hide');
	});
	$("#invalidDt").datetimepicker({
		language:"zh-CN",
		format:"yyyy-mm-dd",
		minView:2,
		startView:2,
		autoclose:true,
		todayBtn:true,
		clearBtn:false,
	}).on('changeDate',function(){
		var effDt = $("#effDt").val();
		var invalidDt = $("#invalidDt").val();
		if(effDt!=''&&invalidDt!=''){
			/*if(!checkEndTime(effDt,invalidDt)){
				alert("开始时间大于结束时间");
				return;
			}*/
		}
		$('#effDt').datetimepicker('setEndDate',invalidDt);
		$("#invalidDt").datetimepicker('hide');
	});
	
	
	initBelongOrgId();
	initprop_obj_list();
	
	$("#iszhdf").change(function(){
    	if($(this).val()=='0'){
    		$("#professionTypeDIV").show();
    	}else{
    		$("#professionTypeDIV").hide();
    	}
    });
	
    $("#charCnfgFlg").html("").append($.param.getSelectOptionOrder("YESORNO"));
    $('#charCnfgFlg').selectpicker('refresh');
    
    $("#iszhdf").html("").append($.param.getSelectOptionOrder("YESORNO"));
    $('#iszhdf').selectpicker('val','1').change().selectpicker('refresh');
    
    $("#professionType").html("").append($.param.getSelectOptionOrder("PROFESSION_TYPE")).selectpicker('refresh');
    document.getElementById("professionType").options.selectedIndex = 1;
	$("#professionType").selectpicker('refresh');
    
    $('#assPropTypeCd').change(function(){
    	changeProp($(this).val());
    	if($(this).val()=='01'){
    		//规范性考核方案系统自动获取生效日期和失效日期，为考核年份的1月1日至12月31日
    		var year = $("#assYear").val();
    		if(year!=undefined&&year!=null&&year!=''){
    			$("#effDt").val(year+"-01-01").change();
    			$("#invalidDt").val(year+"-12-31").change();
    		}
    		$("#effDt").attr("disabled","disabled");
			$("#invalidDt").attr("disabled","disabled");
			$("#assYearDIV").show();
			
			//规范性考核方案-分行部室综合员 机构默认为所在分行，不可更改
			$('#belongOrg').selectpicker('val',branchOrgId);
			if($('#belongOrg').val()==branchOrgId){
				$('#belongOrg').selectpicker('val',branchOrgId).change()
				.prop('disabled',true).selectpicker('refresh');
			}else{
				$('#belongOrg').selectpicker('val',checkOrgId).change()
				.prop('disabled',false).selectpicker('refresh');
			}
			//$('#belongOrg').prop('disabled',false).selectpicker('refresh');
    	}else if($(this).val()=='02'){
    		//劳动竞赛考核方案-机构默认选择本人所在机构，不可更改(方便审批权限机构为本人所在机构)
    		$('#belongOrg').selectpicker('val',checkOrgId).change()
    				.prop('disabled',true).selectpicker('refresh');
    		
    		$("#effDt").removeAttr("disabled");
    		$("#invalidDt").removeAttr("disabled");
    		$("#assYearDIV").hide();
    	}else{
    		$("#effDt").removeAttr("disabled");
    		$("#invalidDt").removeAttr("disabled");
    		$("#assYearDIV").hide();
    		$('#belongOrg').prop('disabled',false).selectpicker('refresh');
    	}
    	
    	changeIsZHDF();
    });
    $("#assYear").change(function(){
    	var assPropType = $('#assPropTypeCd').val();
    	if(assPropType!=undefined&&assPropType!=null&&assPropType=='01'){
    		//规范性考核方案系统自动获取生效日期和失效日期，为考核年份的1月1日至12月31日
    		var year = $("#assYear").val();
    		if(year!=undefined&&year!=null&&year!=''){
    			$("#effDt").val(year+"-01-01").change();
    			$("#invalidDt").val(year+"-12-31").change();
    		}
    		$("#effDt").attr("disabled","disabled");
			$("#invalidDt").attr("disabled","disabled");
    	}else{
    		$("#effDt").removeAttr("disabled");
    		$("#invalidDt").removeAttr("disabled");
    	}
    })
    $('#assObjTypeCd').change(function(){
    	if(assPropNumSeq==''){
    		assPropNumSeq = getassPropNumSeq();
    	}
    	var assPropType = $('#assPropTypeCd').val();
    	var assObjType = $(this).val();
    	var assPropNum = "";
    	if(assPropType=='01'){
    		//规范性考核方案
    		if(obj_jg.indexOf(assObjType)>-1){
    			//机构
    			assPropNum = 'NO'+assPropNumSeq;
    		}else if(obj_td.indexOf(assObjType)>-1){
    			//团队
    			assPropNum = 'NT'+assPropNumSeq;
    		}else{
    			//个人
    			assPropNum = 'NP'+assPropNumSeq;
    		}
    	}else if(assPropType=='02'){
    		//劳动竞赛考核方案
    		if(obj_jg.indexOf(assObjType)>-1){
    			//机构
    			assPropNum = 'WO'+assPropNumSeq;
    		}else if(obj_td.indexOf(assObjType)>-1){
    			//团队
    			assPropNum = 'WT'+assPropNumSeq;
    		}else{
    			//个人
    			assPropNum = 'WP'+assPropNumSeq;
    		}
    	}else if(assPropType=='03'){
    		//试算考核方案
    		if(obj_jg.indexOf(assObjType)>-1){
    			//机构
    			assPropNum = 'TO'+assPropNumSeq;
    		}else if(obj_td.indexOf(assObjType)>-1){
    			//团队
    			assPropNum = 'TT'+assPropNumSeq;
    		}else{
    			//个人
    			assPropNum = 'TP'+assPropNumSeq;
    		}
    	}
    	$("#assPropNum").val(assPropNum).change();
    	
    	changeIsZHDF();
    });
    
    
    
    initBasicInfoMgmt();
    
});
function initSuperOrgName(){
	$.ajax({
		url : portal.bp() + '/org/findSuperOrg',
		dataType:'json',
		cache:false,
		async: false,
		data:{},
		type:'get',
		success : function(d) {
			if(d.code=='200'){
				if(d.data){
					branchOrgId = d.data.ID;
				}
			}else{
				layer.msg(d.message,{icon:2});
			}
		}
	});
}
function changeIsZHDF(){
	var propType = $("#assPropTypeCd").val();
	var objType  = $("#assObjTypeCd").val();
	if(propType=='01'&&obj_jg.indexOf(objType)>-1){
		//规范性考核方案，考核对象类型为分行，管辖行，支行3种情况时可选，并且是必填的
		$("#iszhdfDIV").show();
		if($("#iszhdf").val()=='0'){
			$("#professionTypeDIV").show();
		}else{
			$("#professionTypeDIV").hide();
		}
	}else{
		$("#iszhdfDIV").hide();
		$("#professionTypeDIV").hide();
	}
}
function next(){
	//表单校验
    var bootstrapValidator = $("#formSearch").data('bootstrapValidator');
    bootstrapValidator.updateStatus('assObjTypeCd','NOT_VALIDATED').validateField('assObjTypeCd');
    bootstrapValidator.validate();
    if (!bootstrapValidator.isValid())
        return;
    
    var data = {
    		'belongOrg':$("#belongOrg").val(),
    		'assPropTypeCd':$("#assPropTypeCd").val(),
    		'assObjTypeCd':$("#assObjTypeCd").val(),
    		'assPropNum':$("#assPropNum").val(),
    		'assPropName':$("#assPropName").val(),
    		'charCnfgFlg':$("#charCnfgFlg").val(),
    		'effDt':$("#effDt").val(),
    		'invalidDt':$("#invalidDt").val(),
    		'opeType':operateType,
    		'isValid':isValid,
    }
    if($("#assPropTypeCd").val()=='01'){
    	//规范性考核方案取考核年份
    	data.assYear = $("#assYear").val();
    	if(obj_jg.indexOf($("#assObjTypeCd").val())>-1){
    		data.iszhdf = $("#iszhdf").val();
    		if($("#iszhdf").val()=='0'){
    			data.professionType = $("#professionType").val();
    		}
    	}
    }
    /*if(basicPkId!=undefined&&basicPkId!=null&&basicPkId!=''){
		data.pkId = basicPkId;
	}*/
    $.ajax({
        url: portal.bp() + '/assess/saveBasicInfo?r='+Math.random(),
        type: 'post',
        async: false,
        data:data,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	assPropNum = data.data;
        	window.location.href=portal.bp()+"/assess/edit_2?assPropNum="+assPropNum+"&operateType="+operateType;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
    
}
function prev(){
	if(operateType=='2'){
		//修改
		window.location.href=portal.bp()+ "/assess/index?mid=2100";
	}else{
		window.location.href=portal.bp()+ "/assess/edit_1?operateType=1";
	}
}
function initprop_obj_list(){
	$.ajax({
        url: portal.bp() + '/assess/obj_prop_post_list?r='+Math.random(),
        type: 'get',
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var html = "";
        	var propList = data.data.propList;
        	$.each(propList,function(index,item){
        		html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
        	});
        	$("#assPropTypeCd").html(html);
            $('#assPropTypeCd').selectpicker('refresh');
            objListMap = data.data.objListMap;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function changeProp(prop){
	var list = eval('objListMap.val'+prop);
	var html = "";
	if(list!=undefined&&list!=null&&list.length>0){
		$.each(list,function(index,item){
			html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
		});
	}
	$("#assObjTypeCd").html(html);
    $('#assObjTypeCd').selectpicker('refresh');
}
/**
 * 初始化机构列表
 */
function initBelongOrgId(){
	var html = "";
	$.ajax({
        url: portal.bp() + '/assess/belongorg?r='+Math.random(),
        type: 'get',
        async: false,
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	checkOrgId = data.data.checkOrgId;
        	$.each(data.data.orgList,function(index,item){
                html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
        	});
            $('#belongOrg').html(html);
            $('#belongOrg').selectpicker('refresh')
            				.selectpicker('val',checkOrgId).change();
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function getassPropNumSeq(){
	var temp = "";
	$.ajax({
        url: portal.bp() + '/assess/getAssId?r='+Math.random(),
        type: 'get',
        async: false,
        data:{},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	temp = data.data.assPropNum;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
	return temp;
}
function checkEndTime(startDate,endDate){
	var start = startDate.replace(/-/g,'');
	var end = endDate.replace(/-/g,'');
	return (parseInt(start)-parseInt(end))>0;
}
function checkAssName(name){
	var temp = false;
	
	var data = {'assPropName':name};
	if(assPropNum!=undefined&&assPropNum!=null&&assPropNum!=''){
		data.assPropNum = assPropNum;
	}
	$.ajax({
        url: portal.bp() + '/assess/checkAssName?r='+Math.random(),
        type: 'get',
        async: false,
        data:data,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	temp = data.data.flag;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
	return temp;
}
function initBasicInfoMgmt(){
	var data = {'assPropNum':assPropNum,'isValid':isValid};
	$.ajax({
        url: portal.bp() + '/assess/getBasicInfoMgmt?r='+Math.random(),
        type: 'get',
        async: false,
        data:data,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	if(data.data!=undefined&&data.data!=null){
        		//修改
        		var basic = data.data;
        		assPropNumSeq = basic.assPropNum.substring(2);
        		$("#belongOrg").selectpicker('val',basic.belongOrg).change();
        		$("#assPropTypeCd").selectpicker('val',basic.assPropTypeCd).trigger("change").prop('disabled',true).selectpicker('refresh');
        		$("#assObjTypeCd").selectpicker('val',basic.assObjTypeCd).trigger("change").prop('disabled',true).selectpicker('refresh');
        		$("#charCnfgFlg").selectpicker('val',basic.charCnfgFlg).trigger("change").prop('disabled',true).selectpicker('refresh');
        		$("#assPropNum").val(basic.assPropNum).change();
        		$("#assPropName").val(basic.assPropName).change();
        		$("#assYear").val(basic.assYear).change();
        		$("#effDt").val(basic.effDt).change();
        		$("#invalidDt").val(basic.invalidDt).change();
        		if(basic.iszhdf!=undefined&&basic.iszhdf!=null)
        			$("#iszhdf").selectpicker('val',basic.iszhdf).trigger("change").prop('disabled',true).selectpicker('refresh');
        		if(basic.professionType!=undefined&&basic.professionType!=null)
        			$("#professionType").selectpicker('val',basic.professionType).trigger("change").prop('disabled',true).selectpicker('refresh');
        	}
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}
function addValidator() {
    //表单校验
    $("#formSearch").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	belongOrg: {
                validators: {
                    notEmpty: {
                        message: "所属机构不能为空"
                    },
                }
            },
            assPropTypeCd: {
                validators: {
                    notEmpty: {
                        message: "考核方案类型不能为空"
                    },
                }
            },
            assObjTypeCd:{
                validators:{
                    notEmpty:{
                        message:"考核对象类型不能为空"
                    }
                }
            },
            assPropNum:{
            	trigger:"change",
            	validators:{
            		notEmpty:{
            			message:"方案ID不能为空"
            		}
            	}
            },
            assPropName:{
            	trigger:"change",
            	validators:{
            		notEmpty:{
            			message:"方案名称不能为空"
            		},
            		callback: {
						callback: function(value, validator) {
							//basicPkId
							var flag = checkAssName(value);
							if(!flag){
								return {
									valid: false,
									message: '名称已存在'
								}
							}
							return true;
						}
					}
            	}
            },
            charCnfgFlg: {
                validators: {
                    notEmpty: {
                        message: "是否特色化配置不能为空"
                    }
                }
            },
            assYear: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "考核年份不能为空"
            		},
            		stringLength: {
                        max: 4,
                        message: "考核年份不能超过4个字"
                    }
            	}
            },
            effDt: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "生效日期不能为空"
            		},
            		callback: {
						callback: function(value, validator) {
							var s = $("#effDt").val();
							var e = $("#invalidDt").val();
							if(s!=''&&e!=''){
								if(!checkEndTime(s,e)){
									validator.updateStatus('invalidDt','VALID');
									return true;
								}else{
									return {
										valid: false,
										message: '生效日期不能大于失效日期'
									};
								}
							}else{
								return true;
							}
						}
					}
            	}
            },
            invalidDt: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "失效日期不能为空"
            		},
            		callback: {
						callback: function(value, validator) {
							var s = $("#effDt").val();
							var e = $("#invalidDt").val();
							if(s!=''&&e!=''){
								if(!checkEndTime(s,e)){
									validator.updateStatus('effDt','VALID');
									return true;
								}else{
									return {
										valid: false,
										message: '失效日期不能小于生效日期'
									};
								}
							}else{
								return true;
							}
						}
					}
            	}
            },
        }
    });
}
