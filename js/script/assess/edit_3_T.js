var deleteIds = [];
var oldTable;
var result = [];
var numStr = '';
var ruleStr = '';

var valueQ,rowNumQ,flagQ,indexQ,tableIdQ;

//0-1的整数或两位小数
var pattern1 = /^[0-1]$|^0\.[0-9]{1,2}$/;

//大于等于0的整数或6位小数,最大999999.999999
var pattern3 = /^(([1-9][0-9]{0,5})|0)(\.\d{1,6})?$/;

var nextFlag = true;
var nextBtn = false;
$(function () {
    var step1 = new SetStep({
        content: '.stepCont1',
        textMaxWidth: 120,
        steps: ['方案基本信息', '选择考核对象', '选择考核指标', '指标分配'],
        stepCounts: 4,
        curStep: 3,
    });
    table_m_query();
    table_q_query();
    table_y_query();

    $("#todobtn").click(function () {
        var list;
        var inNum = $("#indexName").val();
        if(inNum==null||inNum==""){
       	 layer.msg("请选择指标",{icon:3});
       	 return;
       }
        $.ajax({
            url: portal.bp() + './json/assess/getIndexInfoById.json?r='+Math.random(),
            type: 'get',
            async: false,
            data: {'indexInfoId':inNum},
            cache: false,
            dataType: "json",
            success:function (data) {
                if (data.code != 200) {
                    layer.msg(data.message, {icon: 2});
                }
                list = data.data;
                if(numStr.indexOf(inNum)!=-1 && list.assIndexCateCd != '03'){
                    layer.msg("同一考核方案中指标名称不可重复！",{icon:3});
                }else{
                    //更改表格值
                    $("#"+tableIdQ).bootstrapTable("updateCell",{
                        index:indexQ,
                        field:'indexNum',
                        value:list.assIndexId +"_"+ new Date().getTime()
                    });
                    $("#"+tableIdQ).bootstrapTable("updateCell",{
                        index:indexQ,
                        field:'indexNumOld',
                        value:list.assIndexId
                    });


                    if(rowNumQ != '' && rowNumQ != null && rowNumQ != undefined && rowNumQ != list.assIndexId){
                        $("#"+tableIdQ).bootstrapTable("updateCell",{
                            index:indexQ,
                            field:'flag',
                            value:'up'
                        });

                        deleteIds.push(rowNumQ);
                    }

                    $("#"+tableIdQ).bootstrapTable("updateCell",{
                        index:indexQ,
                        field:'indexName',
                        value:list.assIndexName
                    });
                    $("#"+tableIdQ).bootstrapTable("updateCell",{
                        index:indexQ,
                        field:'assIndexCateDesc',
                        value:list.assIndexCateDesc === null? '无':list.assIndexCateDesc
                    });
                    $("#"+tableIdQ).bootstrapTable("updateCell",{
                        index:indexQ,
                        field:'assIndexUnit',
                        value:list.assIndexUnit == null ||list.assIndexUnit == '' || list.assIndexUnit == undefined ? '无':list.assIndexUnit
                    });
                    if(tableIdQ == 'datatable_m' && list.assIndexCateCd == '03'){
                        $("#"+tableIdQ).bootstrapTable("updateCell",{index:indexQ, field:'scoreCalcRule', value:'E'});
                        //设置编辑状态
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'scoreCalcRule']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'neguConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'whfConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(4).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'assIndexOrientCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(5).find("a").text("定性指标");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'perStatCaliCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(6).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM1Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(11).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM2Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(12).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM3Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(13).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM4Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(14).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM5Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(15).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM6Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(16).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM7Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(17).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM8Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(18).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM9Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(19).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM10Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(20).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM11Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(21).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexM12Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(22).find("a").text("--");

                    }
                    if(tableIdQ == 'datatable_q' && list.assIndexCateCd == '03'){
                        $("#"+tableIdQ).bootstrapTable("updateCell",{index:indexQ, field:'scoreCalcRule', value:'E'});
                        //设置编辑状态
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'scoreCalcRule']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'neguConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'whfConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(4).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'assIndexOrientCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(5).find("a").text("定性指标");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'perStatCaliCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(6).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgQ1Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(11).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgQ2Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(12).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgQ3Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(13).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgQ4Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(14).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgM1Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(15).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgM2Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(16).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'indexDecProgM3Str']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(17).find("a").text("--");

                    }
                    if(tableIdQ == 'datatable_y' && list.assIndexCateCd == '03'){
                        $("#"+tableIdQ).bootstrapTable("updateCell",{index:indexQ, field:'scoreCalcRule', value:'E'});
                        //设置编辑状态
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'scoreCalcRule']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'neguConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'whfConvtRatio']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(4).find("a").text("--");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'assIndexOrientCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(5).find("a").text("定性指标");
                        $("#"+tableIdQ +" tr[data-index = '" +indexQ+"'] a[data-name = 'perStatCaliCd']").editable('toggleDisabled',false);
                        $("#"+tableIdQ+">tbody").find("tr").eq(indexQ).find("td").eq(6).find("a").text("--");

                    }

                    layer.closeAll('loading');
                    $("#index_Modal").modal("hide");
                    
                    //更新表中修改过字段的颜色
                    updateCellDataClass($("#"+tableIdQ));
                    $('#'+tableIdQ).bootstrapTable('resetView');
                }
            }
        });
    });


    //新增月度指标
    $("#btn_add_m").click(function () {
        var length = $("#datatable_m").bootstrapTable("getData").length;
        $("#datatable_m").bootstrapTable("insertRow", {
            index: length,
            row: {
                isAdd: true,
                indexNum: '',
                indexNumOld:'',
                indexName:'空',
                assIndexUnit: '',
                perStatCaliCd: perStatCaliCdDefault,
                assIndexCateDesc: '',
                scoreCalcRule: '',
                assIndexOrientCd: '',
                scoreCalcRule: '',
                scoreCeil: '1',
                neguIndexVal: '',
                neguConvtRatio: '1',
                whfConvtRatio: '1',
                indexM1Str: '',
                indexM2Str: '',
                indexM3Str: '',
                indexM4Str: '',
                indexM5Str: '',
                indexM6Str: '',
                indexM7Str: '',
                indexM8Str: '',
                indexM9Str: '',
                indexM10Str: '',
                indexM11Str: '',
                indexM12Str: '',
            }
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#datatable_m"));
        $('#datatable_m').bootstrapTable('resetView');

    });


    //删除月度指标
    $("#btn_del_m").click(function () {
        var length = $("#datatable_m").bootstrapTable("getData").length;
        var checklist = $('#datatable_m').bootstrapTable('getSelections');

        layer.confirm('您确定要删除选中的'+checklist.length+'条数据吗？', {
    		btn: ['确定','取消']
    		}, function(){
    			var ids = [];
    	        $.each(checklist, function (index, item) {
    	            ids.push(item.number);
    	            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
    	                deleteIds.push(item.indexNum);
    	            }
    	        });
    	        $("#datatable_m").bootstrapTable("remove", {
    	            field: 'number',
    	            values: ids
    	        });
    	        //更新表中修改过字段的颜色
    	        updateCellDataClass($("#datatable_m"));
    	        layer.closeAll();
    		}, function(){
    		});
        
    });

    //保存月度指标
    $("#btn_save_m").click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($("#datatable_m"));
         if(validateError!=null){
            //  layer.msg("月度指标:"+validateError,{icon:2});
             nextFlag = false;
             return;
         }
        var addData = [];
        var updateData = [];
        var deleteData = deleteIds;
        var tableData = $("#datatable_m").bootstrapTable("getData");
        var flag = false;
        $.each(tableData, function (index, item) {
        	//月度指标十二个月合计为1
        	if(item.assIndexCateDesc!='定性指标'){
        		if(!checkIndexM(item)){
        			flag = true;
        			nextFlag = false;
        			// layer.msg(item.indexName+"的月度指标后一个月要大于等于前一个月且十二月分解进度是1",{icon:2});
        			return false;
        		}
        	}
        	
            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
                if (item.isAdd == true) {
                    //新增数据
                    item.indexType = '1';
                    if(item.assIndexCateDesc=='定性指标'){
                        item.assIndexOrientCd = '02';
                        item.indexM1Str = '';
                        item.indexM2Str = '';
                        item.indexM3Str = '';
                        item.indexM4Str = '';
                        item.indexM5Str = '';
                        item.indexM6Str = '';
                        item.indexM7Str = '';
                        item.indexM8Str = '';
                        item.indexM9Str = '';
                        item.indexM10Str = '';
                        item.indexM11Str = '';
                        item.indexM12Str = '';

                    }
                    addData.push(item);
                }else{
                    if(item.flag == 'up'){
                        addData.push(item);
                    }
                    updateData.push(item);
                }
            } else {

            }

        });
        if(flag){
        	return;
        }
        if(addData.length==0&&updateData.length==0&&deleteData==0){
            if(!nextBtn){
            	// layer.msg("没有任何修改，无需保存",{icon:3});
            }
            return;
        }
        var index;
        var data = {
            'addData': addData,
            'updateData': updateData,
            'deleteData': deleteData,
            'assPropNum': assPropNum
        }

        $.ajax({
            url: portal.bp() + './json/assess/saveAssIndex.json?r=' + Math.random(),
            type: 'post',
            cache: false,
            async:false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == '200') {
                	if(!nextBtn){
                		layer.msg(data.message, {icon: 1});
                	}
                } else {
                    // layer.msg(data.message, {icon: 2});
                    nextFlag = false;
                }
            },
            beforeSend: function (XMLHttpRequest) {
                index = layerLoad();
            },
            complete: function (XMLHttpRequest) {
                table_m_query();
                layerClose(index);
            }
        });
    });


    //新增季度指标
    $("#btn_add_q").click(function () {
        var length = $("#datatable_q").bootstrapTable("getData").length;
        $("#datatable_q").bootstrapTable("insertRow", {
            index: length,
            row: {
                isAdd: true,
                indexNum: '',
                indexNumOld:'',
                indexName:'空',
                assIndexUnit: '',
                perStatCaliCd: perStatCaliCdDefault,
                assIndexCateDesc: '',
                scoreCalcRule: '',
                assIndexOrientCd: '',
                scoreCalcRule: '',
                scoreCeil: '1',
                neguIndexVal: '',
                neguConvtRatio: '1',
                neguIndexWei: '',
                whfConvtRatio: '1',
                whfIndexWei: '',
                indexDecProgQ1Str:'',
                indexDecProgQ2Str:'',
                indexDecProgQ3Str:'',
                indexDecProgQ4Str:'',
                indexDecProgM1Str:'',
                indexDecProgM2Str:'',
                indexDecProgM3Str:''
            }
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#datatable_q"));
        $('#datatable_q').bootstrapTable('resetView');
    });


    //删除季度指标
    $("#btn_del_q").click(function () {
        var length = $("#datatable_q").bootstrapTable("getData").length;
        var checklist = $('#datatable_q').bootstrapTable('getSelections');
        layer.confirm('您确定要删除选中的'+checklist.length+'条数据吗？', {
    		btn: ['确定','取消']
    		}, function(){
		        var ids = [];
		        $.each(checklist, function (index, item) {
		            ids.push(item.number);
		            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
		                deleteIds.push(item.indexNum);
		            }
		        });
		        $("#datatable_q").bootstrapTable("remove", {
		            field: 'number',
		            values: ids
		        });
		        //更新表中修改过字段的颜色
		        updateCellDataClass($("#datatable_q"));
		        layer.closeAll();
    		}, function(){
    		});
    });


    //保存季度指标
    $("#btn_save_q").click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($("#datatable_q"));
        if(validateError!=null){
            // layer.msg("季度指标:"+validateError,{icon:2});
            nextFlag = false;
            return;
        }
        var addData = [];
        var updateData = [];
        var deleteData = deleteIds;
        var tableData = $("#datatable_q").bootstrapTable("getData");
        var flag = false;
        $.each(tableData, function (index, item) {
        	//季度指标四个季度合计为1；三个月合计为1
        	if(item.assIndexCateDesc!='定性指标'){
        		if(!checkIndexQ(item)){
        			flag = true;
        			nextFlag = false;
        			// layer.msg(item.indexName+"的季度指标四个季度合计必须为1",{icon:2});
        			return false;
        		}
        		if(!checkIndexQM(item)){
        			flag = true;
        			nextFlag = false;
        			// layer.msg(item.indexName+"的季度指标三个月合计必须为1",{icon:2});
        			return false;
        		}
        	}
        	
            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
                if (item.isAdd == true) {
                    //新增数据
                    item.indexType = '2';
                    if(item.assIndexCateDesc=='定性指标'){
                        item.assIndexOrientCd = '02';
                        item.indexDecProgQ1Str = '';
                        item.indexDecProgQ2Str = '';
                        item.indexDecProgQ3Str = '';
                        item.indexDecProgQ4Str = '';
                        item.indexDecProgM1Str = '';
                        item.indexDecProgM2Str = '';
                        item.indexDecProgM3Str = '';
                    }
                    addData.push(item);
                }else{
                    if(item.flag == 'up'){
                        addData.push(item);
                    }
                    updateData.push(item);
                }
            } else {

            }

        });
        if(flag){
        	return;
        }
        if(addData.length==0&&updateData.length==0&&deleteData==0){
        	if(!nextBtn){
        		layer.msg("没有任何修改，无需保存",{icon:3});
        	}
            return;
        }
        var index;
        var data = {
            'addData': addData,
            'updateData': updateData,
            'deleteData': deleteData,
            'assPropNum': assPropNum
        }

        $.ajax({
            url: portal.bp() + './json/assess/saveAssIndex.json?r=' + Math.random(),
            type: 'post',
            cache: false,
            async:false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == '200') {
                	if(!nextBtn){
                		layer.msg(data.message, {icon: 1});
                	}
                } else {
                	nextFlag = false;
                    // layer.msg(data.message, {icon: 2});
                }
            },
            beforeSend: function (XMLHttpRequest) {
                index = layerLoad();
            },
            complete: function (XMLHttpRequest) {
                table_q_query();
                layerClose(index);
            }
        });
    });


    //新增年度指标
    $("#btn_add_y").click(function () {
        var length = $("#datatable_y").bootstrapTable("getData").length;
        $("#datatable_y").bootstrapTable("insertRow", {
            index: length,
            row: {
                isAdd: true,
                indexNum: '',
                indexNumOld:'',
                indexName:'空',
                assIndexUnit: '',
                perStatCaliCd: perStatCaliCdDefault,
                assIndexCateDesc: '',
                scoreCalcRule: '',
                assIndexOrientCd: '',
                scoreCalcRule: '',
                scoreCeil: '1',
                neguIndexVal: '',
                neguConvtRatio: '1',
                neguIndexWei: '',
                whfConvtRatio: '1',
                whfIndexWei: '',
            }
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#datatable_y"));
        $('#datatable_y').bootstrapTable('resetView');
    });


    //删除年度指标
    $("#btn_del_y").click(function () {
        var length = $("#datatable_y").bootstrapTable("getData").length;
        var checklist = $('#datatable_y').bootstrapTable('getSelections');
        layer.confirm('您确定要删除选中的'+checklist.length+'条数据吗？', {
    		btn: ['确定','取消']
    		}, function(){
		        var ids = [];
		        $.each(checklist, function (index, item) {
		            ids.push(item.number);
		            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
		                deleteIds.push(item.indexNum);
		            }
		        });
		        $("#datatable_y").bootstrapTable("remove", {
		            field: 'number',
		            values: ids
		        });
		        //更新表中修改过字段的颜色
		        updateCellDataClass($("#datatable_y"));
		        layer.closeAll();
			}, function(){
			});
    });


    //保存年度指标
    $("#btn_save_y").click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($("#datatable_y"));
        if(validateError!=null){
            // layer.msg("年度指标:"+validateError,{icon:2});
            nextFlag = false;
            return;
        }
        var addData = [];
        var updateData = [];
        var deleteData = deleteIds;
        var tableData = $("#datatable_y").bootstrapTable("getData");
        $.each(tableData, function (index, item) {
            if (item.indexNum != undefined && item.indexNum != null && item.indexNum != '') {
                if (item.isAdd == true) {
                    //新增数据
                    item.indexType = '3';
                    if(item.assIndexCateDesc=='定性指标'){
                        item.assIndexOrientCd = '02';
                    }
                    addData.push(item);
                }else{
                    if(item.flag == 'up'){
                        addData.push(item);
                    }
                    updateData.push(item);
                }
            } else {

            }

        });
        if(addData.length==0&&updateData.length==0&&deleteData==0){
        	if(!nextBtn){
        		layer.msg("没有任何修改，无需保存",{icon:3});
        	}
            return;
        }
        var index;
        var data = {
            'addData': addData,
            'updateData': updateData,
            'deleteData': deleteData,
            'assPropNum': assPropNum
        }

        $.ajax({
            url: portal.bp() + './json/assess/saveAssIndex.json?r=' + Math.random(),
            type: 'post',
            cache: false,
            async:false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == '200') {
                	if(!nextBtn){
                		layer.msg(data.message, {icon: 1});
                	}
                } else {
                	nextFlag = false;
                    // layer.msg(data.message, {icon: 2});
                }
            },
            beforeSend: function (XMLHttpRequest) {
                index = layerLoad();
            },
            complete: function (XMLHttpRequest) {
                table_y_query();
                layerClose(index);
            }
        });
    });




    if(professionType=='LS'){
    	$("#index_line").html("").append('<option value="02">零售线</option><option value="04">综合线</option>');
    }else if(professionType=='GS'){
    	$("#index_line").html("").append('<option value="01">公司线</option><option value="04">综合线</option>');
    }else if(professionType=='SC'){
    	$("#index_line").html("").append('<option value="03">市场线</option><option value="04">综合线</option>');
    }else{
    	$("#index_line").html("").append($.param.getSelectOptionOrder("TB0071"));
    }
    
    $("#index_cateCd").html("").append($.param.getSelectOptionOrder("TB0010"));
    $("#index_line").change(function(){
    	changeIndexLineOrCateCd();
    });
    $("#index_cateCd").change(function(){
    	changeIndexLineOrCateCd();
    });
});
function changeIndexLineOrCateCd(){
	$.ajax({
        url: portal.bp() + './json/assess/getIndexParamNames.json?r=' + Math.random(),
        type: 'get',
        async: false,
        data: {
        	'line':$("#index_line").val(),
        	'cateCd':$("#index_cateCd").val(),
        },
        dataType: "json"
    }).done(function (data) {
        var html;
        if (data.code == '200') {
            var html = "";
            var col = data.data;
            $.each(col, function (index, item) {
                html += '<option value="' + item.assIndexId + '">' + item.assIndexName + '</option>';
            });
            $('#indexName').empty().html(html);
            $('#indexName').selectpicker('refresh');
        }
    });
}
function next() {
	nextBtn = true;
	$("#btn_save_m").click();
	if(true){
		$("#btn_save_q").click();
		if(true){
			$("#btn_save_y").click();
			if(true){
				window.location.href = portal.bp() + "/edit_4.html?assPropNum=" + assPropNum + "&operateType=" + operateType;
			}else{
				nextFlag = true;
			}
		}else{
			nextFlag = true;
		}
	}else{
		nextFlag = true;
	}
	nextBtn = false;
}

function prev() {
    window.location.href = portal.bp() + "/edit_2.html?assPropNum=" + assPropNum + "&operateType=" + operateType;
}

var columns_m = [
    {
        checkbox: true
    },
    {
        title: '序号',
        field: 'number',
        formatter: function (value, row, index) {
            row.number = index + 1;
            return index + 1;
        }
    },
    {
        title: '业务主键',
        field: 'basicInfoId',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '标识',
        field: 'flag',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNum',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNumOld',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },

    {
        title: '指标名称',
        field: 'indexName',
        clickToSelect: false,
        align: "center",
        valign: "middle",
        formatter: function (value, row, index) {
            var inNum = row.indexNum;
            var flag = row.flag;
            return '<a href="javascript:void(0)" onclick="indexModel(' + '\'' + value + '\',\'' + inNum + '\',\'' + flag + '\',\'' + index + '\',\'' + 'datatable_m' + '\')">' + value + '</a>';
        },
       /*  editable:{
              type:'select',
              source:function(){
                  $.ajax({
                      url: portal.bp() + './json/assess/getIndexParamNames.json?r='+Math.random(),
                      type: 'get',
                      async: false,
                      data: {},
                      dataType: "json"
                  }).done(function (data) {
                      if (data.code == '200') {
                          var col = data.data;
                          $.each(col, function (index, item) {
                              result.push({value:item.assIndexId,text:item.assIndexName});
                          });
                      }
                  });
                  return result;
              },
              title:'指标名称',
              placement:'top',
              emptytext:"空",
              validate:function(v){
                  var col;
                  $.ajax({
                      url: portal.bp() + './json/assess/getIndexInfoById.json?r='+Math.random(),
                      type: 'get',
                      async: false,
                      data: {'indexInfoId':v},
                      cache: false,
                      dataType: "json",
                      success:function (data) {
                          if (data.code != 200) {
                              layer.msg(data.message, {icon: 2});
                          }
                          col = data.data;
                          layer.closeAll("loading");
                      }
                  });

                  if (col == null || col == undefined) {
                      return '该信息不存在';
                  }
                  disableSiblingsAndSetValue($(this), "assIndexCateDesc", col.assIndexCateDesc);
                  disableSiblingsAndSetValue($(this), "assIndexUnit", col.assIndexUnit);
                  disableSiblingsAndSetValue($(this), "indexNum", col.assIndexId);
                  disableSiblingsAndSetValue($(this), "basicInfoId", col.basicInfoId);

              }
          }*/
    },
    {
        title: '指标类别',
        field: 'assIndexCateDesc',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true,
            validate:function(v){
                if(v!=undefined&&v!=null&&v=='定性指标'){
                    disableSiblingsAndSetValue($(this),'assIndexOrientCd');
                    $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                    $el.parent().parent().find("td").eq(5).find("a").text("定性指标");
                    disableSiblingsAndSetValue($(this),'perStatCaliCd');
                    $el.parent().parent().find("td").eq(6).find("a").text("--");
                    $el.parent().parent().find("td").eq(4).find("a").text("--");
                    disableSiblingsAndSetValue($el,'neguConvtRatio','1');
                    disableSiblingsAndSetValue($el,'whfConvtRatio','1');
                    disableSiblingsAndSetValue($el,'scoreCalcRule','E');
                    disableSiblingsAndSetValue($el,'indexM1Str','--');
                    disableSiblingsAndSetValue($el,'indexM2Str','--');
                    disableSiblingsAndSetValue($el,'indexM3Str','--');
                    disableSiblingsAndSetValue($el,'indexM4Str','--');
                    disableSiblingsAndSetValue($el,'indexM5Str','--');
                    disableSiblingsAndSetValue($el,'indexM6Str','--');
                    disableSiblingsAndSetValue($el,'indexM7Str','--');
                    disableSiblingsAndSetValue($el,'indexM8Str','--');
                    disableSiblingsAndSetValue($el,'indexM9Str','--');
                    disableSiblingsAndSetValue($el,'indexM10Str','--');
                    disableSiblingsAndSetValue($el,'indexM11Str','--');
                    disableSiblingsAndSetValue($el,'indexM12Str','--');

                }
            }
        }
    },
    {
        title: '指标单位',
        field: 'assIndexUnit',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true,
        }
    },
    {
        title: '考核指标定位',
        align: "center",
        field: 'assIndexOrientCd',
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableOrientCd("TB0011"),
            title: '考核指标定位',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
               var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v) && val != '定性指标') {
                    return "考核指标定位不能为空!";
                }
            }
        }
    },
    {
        title: '业绩统计口径',
        field: 'perStatCaliCd',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0009"),
            title: '业绩统计口径',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v)&& val != '定性指标') {
                    return "业绩统计口径不能为空!";
                }
            }
        }
    },
    {
        title: '得分计算规则',
        field: 'scoreCalcRule',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0012"),
            title: '得分计算规则',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
            	var dfrowNum = $(this).parent().parent().prevAll().length;
                ruleStr = checkScoreCeil("datatable_m",dfrowNum);
                ruleStr += checkScoreCeil("datatable_q");
                ruleStr += checkScoreCeil("datatable_y");
                if(ruleStr.indexOf('A') != -1){  //包含A
                    if((v == 'B'&&ruleStr.indexOf('C') != -1) || (v == 'C'&&ruleStr.indexOf('B') != -1)){
                        return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                    }
                }
                if(ruleStr.indexOf('B')!=-1&&ruleStr.indexOf('C')!=-1){
                	if(v=='A'){
                		return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                	}
                }
                if (!$.trim(v)) {
                    return "得分计算规则不能为空!";
                }
            }
        }
    },
    {
        title: '得分上限（倍）',
        field: 'scoreCeil',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '得分上限（倍）',
            placement: 'top',
            emptytext: "空",
            disabled: true,
            validate: function (v) {
                if (!$.trim(v)) {
                    return "得分上限不能为空!";
                }
                if(!pattern3.test(v)){
                    return "得分上限必须是整数或保留6位小数!"
                }
            }
        }
    },
    {
        title: '必保指标折算比例',
        field: 'neguConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '必保指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "必保指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "必保指标折算比例必须是0~1的整数或两位小数!"
                }
                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(11).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标'){
                    if(txt=='1'&& v != undefined && v!=null && v=='1'){
                        enableSiblings($el,'scoreCeil');
                    }else{
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');
                    }
                }

            }
        }
    },
    {
        title: '力争指标折算比例',
        field: 'whfConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '力争指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "力争指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "力争指标折算比例必须是0~1的整数或两位小数!"
                }

                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(9).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标') {
                    if (txt == '1' && v != undefined && v != null && v == '1') {
                        enableSiblings($el, 'scoreCeil');
                    } else {
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');;
                    }
                }
            }
        }
    },
    {
        title: '一月',
        field: 'indexM1Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '一月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'一月');
                }

            }
        }
    },
    {
        title: '二月',
        field: 'indexM2Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '二月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'二月');
                }
            }
        }
    },
    {
        title: '三月',
        field: 'indexM3Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '三月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'三月');
                }
            }
        }
    },
    {
        title: '四月',
        field: 'indexM4Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '四月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'四月');
                }
            }
        }
    },
    {
        title: '五月',
        field: 'indexM5Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '五月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'五月');
                }
            }
        }
    },
    {
        title: '六月',
        field: 'indexM6Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '六月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'六月');
                }
            }
        }
    },
    {
        title: '七月',
        field: 'indexM7Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '七月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'七月');
                }
            }
        }
    },
    {
        title: '八月',
        field: 'indexM8Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '八月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'八月');
                }
            }
        }
    },
    {
        title: '九月',
        field: 'indexM9Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '九月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'九月');
                }
            }
        }
    },
    {
        title: '十月',
        field: 'indexM10Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '十月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'十月');
                }
            }
        }
    },
    {
        title: '十一月',
        field: 'indexM11Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '十一月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'十一月');
                }
            }
        }
    },
    {
        title: '十二月',
        field: 'indexM12Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '十二月',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'十二月');
                }
            }
        }
    },
]

var columns_q = [

    {
        checkbox: true
    },
    {
        title: '序号',
        field: 'number',
        formatter: function (value, row, index) {
            row.number = index + 1;
            return index + 1;
        }
    },
    {
        title: '业务主键',
        field: 'basicInfoId',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '标识',
        field: 'flag',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNum',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNumOld',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标名称',
        field: 'indexName',
        clickToSelect: false,
        align: "center",
        valign: "middle",
        formatter: function (value, row, index) {
            var inNum = row.indexNum;
            var flag = row.flag;
            return '<a href="javascript:void(0)" onclick="indexModel(' + '\'' + value + '\',\'' + inNum + '\',\'' + flag + '\',\'' + index + '\',\'' + 'datatable_q' + '\')">' + value + '</a>';
        },
       /* editable:{
            type:'select',
            source:function(){
                $.ajax({
                    url: portal.bp() + './json/assess/getIndexParamNames.json?r='+Math.random(),
                    type: 'get',
                    async: false,
                    data: {},
                    dataType: "json"
                }).done(function (data) {
                    if (data.code == '200') {
                        var col = data.data;
                        $.each(col, function (index, item) {
                            result.push({value:item.assIndexId,text:item.assIndexName});
                        });
                    }
                });
                return result;
            },
            title:'指标名称',
            placement:'top',
            emptytext:"空",
            validate:function(v){
                var col;
                $.ajax({
                    url: portal.bp() + './json/assess/getIndexInfoById.json?r='+Math.random(),
                    type: 'get',
                    async: false,
                    data: {'indexInfoId':v},
                    cache: false,
                    dataType: "json",
                    success:function (data) {
                        if (data.code != 200) {
                            layer.msg(data.message, {icon: 2});
                        }
                        col = data.data;
                        layer.closeAll("loading");
                    }
                });

                if (col == null || col == undefined) {
                    return '该信息不存在';
                }
                disableSiblingsAndSetValue($(this), "assIndexCateDesc", col.assIndexCateDesc);
                disableSiblingsAndSetValue($(this), "assIndexUnit", col.assIndexUnit);
                disableSiblingsAndSetValue($(this), "indexNum", col.assIndexId);
                disableSiblingsAndSetValue($(this), "basicInfoId", col.basicInfoId);

            }
        }*/
    },
    {
        title: '指标类别',
        field: 'assIndexCateDesc',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true,
            validate:function(v){
                if(v!=undefined&&v!=null&&v=='定性指标'){
                    $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                    disableSiblingsAndSetValue($(this),'assIndexOrientCd');
                    disableSiblingsAndSetValue($(this),'perStatCaliCd');
                    $el.parent().parent().find("td").eq(4).find("a").text("--");
                    $el.parent().parent().find("td").eq(5).find("a").text("定性指标");
                    $el.parent().parent().find("td").eq(6).find("a").text("--");
                    disableSiblingsAndSetValue($el,'neguConvtRatio','1');
                    disableSiblingsAndSetValue($el,'whfConvtRatio','1');
                    disableSiblingsAndSetValue($el,'scoreCalcRule','E');
                    disableSiblingsAndSetValue($el,'indexDecProgQ1Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgQ2Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgQ3Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgQ4Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgM1Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgM2Str','--');
                    disableSiblingsAndSetValue($el,'indexDecProgM3Str','--');
                }
            }
        }
    },
    {
        title: '指标单位',
        field: 'assIndexUnit',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true
        }
    },
    {
        title: '考核指标定位',
        align: "center",
        field: 'assIndexOrientCd',
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableOrientCd("TB0011"),
            title: '考核指标定位',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v) && val != '定性指标') {
                    return "考核指标定位不能为空!";
                }
            }
        }
    },
    {
        title: '业绩统计口径',
        field: 'perStatCaliCd',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0009"),
            title: '业绩统计口径',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v)&& val != '定性指标') {
                    return "业绩统计口径不能为空!";
                }
            }
        }
    },
    {
        title: '得分计算规则',
        field: 'scoreCalcRule',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0012"),
            title: '得分计算规则',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
            	var dfrowNum = $(this).parent().parent().prevAll().length;
                ruleStr = checkScoreCeil("datatable_m");
                ruleStr += checkScoreCeil("datatable_q",dfrowNum);
                ruleStr += checkScoreCeil("datatable_y");
                if(ruleStr.indexOf('A') != -1){  //包含A
                    if((v == 'B'&&ruleStr.indexOf('C') != -1) || (v == 'C'&&ruleStr.indexOf('B') != -1)){
                        return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                    }
                }
                if(ruleStr.indexOf('B')!=-1&&ruleStr.indexOf('C')!=-1){
                	if(v=='A'){
                		return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                	}
                }
                if (!$.trim(v)) {
                    return "得分计算规则不能为空!";
                }
            }
        }
    },
    {
        title: '得分上限（倍）',
        field: 'scoreCeil',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '得分上限（倍）',
            placement: 'top',
            emptytext: "空",
            disabled: true,
            validate: function (v) {
                if (!$.trim(v)) {
                    return "得分上限不能为空!";
                }
                if(!pattern3.test(v)){
                    return "得分上限必须是整数或保留6位小数!"
                }
            }
        }
    },
    {
        title: '必保指标折算比例',
        field: 'neguConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '必保指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "必保指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "必保指标折算比例必须是0~1的整数或两位小数!"
                }

                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(11).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标'){
                    if(txt=='1'&& v != undefined && v!=null && v=='1'){
                        enableSiblings($el,'scoreCeil');
                    }else{
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');
                    }
                }
            }
        }
    },
    {
        title: '力争指标折算比例',
        field: 'whfConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '力争指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "力争指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "力争指标折算比例必须是0~1的整数或两位小数!"
                }

                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(9).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标') {
                    if (txt == '1' && v != undefined && v != null && v == '1') {
                        enableSiblings($el, 'scoreCeil');
                    } else {
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');;
                    }
                }

            }
        }
    },
    {
        title: '指标分解进度季度1',
        field: 'indexDecProgQ1Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度季度1',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol2(v,'指标分解进度季度1');
                }
            }
        }
    },
    {
        title: '指标分解进度季度2',
        field: 'indexDecProgQ2Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度季度2',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol2(v,'指标分解进度季度2');
                }
            }
        }
    },
    {
        title: '指标分解进度季度3',
        field: 'indexDecProgQ3Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度季度3',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol2(v,'指标分解进度季度3');
                }
            }
        }
    },
    {
        title: '指标分解进度季度4',
        field: 'indexDecProgQ4Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度季度4',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol2(v,'指标分解进度季度4');
                }
            }
        }
    },
    {
        title: '指标分解进度月度1',
        field: 'indexDecProgM1Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度月度1',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'指标分解进度月度1');
                }
            }
        }
    },
    {
        title: '指标分解进度月度2',
        field: 'indexDecProgM2Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度月度2',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'指标分解进度月度2');
                }
            }
        }
    },
    {
        title: '指标分解进度月度3',
        field: 'indexDecProgM3Str',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '指标分解进度月度3',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if(val != '定性指标'){
                    return checkCol(v,'指标分解进度月度3');
                }
            }
        }
    }
]

var columns_y = [

    {
        checkbox: true
    },
    {
        title: '序号',
        field: 'number',
        formatter: function (value, row, index) {
            row.number = index + 1;
            return index + 1;
        }
    },
    {
        title: '业务主键',
        field: 'basicInfoId',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '标识',
        field: 'flag',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNum',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标编号',
        field: 'indexNumOld',
        align: "center",
        valign: "middle",
        visible: false,
        editable: {
            type: 'text',
            emptytext: "空",
            disable: true
        }
    },
    {
        title: '指标名称',
        field: 'indexName',
        clickToSelect: false,
        align: "center",
        valign: "middle",
        formatter: function (value, row, index) {
            var inNum = row.indexNum;
            var flag = row.flag;
            return '<a href="javascript:void(0)" onclick="indexModel(' + '\'' + value + '\',\'' + inNum + '\',\'' + flag + '\',\'' + index + '\',\'' + 'datatable_y' + '\')">' + value + '</a>';
        },
       /* editable:{
            type:'select',
            source:function(){
                $.ajax({
                    url: portal.bp() + './json/assess/getIndexParamNames.json?r='+Math.random(),
                    type: 'get',
                    async: false,
                    data: {},
                    dataType: "json"
                }).done(function (data) {
                    if (data.code == '200') {
                        var col = data.data;
                        $.each(col, function (index, item) {
                            result.push({value:item.assIndexId,text:item.assIndexName});
                        });
                    }
                });
                return result;
            },
            title:'指标名称',
            placement:'top',
            emptytext:"空",
            validate:function(v){
                var col;
                $.ajax({
                    url: portal.bp() + './json/assess/getIndexInfoById.json?r='+Math.random(),
                    type: 'get',
                    async: false,
                    data: {'indexInfoId':v},
                    cache: false,
                    dataType: "json",
                    success:function (data) {
                        if (data.code != 200) {
                            layer.msg(data.message, {icon: 2});
                        }
                        col = data.data;
                        layer.closeAll("loading");
                    }
                });

                if (col == null || col == undefined) {
                    return '该信息不存在';
                }
                disableSiblingsAndSetValue($(this), "assIndexCateDesc", col.assIndexCateDesc);
                disableSiblingsAndSetValue($(this), "assIndexUnit", col.assIndexUnit);
                disableSiblingsAndSetValue($(this), "indexNum", col.assIndexId);
                disableSiblingsAndSetValue($(this), "basicInfoId", col.basicInfoId);

            }
        }*/
    },
    {
        title: '指标类别',
        field: 'assIndexCateDesc',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true,
            validate:function(v){
                if(v!=undefined&&v!=null&&v=='定性指标'){
                    disableSiblingsAndSetValue($(this),'assIndexOrientCd');
                    disableSiblingsAndSetValue($(this),'perStatCaliCd');
                    $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                    $el.parent().parent().find("td").eq(4).find("a").text("--");
                    $el.parent().parent().find("td").eq(5).find("a").text("定性指标");
                    $el.parent().parent().find("td").eq(6).find("a").text("--");
                    disableSiblingsAndSetValue($el,'neguConvtRatio','1');
                    disableSiblingsAndSetValue($el,'whfConvtRatio','1');
                    disableSiblingsAndSetValue($el,'scoreCalcRule','E');

                }
            }
        }
    },
    {
        title: '指标单位',
        field: 'assIndexUnit',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            emptytext: "空",
            disabled: true
        }
    },
    {
        title: '考核指标定位',
        align: "center",
        field: 'assIndexOrientCd',
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableOrientCd("TB0011"),
            title: '考核指标定位',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v) && val != '定性指标') {
                    return "考核指标定位不能为空!";
                }
            }
        }
    },
    {
        title: '业绩统计口径',
        field: 'perStatCaliCd',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0009"),
            title: '业绩统计口径',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                var val =  getSiblingsValue($(this),'assIndexCateDesc');
                if (!$.trim(v)&& val != '定性指标') {
                    return "业绩统计口径不能为空!";
                }
            }
        }
    },
    {
        title: '得分计算规则',
        field: 'scoreCalcRule',
        align: "center",
        valign: "middle",
        editable: {
            type: 'select',
            source: $.param.getTableParam("TB0012"),
            title: '得分计算规则',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
            	var dfrowNum = $(this).parent().parent().prevAll().length;
                ruleStr = checkScoreCeil("datatable_m");
                ruleStr += checkScoreCeil("datatable_q");
                ruleStr += checkScoreCeil("datatable_y",dfrowNum);
                if(ruleStr.indexOf('A') != -1){  //包含A
                    if((v == 'B'&&ruleStr.indexOf('C') != -1) || (v == 'C'&&ruleStr.indexOf('B') != -1)){
                        return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                    }
                }
                if(ruleStr.indexOf('B')!=-1&&ruleStr.indexOf('C')!=-1){
                	if(v=='A'){
                		return "同一考核方案中不同指标不可同时存在 A+B 或 A+C";
                	}
                }
                if (!$.trim(v)) {
                    return "得分计算规则不能为空!";
                }
            }
        }
    },
    {
        title: '得分上限（倍）',
        field: 'scoreCeil',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '得分上限（倍）',
            placement: 'top',
            emptytext: "空",
            disabled: true,
            validate: function (v) {
                if (!$.trim(v)) {
                    return "得分上限不能为空!";
                }
                if(!pattern3.test(v)){
                    return "得分上限必须是整数或保留6位小数!"
                }
            }
        }
    },
    {
        title: '必保指标折算比例',
        field: 'neguConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '必保指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "必保指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "必保指标折算比例必须是0~1的整数或两位小数!"
                }
                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(11).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标'){
                    if(txt=='1'&& v != undefined && v!=null && v=='1'){
                        enableSiblings($el,'scoreCeil');
                    }else{
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');
                    }
                }
            }
        }
    },
    {
        title: '力争指标折算比例',
        field: 'whfConvtRatio',
        align: "center",
        valign: "middle",
        editable: {
            type: 'text',
            title: '力争指标折算比例',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
                if (!$.trim(v)) {
                    return "力争指标折算比例不能为空!";
                }
                if(!pattern1.test(v)){
                    return "力争指标折算比例必须是0~1的整数或两位小数!"
                }
                $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                var txt = $el.parent().parent().find("td").eq(9).find("a").text();
                var ascCat =  $el.parent().parent().find("td").eq(3).find("a").text();
                if(ascCat !='定性指标') {
                    if (txt == '1' && v != undefined && v != null && v == '1') {
                        enableSiblings($el, 'scoreCeil');
                    } else {
                        disableSiblingsAndSetValue($(this),"scoreCeil",'1');;
                    }
                }

            }
        }
    }
]

    //月度指标
    function table_m_query() {
        $("#datatable_m").bootstrapTable('destroy');
        $('#datatable_m').bootstrapTable({
            url: portal.bp() + './json/assess/queryTable.json?r=' + Math.random(),
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
                var queryParams = {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'indexType': '1',
                    'assPropNum': assPropNum
                }
                return queryParams;
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [10, 25, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: 300, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    oldTable = JSON.parse(JSON.stringify(res.data));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                initBootStrapTablevalidateEdit($("#datatable_m"));
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#datatable_m").bootstrapTable("resetView");
                if (row.indexNum != null && row.indexNum != '') {
                    //修改
                    $.each(oldTable.rows, function (index, item) {
                        if (item.indexNum === row.indexNum && row.isAdd != true) {
                            if (eval("item." + field) === eval("row." + field)) {
                                $el.removeClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                delete row.updateCell[field];
                            } else {
                                $el.addClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                row.updateCell[field] = '1';
                            }
                        }
                    });
                }
            },
            columns: columns_m,
            rowStyle: rowStyle,

        });
    }
    //季度指标
    //月度指标
    function table_q_query() {
        $("#datatable_q").bootstrapTable('destroy');
        $('#datatable_q').bootstrapTable({
            url: portal.bp() + './json/assess/queryTable.json?r=' + Math.random(),
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
                var queryParams = {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'indexType': '2',
                    'assPropNum': assPropNum
                }
                return queryParams;
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [10, 25, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: 300, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    oldTable = JSON.parse(JSON.stringify(res.data));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                initBootStrapTablevalidateEdit($("#datatable_q"));
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#datatable_q").bootstrapTable("resetView");
                if (row.indexNum != null && row.indexNum != '') {
                    //修改
                    $.each(oldTable.rows, function (index, item) {
                        if (item.indexNum === row.indexNum && row.isAdd != true) {
                            if (eval("item." + field) === eval("row." + field)) {
                                $el.removeClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                delete row.updateCell[field];
                            } else {
                                $el.addClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                row.updateCell[field] = '1';
                            }
                        }
                    });
                }
            },
            columns: columns_q,
            rowStyle: rowStyle,

        });
    }
    //年度指标
function table_y_query() {
        $("#datatable_y").bootstrapTable('destroy');
        $('#datatable_y').bootstrapTable({
            url: portal.bp() + './json/assess/queryTable.json?r=' + Math.random(),
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
                var queryParams = {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'indexType': '3',
                    'assPropNum': assPropNum
                }
                return queryParams;
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [10, 25, 50],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: 300, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    oldTable = JSON.parse(JSON.stringify(res.data));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                initBootStrapTablevalidateEdit($("#datatable_y"));
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#datatable_y").bootstrapTable("resetView");
                if (row.indexNum != null && row.indexNum != '') {
                    //修改
                    $.each(oldTable.rows, function (index, item) {
                        if (item.indexNum === row.indexNum && row.isAdd != true) {
                            if (eval("item." + field) === eval("row." + field)) {
                                $el.removeClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                delete row.updateCell[field];
                            } else {
                                $el.addClass('update-cell-data');
                                //修改标志
                                if (row.updateCell == undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                row.updateCell[field] = '1';
                            }
                        }
                    });
                }
            },
            columns: columns_y,
            rowStyle: rowStyle,

        });
    }


/**
 *
 * 指标名称弹出修改
 * @param indexNum
 * @param indexName
 */
function indexModel(value,rowNum,flag,index,tableId) {
    valueQ = value;
    rowNumQ =rowNum;
    flagQ =flag ;
    indexQ = index;
    tableIdQ = tableId;
    numStr = checkIndexUniq("datatable_m");
    numStr += checkIndexUniq("datatable_q");
    numStr += checkIndexUniq("datatable_y");
    $("#index_Modal").modal("show");
    $("#index_line").selectpicker('val',"uncheck").selectpicker('refresh');
    $("#index_cateCd").selectpicker('val',"uncheck").selectpicker('refresh');
    
    $("#index_Modal").modal("show");
    
    //默认选中第一个
	document.getElementById("index_line").options.selectedIndex = 1;
	$("#index_line").selectpicker('refresh');
	document.getElementById("index_cateCd").options.selectedIndex = 1;
	$("#index_cateCd").selectpicker('refresh');
	changeIndexLineOrCateCd();
	
    /*var col;
    $.ajax({
        url: portal.bp() + './json/assess/getIndexParamNames.json?r=' + Math.random(),
        type: 'get',
        async: false,
        data: {},
        dataType: "json"
    }).done(function (data) {
        var html;
        if (data.code == '200') {
            var html = "";
            var col = data.data;
            $.each(col, function (index, item) {
                html += '<option value="' + item.assIndexId + '">' + item.assIndexName + '</option>';
            });
            $('#indexName').empty().html(html);
            $('#indexName').selectpicker('refresh');
        }
    });*/
    


}



/**
 * 校验小数和分数
 */
function checkCol(val,name){
    var r1 = /^[1-9]+[0-9]*\/[1-9]+[0-9]*$/;
    if (!$.trim(val)) {
    	if(name) return name+",不能为空";
        return "不能为空!";
    }
    
	if(!pattern1.test(val)&&!r1.test(val)){
		if(name) return name+",所填数字必须是小于1的整数或两位小数或者分数!";
	    return "所填数字必须是小于1的整数或两位小数或者分数!";
	}
    

}
function checkCol2(val,name){
    //var r = /^\d{1,2}(\.\d{1,2})?$/;
    if (!$.trim(val)) {
    	if(name) return name+",不能为空!";
        return "不能为空!";
    }
    
	if(!pattern1.test(val)){
		if(name) return name+",所填数字必须是0~1的整数或保留两位小数!";
	    return "所填数字必须是0~1的整数或保留两位小数!";
	}
    

}


/**
 * 校验指标不可重复
 */
function checkIndexUniq(tableId) {
    var str = '';
    var rows = $("#"+tableId).bootstrapTable("getData");
    for (var i = 0; i < rows.length; i++) {
        str += ","+rows[i].indexNum;
    }
    return str;
}

/**
 * 得分计算规则中不能同时存在A+B 或A+C
 *
 */

function checkScoreCeil(tableId,rowNum){
    var str = '';
    var rows = $("#"+tableId).bootstrapTable("getData");
    for (var i = 0; i < rows.length; i++) {
    	if(rowNum!=undefined&&rowNum!=null&&i==rowNum){
    		
    	}else{
    		str += ","+rows[i].scoreCalcRule;
    	}
    }
    return str;
}
/**
 * 是否是分数
 * @param fs
 * @returns {Boolean}
 */
function isfs(fs){
	if(fs!=null&&fs.indexOf("/")>-1){
		return true;
	}
	return false;
}
/**
 * 分数转小数
 * @param fs
 */
function fsToxs(fs){
	if(fs.indexOf("/")>-1){
		//分数
		return fs.split("/")[0]/fs.split("/")[1];
	}else{
		return fs;
	}
}
/**
校验月度指标的12个月分解进度相加是否等于1
全分数，则全部换算成分数后计算分子是否等于分母
有分数，也有小数，则全部换算成小数后计算是否等于1
 */
function checkIndexM(item){
	if(isfs(item.indexM1Str)
			&&isfs(item.indexM2Str)
			&&isfs(item.indexM3Str)
			&&isfs(item.indexM4Str)
			&&isfs(item.indexM5Str)
			&&isfs(item.indexM6Str)
			&&isfs(item.indexM7Str)
			&&isfs(item.indexM8Str)
			&&isfs(item.indexM9Str)
			&&isfs(item.indexM10Str)
			&&isfs(item.indexM11Str)
			&&isfs(item.indexM12Str)
			){
		//全部是分数
		var fenmu = item.indexM1Str.split("/")[1]*
					item.indexM2Str.split("/")[1]*
					item.indexM3Str.split("/")[1]*
					item.indexM4Str.split("/")[1]*
					item.indexM5Str.split("/")[1]*
					item.indexM6Str.split("/")[1]*
					item.indexM7Str.split("/")[1]*
					item.indexM8Str.split("/")[1]*
					item.indexM9Str.split("/")[1]*
					item.indexM10Str.split("/")[1]*
					item.indexM11Str.split("/")[1]*
					item.indexM12Str.split("/")[1];
		/*var fenzi = (fenmu/item.indexM1Str.split("/")[1])*item.indexM1Str.split("/")[0]
					+(fenmu/item.indexM2Str.split("/")[1])*item.indexM2Str.split("/")[0]
					+(fenmu/item.indexM3Str.split("/")[1])*item.indexM3Str.split("/")[0]
					+(fenmu/item.indexM4Str.split("/")[1])*item.indexM4Str.split("/")[0]
					+(fenmu/item.indexM5Str.split("/")[1])*item.indexM5Str.split("/")[0]
					+(fenmu/item.indexM6Str.split("/")[1])*item.indexM6Str.split("/")[0]
					+(fenmu/item.indexM7Str.split("/")[1])*item.indexM7Str.split("/")[0]
					+(fenmu/item.indexM8Str.split("/")[1])*item.indexM8Str.split("/")[0]
					+(fenmu/item.indexM9Str.split("/")[1])*item.indexM9Str.split("/")[0]
					+(fenmu/item.indexM10Str.split("/")[1])*item.indexM10Str.split("/")[0]
					+(fenmu/item.indexM11Str.split("/")[1])*item.indexM11Str.split("/")[0]
					+(fenmu/item.indexM12Str.split("/")[1])*item.indexM12Str.split("/")[0];
		*/
		var M1 = (fenmu/item.indexM1Str.split("/")[1])*item.indexM1Str.split("/")[0];
		var M2 = (fenmu/item.indexM2Str.split("/")[1])*item.indexM2Str.split("/")[0];
		var M3 = (fenmu/item.indexM3Str.split("/")[1])*item.indexM3Str.split("/")[0];
		var M4 = (fenmu/item.indexM4Str.split("/")[1])*item.indexM4Str.split("/")[0];
		var M5 = (fenmu/item.indexM5Str.split("/")[1])*item.indexM5Str.split("/")[0];
		var M6 = (fenmu/item.indexM6Str.split("/")[1])*item.indexM6Str.split("/")[0];
		var M7 = (fenmu/item.indexM7Str.split("/")[1])*item.indexM7Str.split("/")[0];
		var M8 = (fenmu/item.indexM8Str.split("/")[1])*item.indexM8Str.split("/")[0];
		var M9 = (fenmu/item.indexM9Str.split("/")[1])*item.indexM9Str.split("/")[0];
		var M10 = (fenmu/item.indexM10Str.split("/")[1])*item.indexM10Str.split("/")[0];
		var M11 = (fenmu/item.indexM11Str.split("/")[1])*item.indexM11Str.split("/")[0];
		var M12 = (fenmu/item.indexM12Str.split("/")[1])*item.indexM12Str.split("/")[0];
		
		if(M2<M1){
			return false;
		}else if(M3<M2){
			return false;
		}else if(M4<M3){
			return false;
		}else if(M5<M4){
			return false;
		}else if(M6<M5){
			return false;
		}else if(M7<M6){
			return false;
		}else if(M8<M7){
			return false;
		}else if(M9<M8){
			return false;
		}else if(M10<M9){
			return false;
		}else if(M11<M10){
			return false;
		}else if(M12<M11){
			return false;
		}
		return M12==fenmu;
	}else{
		//有分数，有小数
		//全部小数
		/*var r = parseFloat(fsToxs(item.indexM1Str))
				+parseFloat(fsToxs(item.indexM2Str))
				+parseFloat(fsToxs(item.indexM3Str))
				+parseFloat(fsToxs(item.indexM4Str))
				+parseFloat(fsToxs(item.indexM5Str))
				+parseFloat(fsToxs(item.indexM6Str))
				+parseFloat(fsToxs(item.indexM7Str))
				+parseFloat(fsToxs(item.indexM8Str))
				+parseFloat(fsToxs(item.indexM9Str))
				+parseFloat(fsToxs(item.indexM10Str))
				+parseFloat(fsToxs(item.indexM11Str))
				+parseFloat(fsToxs(item.indexM12Str));*/
		
		var M1 = parseFloat(fsToxs(item.indexM1Str));
		var M2 = parseFloat(fsToxs(item.indexM2Str));
		var M3 = parseFloat(fsToxs(item.indexM3Str));
		var M4 = parseFloat(fsToxs(item.indexM4Str));
		var M5 = parseFloat(fsToxs(item.indexM5Str));
		var M6 = parseFloat(fsToxs(item.indexM6Str));
		var M7 = parseFloat(fsToxs(item.indexM7Str));
		var M8 = parseFloat(fsToxs(item.indexM8Str));
		var M9 = parseFloat(fsToxs(item.indexM9Str));
		var M10 = parseFloat(fsToxs(item.indexM10Str));
		var M11 = parseFloat(fsToxs(item.indexM11Str));
		var M12 = parseFloat(fsToxs(item.indexM12Str));
		
		if(M2<M1){
			return false;
		}else if(M3<M2){
			return false;
		}else if(M4<M3){
			return false;
		}else if(M5<M4){
			return false;
		}else if(M6<M5){
			return false;
		}else if(M7<M6){
			return false;
		}else if(M8<M7){
			return false;
		}else if(M9<M8){
			return false;
		}else if(M10<M9){
			return false;
		}else if(M11<M10){
			return false;
		}else if(M12<M11){
			return false;
		}
		return M12==1;
	}
}
/**
 * 季度指标四个季度合计为1
 */
function checkIndexQ(item){
	var r =  parseFloat(fsToxs(item.indexDecProgQ1Str))
			+parseFloat(fsToxs(item.indexDecProgQ2Str))
			+parseFloat(fsToxs(item.indexDecProgQ3Str))
			+parseFloat(fsToxs(item.indexDecProgQ4Str));
	return r.toFixed(9)==1;
}
/**
 * 季度指标三个月合计为1
 * 全分数，则全部换算成分数后计算分子是否等于分母
 * 有分数，也有小数，则全部换算成小数后计算是否等于1
 */
function checkIndexQM(item){
	if(isfs(item.indexDecProgM1Str)
			&&isfs(item.indexDecProgM2Str)
			&&isfs(item.indexDecProgM3Str)
			){
		//全部是分数
		var fenmu = item.indexDecProgM1Str.split("/")[1]*
					item.indexDecProgM2Str.split("/")[1]*
					item.indexDecProgM3Str.split("/")[1];
		var fenzi = (fenmu/item.indexDecProgM1Str.split("/")[1])*item.indexDecProgM1Str.split("/")[0]
					+(fenmu/item.indexDecProgM2Str.split("/")[1])*item.indexDecProgM2Str.split("/")[0]
					+(fenmu/item.indexDecProgM3Str.split("/")[1])*item.indexDecProgM3Str.split("/")[0];
		return fenmu==fenzi;
	}else{
		//有分数，有小数
		//全部小数
		var r =  parseFloat(fsToxs(item.indexDecProgM1Str))
				+parseFloat(fsToxs(item.indexDecProgM2Str))
				+parseFloat(fsToxs(item.indexDecProgM3Str));
		return r.toFixed(9)==1;
	}
}


