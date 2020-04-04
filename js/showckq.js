var ckqdays = [];
var days = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
$(function(){
	$("#urla").attr("href",portal.bp() + "/ckq.html");
	$("#m1").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m2").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m3").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m4").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m5").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m6").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m7").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m8").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m9").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m10").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m11").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	$("#m12").datepicker({
		multidate:true,
		autoclose:true,
		orientation:'top',
		emptySecondaryEvents:true,
	});
	
	init();
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
        	
    		
    		$("#m1").datepicker('setDates',getDays(days.m1.currentDay)).datepicker("show");
    		$("#m2").datepicker('setDates',getDays(days.m2.currentDay)).datepicker("show");
    		$("#m3").datepicker('setDates',getDays(days.m3.currentDay)).datepicker("show");
    		$("#m4").datepicker('setDates',getDays(days.m4.currentDay)).datepicker("show");
    		$("#m5").datepicker('setDates',getDays(days.m5.currentDay)).datepicker("show");
    		$("#m6").datepicker('setDates',getDays(days.m6.currentDay)).datepicker("show");
    		$("#m7").datepicker('setDates',getDays(days.m7.currentDay)).datepicker("show");
    		$("#m8").datepicker('setDates',getDays(days.m8.currentDay)).datepicker("show");
    		$("#m9").datepicker('setDates',getDays(days.m9.currentDay)).datepicker("show");
    		$("#m10").datepicker('setDates',getDays(days.m10.currentDay)).datepicker("show");
    		$("#m11").datepicker('setDates',getDays(days.m11.currentDay)).datepicker("show");
    		$("#m12").datepicker('setDates',getDays(days.m12.currentDay)).datepicker("show");
        	
    		$("#m1").hide();
    		$("#m2").hide();
    		$("#m3").hide();
    		$("#m4").hide();
    		$("#m5").hide();
    		$("#m6").hide();
    		$("#m7").hide();
    		$("#m8").hide();
    		$("#m9").hide();
    		$("#m10").hide();
    		$("#m11").hide();
    		$("#m12").hide();
        	
        }else{
        	layer.msg('获取窗口期数据失败',{icon:2});
        }
    });
}
function getDays(endDate){
	var lastDate = endDate;
	var yyr = lastDate.split(/[,-]/);
	var lastday = yyr[yyr.length-1];
	var yy = yyr[yyr.length-3]+'-'+yyr[yyr.length-2]+'-';
	var index = days.indexOf(lastday);
	var val = [];
	for(var i=0;i<index;i++){
		val.push(yy+days[i]);
	}
	val.push(yy+lastday);
	return val;
}
