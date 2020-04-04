var oldTable;

//大于等于0的整数或两位小数,最大99999.99
var pattern2 = /^(([1-9][0-9]{0,4})|0)(\.\d{1,2})?$/;

$(function () {
    var step1 = new SetStep({
        content: '.stepCont1',
        textMaxWidth: 120,
        steps: ['方案基本信息', '选择考核对象', '占比分配'],
        stepCounts: 3,
        curStep: 3,
    });
    $("#btn_GS").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("GS");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    		var length = $("#datatable").bootstrapTable("getData").length;
            $("#datatable").bootstrapTable("insertRow", {
                index: length,
                row: {
                    isAdd: true,
                    professionType: 'GS',
                    indexWeiZTStr:'',
                }
            });
            //更新表中修改过字段的颜色
            updateCellDataClass($("#datatable"));
            $('#datatable').bootstrapTable('resetView');
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    		$("#datatable").bootstrapTable("remove", {
	            field: 'professionType',
	            values: ['GS']
	        });
    		//更新表中修改过字段的颜色
	        updateCellDataClass($("#datatable"));
    	}
    	
    	
    });
    $("#btn_LS").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("LS");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    		var length = $("#datatable").bootstrapTable("getData").length;
            $("#datatable").bootstrapTable("insertRow", {
                index: length,
                row: {
                    isAdd: true,
                    professionType: 'LS',
                    indexWeiZTStr:'',
                }
            });
            //更新表中修改过字段的颜色
            updateCellDataClass($("#datatable"));
            $('#datatable').bootstrapTable('resetView');
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    		$("#datatable").bootstrapTable("remove", {
	            field: 'professionType',
	            values: ['LS']
	        });
    		//更新表中修改过字段的颜色
	        updateCellDataClass($("#datatable"));
    	}
    	
    	
    });
    $("#btn_SC").click(function(e){
    	if($(this).hasClass("btn-default")){
    		var c = checkObjAndProfessionType("SC");
    		if(c!=null&&c!=''){
    			if(c=='000000'){
    				return;
    			}
    			layer.msg(c+",不存在此项考核业务的规范性考核方案中",{icon:3});
    			return;
    		}
    		$(this).removeClass("btn-default");
    		$(this).addClass("btn-info");
    		
    		var length = $("#datatable").bootstrapTable("getData").length;
            $("#datatable").bootstrapTable("insertRow", {
                index: length,
                row: {
                    isAdd: true,
                    professionType: 'SC',
                    indexWeiZTStr:'',
                }
            });
            //更新表中修改过字段的颜色
            updateCellDataClass($("#datatable"));
            $('#datatable').bootstrapTable('resetView');
    	}else{
    		$(this).removeClass("btn-info");
    		$(this).addClass("btn-default");
    		
    		$("#datatable").bootstrapTable("remove", {
	            field: 'professionType',
	            values: ['SC']
	        });
    		//更新表中修改过字段的颜色
	        updateCellDataClass($("#datatable"));
    	}
    	
    });
    
    table_query();

});
/**
 * 校验所有考核对象是否存在考核类别下
 * @param professionType
 */
function checkObjAndProfessionType(professionType){
	var res = null;
	$.ajax({
        url: portal.bp() + './json/assess/profession/checkObjAndProfessionType.json?r=' + Math.random(),
        type: 'post',
        cache: false,
        async:false,
        dataType: "json",
        data: {
        	'professionType':professionType,
        	'assPropNum': assPropNum
        },
        success: function (data) {
            if (data.code == '200') {
            	res = data.data;
            } else {
            	res = "000000";
                layer.msg(data.message, {icon: 2});
            }
        },
        beforeSend: function (XMLHttpRequest) {
            index = layerLoad();
        },
        complete: function (XMLHttpRequest) {
            layerClose(index);
        }
    });
	return res;
}
function save(){
    //bootstrapTable 编辑列表校验
    var validateError = validateBootStrapTableEdit($("#datatable"));
    if(validateError!=null){
        // layer.msg(validateError,{icon:2});
        return;
    }
    var tableData = $("#datatable").bootstrapTable("getData");
    var index;
    var data = {
        'assProfessionQZMgmtDTO': tableData,
        'assPropNum': assPropNum
    }

    $.ajax({
        url: portal.bp() + './json/assess/profession/saveNotTSH.json?r=' + Math.random(),
        type: 'post',
        cache: false,
        async:false,
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            if (data.code == '200') {
            	layer.msg("保存成功",{icon:1});
            } else {
                layer.msg(data.message, {icon: 2});
            }
        },
        beforeSend: function (XMLHttpRequest) {
            index = layerLoad();
        },
        complete: function (XMLHttpRequest) {
            layerClose(index);
        }
    });

}
function todo() {
	//bootstrapTable 编辑列表校验
    var validateError = validateBootStrapTableEdit($("#datatable"));
    if(validateError!=null){
        layer.msg(validateError,{icon:2});
        return;
    }
    var tableData = $("#datatable").bootstrapTable("getData");
    var index;
    var data = {
        'assProfessionQZMgmtDTO': tableData,
        'assPropNum': assPropNum
    }

    $.ajax({
        url: portal.bp() + './json/assess/profession/saveNotTSH.json?r=' + Math.random(),
        type: 'post',
        cache: false,
        async:false,
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            if (data.code == '200') {
            	todo_2();
            } else {
                layer.msg(data.message, {icon: 2});
            }
        },
        beforeSend: function (XMLHttpRequest) {
            index = layerLoad();
        },
        complete: function (XMLHttpRequest) {
            layerClose(index);
        }
    });
}
function todo_2(){
	$.ajax({
        url : portal.bp() + './json/assess/assessTodo.json?r='+Math.random(),
        type:'post',
        cache:false,
        dataType: "json",
        data:{'assPropNums':[assPropNum]},
        success : function(data) {
            if(data.code=='200'){
            	layer.msg('提交成功',{icon:1});
            	if(operateType=='2'){
            		//修改
            		window.location.href=portal.bp()+ "/assess_index.html?mid=2100";
            	}else{
            		window.location.href=portal.bp()+ "/edit_1.html?operateType=1";
            	}
            }else{
                layer.msg(data.message, {icon: 2});
            }
        },
    });
}
function prev() {
    window.location.href = portal.bp() + "/edit_2.html?assPropNum=" + assPropNum + "&operateType=" + operateType;
}

var columns = [
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
    	title:'类别',
    	field:'professionType',
    	formatter: function (value, row, index) {
    		return $.param.getDisplay('PROFESSION_TYPE', value);
        }
    },
    {
    	title:'占整体得分权重(%)',
    	field:'indexWeiZTStr',
    	align: "center",
        valign: "middle",
        formatter: function (value, row, index) {
            return value==null?'':value;
        },
        editable: {
            type: 'text',
            title: '占整体得分权重(%)',
            placement: 'top',
            emptytext: "空",
            validate: function (v) {
            		if(v==null||v==''){
            			return "占整体得分权重必填";
            		}
            		if (isNaN(v)) {
            			return "占整体得分权重必须是数字";
            		}
            		
            		
            		if (!pattern2.test(v)) {
            			return '占整体得分权重必须是大于等于0小于等于100的整数';
            		}
            		var floatFormat = parseFloat(v);
            		if (floatFormat > 100 || floatFormat < 0) {
            			return '占整体得分权重必须是大于等于0小于等于100的整数';
            		}
            }
        }
    },
]


function table_query() {
    $("#datatable").bootstrapTable('destroy');
    $('#datatable').bootstrapTable({
        url: portal.bp() + './json/assess/profession/queryNotTSH.json?r=' + Math.random(),
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
            var queryParams = {
                'assPropNum': assPropNum
            }
            return queryParams;
        },
        clickToSelect: true,    //是否启用点击选中行
        resizable: true,			//是否可调整列宽度
        height: 300, //表格固定高度
        responseHandler: function (res) { //服务端返回数据
            if (res.code == '200') {
                oldTable = JSON.parse(JSON.stringify(res.data==null?[]:res.data));
                return res.data==null?[]:res.data;
            } else {
                layer.msg(res.message, {icon: 2});
                return {};
            }
        },
        onLoadSuccess: function (data) {
        	$.each(data,function(index,item){
        		if(item.professionType=='GS'){
        			$("#btn_GS").removeClass("btn-default");
        			$("#btn_GS").addClass("btn-info");
        		}else if(item.professionType=='LS'){
        			$("#btn_LS").removeClass("btn-default");
        			$("#btn_LS").addClass("btn-info");
        		}else if(item.professionType=='SC'){
        			$("#btn_SC").removeClass("btn-default");
        			$("#btn_SC").addClass("btn-info");
        		}
        	})
            initBootStrapTablevalidateEdit($("#datatable"));
        	resizeTables();
        },
        onEditableSave: function (field, row, oldValue, $el) {
            $("#datatable").bootstrapTable("resetView");
            if (row.professionType != null && row.professionType != '') {
                //修改
                $.each(oldTable, function (index, item) {
                    if (item.professionType === row.professionType && row.isAdd != true) {
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
        columns: columns,
        rowStyle: rowStyle,

    });
}

function isNull(str){
	return str==null||str=='';
}