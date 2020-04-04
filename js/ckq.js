var ckqdays = [];
$(function(){
	$("#showckq").attr("data-url",portal.bp() + "/showckq.html?mid=ckqmid").attr('data-index','ckqmid');
	
	$("#m1").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m2").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m3").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m4").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m5").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m6").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m7").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m8").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m9").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m10").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m11").datepicker({
		multidate:false,
		autoclose:true,
	});
	$("#m12").datepicker({
		multidate:false,
		autoclose:true,
	});
	
	$("#ckq").datepicker({
		multidate:true,
		autoclose:false,
	});
	
	addValidator();
	
	init();
	
	/*var flag = false;
	var days = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
	$("#m1").datepicker({
		multidate:false,
	}).on('changeDate',function(){
		var lastDate = $("#ckq").val();
		var yyr = lastDate.split(/[,-]/);
		var lastday = yyr[yyr.length-1];
		var yy = yyr[yyr.length-3]+'-'+yyr[yyr.length-2]+'-';
		var index = days.indexOf(lastday);
		var val = [];
		for(var i=0;i<index;i++){
			val.push(yy+days[i]);
		}
		val.push(yy+lastday);
		//$("#ckq").datepicker('setDates',val);
		//$("#ckq").val(val);
		console.log(val);
	});
	$("#m1").datepicker("show");*/
	/*$("#ckq").attr('readonly','readonly');
	$("#ckq").daterangepicker({
		//singleDatePicker:true,
		ranges:{
			'今天':[moment(),moment()],
			'昨天':[moment().subtract(1,'days'),moment().subtract(1,'days')],
			'近七天':[moment().subtract(7,'days',moment())],
		},
		locale:{
			format:'YYYY-MM-DD',
			separator:'-',
			applyLabel:'确认',
			cancelLabel:'清空',
			fromLabel:'开始时间',
			toLabel:'结束时间',
			customRangeLabel:'自定义',
			daysOfWeek:['日','一','二','三','四','五','六'],
			monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
		}
	
	}).on('outsideClick.daterangepicker',function(){
		$("#ckq").show();
	});*/
	//$("#ckq").daterangepicker('show');
	
	
	
	
	
	
	
	
	/*$("#ckq").attr('readonly','readonly');
	var option = {
			//singleDatePicker:true,
			ranges:{
				'今天':[moment(),moment()],
				'昨天':[moment().subtract(1,'days'),moment().subtract(1,'days')],
				'近七天':[moment().subtract(7,'days',moment())],
			},
			//startDate:'2019-08-01',
			//endDate:'2019-08-09',
			//minDate:'2019-08-01',
			//maxDate:'2019-08-31',
			//maxSpan:true,
			//isShowing:true,
			rightCalendar:{month:'10'},
			leftCalendar:{month:'09'},
			locale:{
				format:'YYYY-MM-DD',
				separator:'-',
				applyLabel:'确认',
				cancelLabel:'清空',
				fromLabel:'开始时间',
				toLabel:'结束时间',
				customRangeLabel:'自定义',
				daysOfWeek:['日','一','二','三','四','五','六'],
				monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
			}	
	};
	$("#ckq").daterangepicker(option,function(start, end, label){
		var startDate = start._d.Format('yyyy-MM-dd');
		var endDate = end._d.Format('yyyy-MM-dd');
		if(startDate.split('-')[2]!='01'){
			layer.msg('开始日期必须是每月1号',{icon:3});
			return;
		}
		
	}).on('outsideClick.daterangepicker',function(){
		$(this).click();
	}).on('apply.daterangepicker',function(){
		//layer.msg('设置成功',{icon:1});
		$(this).click();
	}).click();*/
});
function init(){
	$.ajax({
        url: portal.bp() + '/json/ckq/getckq.json?r='+Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	var days = data.data;
        	$("#m1").datepicker('setStartDate',days.m1.startDate);
        	$("#m1").datepicker('setEndDate',days.m1.endDate);
        	$("#m1").datepicker('setDate',days.m1.currentDay);
        	$("#m2").datepicker('setStartDate',days.m2.startDate);
        	$("#m2").datepicker('setEndDate',days.m2.endDate);
        	$("#m2").datepicker('setDate',days.m2.currentDay);
        	$("#m3").datepicker('setStartDate',days.m3.startDate);
        	$("#m3").datepicker('setEndDate',days.m3.endDate);
        	$("#m3").datepicker('setDate',days.m3.currentDay);
        	$("#m4").datepicker('setStartDate',days.m4.startDate);
        	$("#m4").datepicker('setEndDate',days.m4.endDate);
        	$("#m4").datepicker('setDate',days.m4.currentDay);
        	$("#m5").datepicker('setStartDate',days.m5.startDate);
        	$("#m5").datepicker('setEndDate',days.m5.endDate);
        	$("#m5").datepicker('setDate',days.m5.currentDay);
        	$("#m6").datepicker('setStartDate',days.m6.startDate);
        	$("#m6").datepicker('setEndDate',days.m6.endDate);
        	$("#m6").datepicker('setDate',days.m6.currentDay);
        	$("#m7").datepicker('setStartDate',days.m7.startDate);
        	$("#m7").datepicker('setEndDate',days.m7.endDate);
        	$("#m7").datepicker('setDate',days.m7.currentDay);
        	$("#m8").datepicker('setStartDate',days.m8.startDate);
        	$("#m8").datepicker('setEndDate',days.m8.endDate);
        	$("#m8").datepicker('setDate',days.m8.currentDay);
        	$("#m9").datepicker('setStartDate',days.m9.startDate);
        	$("#m9").datepicker('setEndDate',days.m9.endDate);
        	$("#m9").datepicker('setDate',days.m9.currentDay);
        	$("#m10").datepicker('setStartDate',days.m10.startDate);
        	$("#m10").datepicker('setEndDate',days.m10.endDate);
        	$("#m10").datepicker('setDate',days.m10.currentDay);
        	$("#m11").datepicker('setStartDate',days.m11.startDate);
        	$("#m11").datepicker('setEndDate',days.m11.endDate);
        	$("#m11").datepicker('setDate',days.m11.currentDay);
        	$("#m12").datepicker('setStartDate',days.m12.startDate);
        	$("#m12").datepicker('setEndDate',days.m12.endDate);
        	$("#m12").datepicker('setDate',days.m12.currentDay);
        	
        	switch (days.currentMonth) {
			case 1:
				$("#m1").attr('disabled','disabled');
				break;
			case 2:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				break;
			case 3:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				break;
			case 4:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				break;
			case 5:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				break;
			case 6:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				break;
			case 7:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				$("#m7").attr('disabled','disabled');
				break;
			case 8:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				$("#m7").attr('disabled','disabled');
				$("#m8").attr('disabled','disabled');
				break;
			case 9:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				$("#m7").attr('disabled','disabled');
				$("#m8").attr('disabled','disabled');
				$("#m9").attr('disabled','disabled');
				break;
			case 10:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				$("#m7").attr('disabled','disabled');
				$("#m8").attr('disabled','disabled');
				$("#m9").attr('disabled','disabled');
				$("#m10").attr('disabled','disabled');
				break;
			case 11:
				$("#m1").attr('disabled','disabled');
				$("#m2").attr('disabled','disabled');
				$("#m3").attr('disabled','disabled');
				$("#m4").attr('disabled','disabled');
				$("#m5").attr('disabled','disabled');
				$("#m6").attr('disabled','disabled');
				$("#m7").attr('disabled','disabled');
				$("#m8").attr('disabled','disabled');
				$("#m9").attr('disabled','disabled');
				$("#m10").attr('disabled','disabled');
				$("#m11").attr('disabled','disabled');
				break;
			case 12:
				break;

			default:
				break;
			}
        	
        	ckqdays = [];
        	ckqdays.push(days.m1.currentDay);
        	ckqdays.push(days.m2.currentDay);
        	ckqdays.push(days.m3.currentDay);
        	ckqdays.push(days.m4.currentDay);
        	ckqdays.push(days.m5.currentDay);
        	ckqdays.push(days.m6.currentDay);
        	ckqdays.push(days.m7.currentDay);
        	ckqdays.push(days.m8.currentDay);
        	ckqdays.push(days.m9.currentDay);
        	ckqdays.push(days.m10.currentDay);
        	ckqdays.push(days.m11.currentDay);
        	ckqdays.push(days.m12.currentDay);
        	
        }else{
        	layer.msg('获取窗口期数据失败',{icon:2});
        }
    });
}
function update_btn(){
	var bootstrapValidator = $("#formSearch").data('bootstrapValidator');
    bootstrapValidator.validate();
    if (!bootstrapValidator.isValid())
        return;
    
    var days = [];
    var flag = false;
    if(ckqdays.indexOf($("#m1").val())==-1){
    	days.push($("#m1").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m2").val())==-1){
    	days.push($("#m2").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m3").val())==-1){
    	days.push($("#m3").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m4").val())==-1){
    	days.push($("#m4").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m5").val())==-1){
    	days.push($("#m5").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m6").val())==-1){
    	days.push($("#m6").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m7").val())==-1){
    	days.push($("#m7").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m8").val())==-1){
    	days.push($("#m8").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m9").val())==-1){
    	days.push($("#m9").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m10").val())==-1){
    	days.push($("#m10").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m11").val())==-1){
    	days.push($("#m11").val());
    	flag = true;
    }
    if(ckqdays.indexOf($("#m12").val())==-1){
    	days.push($("#m12").val());
    	flag = true;
    }
    if(!flag){
    	layer.msg('没有任何更改，无需提交',{icon:3});
    	return;
    }
    var data = {
    	'days':days,
    };
    $.ajax({
        url: portal.bp() + '/json/ckq/updateckq.json?r='+Math.random(),
        type: 'get',
        async: false,
        data:data,
        dataType: "json"
    }).done(function (data) {
    	if(data.code=='200'){
    		layer.msg('修改成功',{icon:1});
    		init();
    	}else{
    		layer.msg(data.message,{icon:2})
    	}
    });
}
function goback(){
	window.location.href = portal.bp() +  "/showckq.html";
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
        	m1: {
        		trigger:"change",
                validators: {
                    notEmpty: {
                        message: "不能为空"
                    },
                }
            },
            m2: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m3: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m4: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m5: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m6: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m7: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m8: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m9: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m10: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m11: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
            m12: {
            	trigger:"change",
            	validators: {
            		notEmpty: {
            			message: "不能为空"
            		},
            	}
            },
        }
    });
}