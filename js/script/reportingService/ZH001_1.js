//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
var flag = $.param.getWindowPhase();
var stratDate = "";
var endDate = "";
var startYear = "",startMonth="";
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth()+1;
$(function(){
	 $("#url").attr("href",portal.bp()+"/table/zhTable/ZH001?mid=3810");
	 
	 if(month==1){
		 startYear = year-1;
		 startMonth = "12";
	 }else{
		 startYear = year;
		 startMonth = month-1;
	 }
	 if(parseInt(startMonth)<10){
		 startMonth = "0"+startMonth
	 }
	 if(parseInt(month)<10){
		 month = "0"+month
	 }
	 if(flag=="1"){
		 stratDate = startYear+"-"+startMonth;
	 }else{
		 stratDate = year+"-"+month;
	 }
	 
	 endDate = year+"-"+month;
	 
	 $("#mon").datetimepicker({
         language:"zh-CN",
         format:"yyyy-mm",
         minView:3,
         startView:3,
         autoclose:true,
         clearBtn:false,
     });
	 $('#mon').datetimepicker('setStartDate',stratDate);
	 $('#mon').datetimepicker('setEndDate',endDate);
	 
	 $("#mon").change(function(){
		 var mon = $(this).val();
		 
		 if(mon!=stratDate&&mon!=endDate){
			 $('#table1').bootstrapTable('destroy');
			 $('#table2').bootstrapTable('destroy');
			 //$("#tab").click();
		 }
	 });
	//保存新增
		$("#btn_save1").click(function(){
			//bootstrapTable 编辑列表校验
			var validateError = validateBootStrapTableEdit($("#table1"));
			if(validateError!=null){
				layer.msg(validateError,{icon:2});
				return;
			}
			var addData = [];
			var updateData = [];
			var deleteData = deleteIds;
			var tableData = $("#table1").bootstrapTable("getData");
			$.each(tableData,function(index,item){
				addData.push(item)
			});
			var data = {
	  				"addData":addData,
					"updateData":updateData
					//"deleteData":deleteData
	  		};
			var index;
	  		$.ajax({
	  			url:portal.bp() + '/table/addRecord/ZH001_1saveAll',  			
	  			type:'post',
	  			cache:false,
	            contentType: "application/json;charset=UTF-8",
	  			dataType: "json",
	            data:JSON.stringify(data),
	  			success:function(o){
	  				var code = o.code;
	  				if(code == 200){
	  					layer.msg("提交成功", {icon: 1});
	  					queryHistory();
	  					$('#table1').bootstrapTable('destroy');
	  					//$('#table1').bootstrapTable('load',empty);
	  				}else{
	  					layer.msg(o.message, {icon: 2});
	  				}
	  			},
				beforeSend:function(XMLHttpRequest){
					index = layerLoad();
				},
				complete:function(XMLHttpRequest){
					layerClose(index);
				} 
	  		});
			
			
		});
	 
	//保存
	$("#btn_save2").click(function(){
		//bootstrapTable 编辑列表校验
		var validateError = validateBootStrapTableEdit($("#table2"));
		if(validateError!=null){
			layer.msg(validateError,{icon:2});
			return;
		}
		var addData = [];
		var updateData = [];
		var deleteData = deleteIds;
		var tableData = $("#table2").bootstrapTable("getData");
		$.each(tableData,function(index,item){
			updateData.push(item)	
		});
		
		if(addData.length==0&&updateData.length==0&&deleteData==0){
			layer.msg("没有任何修改，无需保存",{icon:3});
			return;
		}
		
		var data = {
  				"addData":addData,
				"updateData":updateData
				//"deleteData":deleteData
  		};
		var index;
  		$.ajax({
  			url:portal.bp() + '/table/addRecord/ZH001_1saveAll',  			
  			type:'post',
  			cache:false,
            contentType: "application/json;charset=UTF-8",
  			dataType: "json",
            data:JSON.stringify(data),
  			success:function(o){
  				var code = o.code;
  				if(code == 200){
  					layer.msg("提交成功", {icon: 1});
  					query();
  				}else{
  					layer.msg(o.message, {icon: 2});
  				}
  			},
			beforeSend:function(XMLHttpRequest){
				index = layerLoad();
			},
			complete:function(XMLHttpRequest){
				layerClose(index);
			} 
  		});
		
		
	});
	
});

//查询新增项
function queryRows() {
	var mon = $("#mon").val();	
	var num = 0; 

	if(mon==""||mon==null){		
		layer.msg("请选择需新增数据的月份",{icon:3});
	}else if(mon!=stratDate&&mon!=endDate){
		layer.msg("补录月份不在窗口期内，请重新输入",{icon:3});
	}else{
		num = $.param.getIsAdd(mon);
		if(num>0){
			layer.msg("当前月份已补录，请重新选择月份或者查询修改项进行修改",{icon:3});
		}else{
			$('#table1').bootstrapTable('destroy');
		    TableObjPage.table1();
		    $("#tab1").click();
		}
	}
	
}

//查询修改项
function query() {	
	var mon = $("#mon").val();
	if(mon==""||mon==null){
		layer.msg("请选择需修改数据的月份",{icon:3});
	}else if(mon!=stratDate&&mon!=endDate){
		layer.msg("补录月份不在窗口期内，请重新输入",{icon:3});
	}else{
		$('#table2').bootstrapTable('destroy');
	    TableObjPage.table2();
	    $("#tab2").click();
	}
	
	
}
//查询修改记录
function queryHistory() {
	$('#table3').bootstrapTable('destroy');
	TableObjPageHistory.table3();
	$("#tab3").click();
}


var oldTable;
var TableObjPage = {
		table1: function(){

	        var columns = 
	              [	               
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },
					 {
						 field:'org_num',
						 title:'机构号',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'org_name',
						 title:'管辖行名称',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'mon',
						 title:'月 份',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'corp_cust_dpst',
						 title:'公司客户存款<br/>(含保本理财)',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司客户存款(含保本理财)',
							 placement:'top',
							 emptytext:"0",		
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司客户存款(含保本理财)必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_large_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'大额存单',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '大额存单必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保本理财',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保本理财必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_acct',
						 title:'户联赢',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'户联赢',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '户联赢必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'结构性存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '结构性存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'通知存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '通知存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_other',
						 title:'其他',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其他',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其他必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_dpst_in_tran_out',
						 title:'调整：存款<br/>内部转移',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'调整：存款内部转移',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '调整：存款内部转移必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_cust_dpst',
						 title:'零售客户存款<br/>（含保本理财）',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'零售客户存款（含保本理财）',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '零售客户存款（含保本理财）必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'通知存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '通知存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'lretail_arge_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'大额存单',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '大额存单必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保本理财',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保本理财必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'结构性存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '结构性存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_dmnd',
						 title:'同业资金-活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_class_time',
						 title:'同业资金-类定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-类定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-类定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_time',
						 title:'同业资金-定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_other',
						 title:'同业资金-其他',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-其他',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-其他必须是数字';
			                 }
						 }
					 },	
					 
					 {
						 field:'corp_cust_loan',
						 title:'公司客户贷款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司客户贷款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司客户贷款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_short',
						 title:'其中：短期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：短期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：短期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_bill_discount',
						 title:'票据贴现',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'票据贴现',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '票据贴现必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_mlln',
						 title:'中长期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'中长期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '中长期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_fact_and_adv_money',
						 title:'保理及垫款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保理及垫款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保理及垫款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'bh_epbond',
						 title:'调整：被持企业债',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'调整：被持企业债',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '调整：被持企业债必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'indv_loan',
						 title:'个人贷款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'个人贷款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '个人贷款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'stl_inv_bal',
						 title:'直投余额',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'直投余额',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '直投余额必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_asset_ibbrw',
						 title:'同业资产-同业借款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资产-同业借款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资产-同业借款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_asset_ibdpst',
						 title:'同业资产-同业存放',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资产-同业存放',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资产-同业存放必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_line',
						 title:'公司线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_line',
						 title:'零售线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'零售线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '零售线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'fin_mrkt_line',
						 title:'金融市场线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'金融市场线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '金融市场线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'non_int_adj',
						 title:'非息调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'非息调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '非息调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'change_fee',
						 title:'变动费用',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'变动费用',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '变动费用必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'change_fee_adj',
						 title:'变动费用调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'变动费用调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '变动费用调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'manu_fee',
						 title:'人工费用',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'人工费用',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '人工费用必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'manu_fee_adj',
						 title:'人工费用调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'人工费用调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '人工费用调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'dfrtlrn',
						 title:'级差地租',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'级差地租',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '级差地租必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'biz_ext_incom_expns',
						 title:'营业外收支',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'营业外收支',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '营业外收支必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'const_tax_and_adtnl',
						 title:'城建税及附加',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'城建税及附加',
							 placement:'top',
							 emptytext:"0",		
							 validate: function (v) {
			                       if (!checkFloat(v)) return '城建税及附加必须是数字';
			                 }
						 }
					 },		
					 {
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'备注',
							 placement:'top',
							 emptytext:"空",
							 
						 }
					 },
					 /*{
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	                */
	        ];
	        $('#table1').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/ZH001_1queryRows',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	           // pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {	       
	            	return{
	            		'mon':$("#mon").val(),
	            		'authOrgs':authOrgs,
	            	};
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	           // height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	oldTable = JSON.parse(JSON.stringify(res.data));
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            rowStyle:function(row,index){
	            	if(row.isAdd){
	            		//新增行样式
	            		/*['active','success','info','warning','danger']*/
	            		/*return {
	            				css:{
	            					'color':'green'
	            				}
	            		}*/
	            		return {classes:'info'};
	            	}else{
	            		return {};
	            	}
	            },
	            onLoadSuccess: function (data) {
	            	//initBootStrapTablevalidateEdit($("#table1"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){	
	            	$("#table1").bootstrapTable("resetView");
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.org_num===row.org_num){
								if(eval("item."+field)===eval("row."+field)){
									$el.removeClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									delete row.updateCell[field];
								}else{
									$el.addClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									row.updateCell[field] = '1';
								}
							}
						});
					
				},
	            columns: columns,
	        });
	    
		},
		table2: function () {
	        var columns = 
	              [	               
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					      }
					 },
					 {
						 field:'org_num',
						 title:'机构号',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'org_name',
						 title:'管辖行名称',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'mon',
						 title:'月份',
						 align: "center",
						 valign: "middle",
						 
					 },	
					 {
						 field:'corp_cust_dpst',
						 title:'公司客户存款<br/>(含保本理财)',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司客户存款(含保本理财)',
							 placement:'top',
							 emptytext:"0",		
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司客户存款(含保本理财)必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_large_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'大额存单',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '大额存单必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保本理财',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保本理财必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_acct',
						 title:'户联赢',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'户联赢',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '户联赢必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'结构性存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '结构性存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'通知存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '通知存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_other',
						 title:'其他',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其他',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其他必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_dpst_in_tran_out',
						 title:'调整：存款<br/>内部转移',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'调整：存款内部转移',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '整：存款内部转移必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_cust_dpst',
						 title:'零售客户存款<br/>（含保本理财）',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'零售客户存款（含保本理财）',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '零售客户存款（含保本理财）必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'通知存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '通知存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'lretail_arge_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'大额存单',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '大额存单必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保本理财',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保本理财必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'结构性存款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '结构性存款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_dmnd',
						 title:'同业资金-活期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-活期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-活期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_class_time',
						 title:'同业资金-类定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-类定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-类定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_time',
						 title:'同业资金-定期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-定期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-定期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_capt_other',
						 title:'同业资金-其他',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资金-其他',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资金-其他必须是数字';
			                 }
						 }
					 },	
					 
					 {
						 field:'corp_cust_loan',
						 title:'公司客户贷款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司客户贷款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司客户贷款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_short',
						 title:'其中：短期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'其中：短期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '其中：短期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_bill_discount',
						 title:'票据贴现',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'票据贴现',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '票据贴现必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_mlln',
						 title:'中长期',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'中长期',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '中长期必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_fact_and_adv_money',
						 title:'保理及垫款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'保理及垫款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '保理及垫款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'bh_epbond',
						 title:'调整：被持企业债',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'调整：被持企业债',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '调整：被持企业债必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'indv_loan',
						 title:'个人贷款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'个人贷款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '个人贷款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'stl_inv_bal',
						 title:'直投余额',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'直投余额',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '直投余额必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_asset_ibbrw',
						 title:'同业资产-同业借款',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资产-同业借款',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资产-同业借款必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'ibank_asset_ibdpst',
						 title:'同业资产-同业存放',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'同业资产-同业存放',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '同业资产-同业存放必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'corp_line',
						 title:'公司线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'公司线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '公司线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'retail_line',
						 title:'零售线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'零售线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '零售线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'fin_mrkt_line',
						 title:'金融市场线',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'金融市场线',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '金融市场线必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'non_int_adj',
						 title:'非息调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'非息调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '非息调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'change_fee',
						 title:'变动费用',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'变动费用',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '变动费用必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'change_fee_adj',
						 title:'变动费用调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'变动费用调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '变动费用调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'manu_fee',
						 title:'人工费用',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'人工费用',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '人工费用必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'manu_fee_adj',
						 title:'人工费用调整',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'人工费用调整',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '人工费用调整必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'dfrtlrn',
						 title:'级差地租',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'级差地租',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '级差地租必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'biz_ext_incom_expns',
						 title:'营业外收支',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'营业外收支',
							 placement:'top',
							 emptytext:"0",
							 validate: function (v) {
			                       if (!checkFloat(v)) return '营业外收支必须是数字';
			                 }
						 }
					 },	
					 {
						 field:'const_tax_and_adtnl',
						 title:'城建税及附加',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'城建税及附加',
							 placement:'top',
							 emptytext:"0",	
							 validate: function (v) {
			                       if (!checkFloat(v)) return '城建税及附加必须是数字';
			                 }
						 }
					 },		
					 {
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						 editable:{
							 type:'text',
							 title:'备注',
							 placement:'top',
							 emptytext:"空",
							 
						 }
					 },
					 {
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					 },
					 {
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					 },
	                
	        ];
	        $('#table2').bootstrapTable('destroy').bootstrapTable({
	            url: portal.bp() + '/table/addRecord/ZH001_1query',
	            method: 'get',      //请求方式（*）
	            striped: true,      //是否显示行间隔色
	            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	           // pagination: true,     //是否显示分页（*）
	            sortStable: true,      //是否启用排序
	            sortOrder: "desc",     //排序方式
	            singleSelect: false,    //是否单选，true时没有全选按钮
	            "queryParamsType": "limit",
	            contentType: "application/x-www-form-urlencoded",
	            queryParams: function (params) {	       
	            	return{
	            		'mon':$("#mon").val(),
	            		'authOrgs':authOrgs,
	            	};
	            },
	            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
	            clickToSelect: true,    //是否启用点击选中行
	            resizable:true,			//是否可调整列宽度
	           // height:getTableHeight(document), //表格固定高度
	            responseHandler: function (res) { //服务端返回数据
	                if (res.code == '200') {
	                	oldTable = JSON.parse(JSON.stringify(res.data));
	                    return res.data;
	                } else {
	                    layer.msg(res.message, {icon: 2});
	                    return {};
	                }
	            },
	            rowStyle:function(row,index){
	            	if(row.isAdd){
	            		//新增行样式
	            		/*['active','success','info','warning','danger']*/
	            		/*return {
	            				css:{
	            					'color':'green'
	            				}
	            		}*/
	            		return {classes:'info'};
	            	}else{
	            		return {};
	            	}
	            },
	            onLoadSuccess: function (data) {
	            	//initBootStrapTablevalidateEdit($("#table2"));
	            	resizeTables();
	            },
	            onEditableSave:function(field,row,oldValue,$el){
	            	$("#table2").bootstrapTable("resetView");
			    	if(row.addt_rcrd_id!=null&&row.addt_rcrd_id!=''){
			    		//修改
						$.each(oldTable.rows,function(index,item){
							if(item.addt_rcrd_id===row.addt_rcrd_id){
								if(eval("item."+field)===eval("row."+field)){
									$el.removeClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									delete row.updateCell[field];
								}else{
									$el.addClass('update-cell-data');
									//修改标志
									if(row.updateCell==undefined||row.updateCell==null){
										row.updateCell = {};
									}
									row.updateCell[field] = '1';
								}
							}
						});
					}
					
				},
	            columns: columns,
	        });
	    }

}

var TableObjPageHistory = {
		table3: function () {
		    var columns = 
		          [		           
					{
						  field:'number',
						  title:'序号',
						  align: "center",
						  valign: "middle",
						  formatter: function (value, row, index) {
							  row.number = index + 1;
							  return index + 1;
					    }
					},
					{
						 field:'org_num',
						 title:'机构号',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'org_name',
						 title:'管辖行名称',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'mon',
						 title:'月份',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_cust_dpst',
						 title:'公司客户存款<br/>(含保本理财)',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'corp_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_large_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_acct',
						 title:'户联赢',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'corp_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_other',
						 title:'其他',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_dpst_in_tran_out',
						 title:'调整：存款<br/>内部转移',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_cust_dpst',
						 title:'零售客户存款<br/>（含保本理财）',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_dmnd',
						 title:'其中：活期',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_time',
						 title:'定期',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'retail_call_dpst',
						 title:'通知存款',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'lretail_arge_dpst',
						 title:'大额存单',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_brk_evn_fin',
						 title:'保本理财',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_stdp',
						 title:'结构性存款',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'ibank_capt_dmnd',
						 title:'同业资金-活期',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'ibank_capt_class_time',
						 title:'同业资金-类定期',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'ibank_capt_time',
						 title:'同业资金-定期',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'ibank_capt_other',
						 title:'同业资金-其他',
						 align: "center",
						 valign: "middle",
						 
					},	
					
					{
						 field:'corp_cust_loan',
						 title:'公司客户贷款',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_short',
						 title:'其中：短期',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_bill_discount',
						 title:'票据贴现',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_mlln',
						 title:'中长期',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'corp_fact_and_adv_money',
						 title:'保理及垫款',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'bh_epbond',
						 title:'调整：被持企业债',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'indv_loan',
						 title:'个人贷款',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'stl_inv_bal',
						 title:'直投余额',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'ibank_asset_ibbrw',
						 title:'同业资产-同业借款',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'ibank_asset_ibdpst',
						 title:'同业资产-同业存放',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'corp_line',
						 title:'公司线',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'retail_line',
						 title:'零售线',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'fin_mrkt_line',
						 title:'金融市场线',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'non_int_adj',
						 title:'非息调整',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'change_fee',
						 title:'变动费用',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'change_fee_adj',
						 title:'变动费用调整',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'manu_fee',
						 title:'人工费用',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'manu_fee_adj',
						 title:'人工费用调整',
						 align: "center",
						 valign: "middle",
						
					},	
					{
						 field:'dfrtlrn',
						 title:'级差地租',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'biz_ext_incom_expns',
						 title:'营业外收支',
						 align: "center",
						 valign: "middle",
						 
					},	
					{
						 field:'const_tax_and_adtnl',
						 title:'城建税及附加',
						 align: "center",
						 valign: "middle",
						 
					},		
					{
						 field:'memo',
						 title:'备注',
						 align: "center",
						 valign: "middle",
						 
					},
					{
						 field:'addt_rcrd_dt',
						 title:'补录时间',
						 align: "center",
						 valign: "middle",
					},
					{
						 field:'addt_rcrd_person_empno',
						 title:'补录人员工号',
						 align: "center",
						 valign: "middle",
					},
					{
						 field:'ope_type_cd',
						 title:'操作类型',
						 align: "center",
						 valign: "middle",
					},
		            
		    ];
		    $('#table3').bootstrapTable('destroy').bootstrapTable({
		        url: portal.bp() + '/table/addRecord/ZH001_1queryAll',
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
		            	'mon':$("#mon").val(),
		            	'authOrgs':authOrgs,
		            	'pageSize': params.limit,
		                'pageNum': (params.offset / params.limit) + 1,            	
		            };
		        },
		        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
		        pageNum: 1,      //初始化加载第一页，默认第一页
		        pageSize: 100,      //每页的记录行数（*）
		        pageList: [50,100],  //可供选择的每页的行数（*）
		        clickToSelect: false,    //是否启用点击选中行
		        resizable:true,			//是否可调整列宽度
		        //height:getTableHeight(document), //表格固定高度
		        responseHandler: function (res) { //服务端返回数据
		            if (res.code == '200') {
		            	//oldTable = JSON.parse(JSON.stringify(res.data));
		                return res.data;
		            } else {
		                layer.msg(res.message, {icon: 2});
		                return {};
		            }
		        },
		        rowStyle:function(row,index){
		        	if(row.isAdd){
		        		//新增行样式
		        		/*['active','success','info','warning','danger']*/
		        		/*return {
		        				css:{
		        					'color':'green'
		        				}
		        		}*/
		        		return {classes:'info'};
		        	}else{
		        		return {};
		        	}
		        },
		        onLoadSuccess: function (data) {
		        	resizeTables();
		        },
		       
		        columns: columns
		
		    });
		}
};

		
