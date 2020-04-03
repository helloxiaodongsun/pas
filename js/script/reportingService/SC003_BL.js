//删除id数组
var deleteIds = [];
var date = $.param.getEtlDate();
$(function(){
    //初始化报表说明(备注)
    $.ajax({
        url: portal.bp() + '/table/queryNote',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {
            'tableName': 'R_INTER_STL_QTTY_QRY_ADDT_RCRD_INFO-SC003_BL'
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

    //新增行
    //alert(empNum+"-"+date);
    $("#btn_add").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var addtRcrdDt = getSystemDate("yyyy-MM-dd HH:mm:ss");
        $("#table1").bootstrapTable("insertRow",{
            index:length,
            row:{
                isAdd : true,
                sub_brch_num	:'',
                sub_brch_name	:'',
                reg_line_num	:'',
                reg_line_name	:'',
                org_code :'',
                cust_name	:'',
                dmt_card_stl_qtty_nego_pay	:'',
                inter_card_stl_qtty_nego_pay	:'',
                adj_item :'',
                data_dt	:'',
                addt_rcrd_tm	:addtRcrdDt,
                addt_rcrd_person_empno	:empNum,
            }
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));
    });
    //删除行
    $("#btn_del").click(function(){
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
        var ids=[];

        $.each(checklist,function(index,item){
            ids.push(item.number);
            if(item.addt_rcrd_id!=undefined&&item.addt_rcrd_id!=null&&item.addt_rcrd_id!=''){
                deleteIds.push(item.addt_rcrd_id);
            }
        });
        $("#table1").bootstrapTable("remove",{
            field:'number',
            values:ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));

    });
    //保存
    $("#btn_save").click(function(){
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
            if(item.addt_rcrd_id!=undefined&&item.addt_rcrd_id!=null&&item.addt_rcrd_id!=''){
                //修改数据
                if(item.updateCell&&Object.keys(item.updateCell).length>0){
                    updateData.push(item)
                }
            }else{
                //新增数据
                addData.push(item);
            }
        });
        if(addData.length==0&&updateData.length==0&&deleteData==0){
            layer.msg("没有任何修改，无需保存",{icon:3});
            return;
        }

        var data = {
            "addData":addData,
            "updateData":updateData,
            "deleteData":deleteData
        };
        var index;
        $.ajax({
            url:portal.bp() + '/table/addRecord/SC003_BLsaveAll',
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
    query();
});
//查询
function query() {
    deleteIds = [];
    $('#table1').bootstrapTable('destroy');
    TableObjPage.table1();
    $('#table2').bootstrapTable('destroy');
    TableObjPageHistory.table2();
}


var oldTable;
var TableObjPage = {
    table1: function () {
        var columns =
            [
                {
                    field:'check',
                    checkbox:true,
                },
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
                    field:'sub_brch_num',
                    title:'支行编号',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'支行编号',
                        placement:'top',
                        emptytext:"空",
                        validate: function (v) {
                            $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                            if (v==null||v==''){
                                return '支行编号为必输项';
                            }else{
                                var branchInfo = $.param.getBranchInfo(v);
                                if(branchInfo==null||branchInfo.length==0){
                                    return '支行编号不存在';
                                }else{
                                    var rowIndex = $el.parent().parent().prevAll().length;
                                    var tableData = $("#table1").bootstrapTable("getData");
                                    tableData[rowIndex].sub_brch_id = branchInfo[0].lev5_org_id;
                                    disableSiblingsAndSetValue($el,"sub_brch_name",branchInfo[0].lev5_org_name);
                                    disableSiblingsAndSetValue($el,"reg_line_num",branchInfo[0].lev4_reg_line_org_num);
                                    disableSiblingsAndSetValue($el,"reg_line_name",branchInfo[0].lev4_reg_line_name);

                                }
                            }
                        }
                    }
                },
                {
                    field:'sub_brch_name',
                    title:'支行名称',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'支行名称',
                        placement:'top',
                        disabled: true,
                        emptytext:"空",
                        validate: function (v) {
                            $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                            var rowIndex = $el.parent().parent().prevAll().length;
                            var tableData = $("#table1").bootstrapTable("getData");
                            if(tableData[rowIndex].addt_rcrd_id!=undefined&&tableData[rowIndex].addt_rcrd_id!=null&&tableData[rowIndex].addt_rcrd_id!=''){
                                //支行编号、组织机构代码、业务发生日期不可修改
                                /*disableSiblings($el,"lev5OrgNum");
                                disableSiblings($el,"custOrgCode");
                                disableSiblings($el,"bizDt");*/
                            }
                        }
                    }
                },
                {
                    field:'reg_line_num',
                    title:'管辖行编号',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'管辖行编号',
                        placement:'top',
                        disabled: true,
                        emptytext:"空",
                    }
                },
                {
                    field:'reg_line_name',
                    title:'管辖行名称',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'管辖行名称',
                        disabled: true,
                        placement:'top',
                        emptytext:"空",
                    }
                },
                {
                    field:'org_code',
                    title:'组织机构代码',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'组织机构代码',
                        placement:'top',
                        emptytext:"空",
                        validate: function (v) {
                            if (v==null||v=='') return '组织机构代码为必输项';
                            if(v.length>33){
                                return "组织机构代码过长";
                            }     
                            var orgCode = v;
                            var info = $.param.findExistOrgCode_SC003(orgCode);
                            $el = $(this)[0]['$element'] === undefined?$(this):$(this)[0]['$element'];
                    		if(info==null||info.length==0){	
                    			return '组织机构代码不存在';
                    			//enableSiblings($el,"cust_name");
                    		}else{
                    			disableSiblingsAndSetValue($el,"cust_name",info.cust_name);
                    		}
                    	}
                        
                    }
                },
                {
                    field:'cust_name',
                    title:'客户名称',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'text',
                        title:'客户名称',
                        placement:'top',
                        emptytext:"空",
                        disabled: true,
                        validate: function (v) {
                            if(v.length>100){
                                return "客户名称过长";
                            }
                        }
                    }
                },
                {
                    field:'dmt_card_stl_qtty_nego_pay',
                    title:'国内证结算量议付',
                    align: "center",
                    valign: "middle",
                    formatter:function(v,row,index){
						if(v){
							return v;
						} else{
							return '';
						}
					 },
                    editable:{
                        type:'text',
                        title:'国内证结算量议付',
                        placement:'top',
                        emptytext:"空",
                        validate: function (v) {
                            //if (v==null||v=='') return '必输项';
                            if (v!=null&&v!=''&&!checkFloat(v)) return '国内证结算量议付必须是数字';
                        }
                    }
                },
                {
                    field:'inter_card_stl_qtty_nego_pay',
                    title:'国际证结算量议付',
                    align: "center",
                    valign: "middle",
                    formatter:function(v,row,index){
						if(v){
							return v;
						} else{
							return '';
						}
					 },
                    editable:{
                        type:'text',
                        title:'国际证结算量议付',
                        placement:'top',
                        emptytext:"空",                      
                        validate: function (v) {
                            //if (v==null||v=='') return '必输项';
                            if (v!=null&&v!=''&&!checkFloat(v)) return '国际证结算量议付必须是数字';
                        }
                    }
                },
                {
                    field:'adj_item',
                    title:'调整项',
                    align: "center",
                    valign: "middle",
                    formatter:function(v,row,index){
						if(v){
							return v;
						} else{
							return '';
						}
					 },
                    editable:{
                        type:'text',
                        title:'调整项',
                        placement:'top',
                        emptytext:"空",
                        validate: function (v) {
                            //if (v==null||v=='') return '必输项';
                            if (v!=null&&v!=''&&!checkFloat(v)) return '调整项必须是数字';
                        }
                    }
                },
                {
                    field:'data_dt',
                    title:'业务日期',
                    align: "center",
                    valign: "middle",
                    editable:{
                        type:'date',
                        title:'业务日期',
                        format:'yyyy-mm-dd',
                        placement:'left',
                        emptytext:"空",
                        validate: function (v) {
                            if (v==null||v=='') return '业务日期为必输项';
                        }

                    }
                },                
                {
                    field:'addt_rcrd_tm',
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
        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/addRecord/SC003_BLquery',
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
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50,100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable:true,			//是否可调整列宽度
            //height:getTableHeight(document), //表格固定高度
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
                initBootStrapTablevalidateEdit($("#table1"));
                resizeTables();
            },
            onEditableSave:function(field,row,oldValue,$el){
                $("#table1").bootstrapTable("resetView");
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
                    field:'sub_brch_num',
                    title:'支行编号',
                    align: "center",
                    valign: "middle",
  
                },
                {
                    field:'sub_brch_name',
                    title:'支行名称',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'reg_line_num',
                    title:'管辖行编号',
                    align: "center",
                    valign: "middle",
                   
                },
                {
                    field:'reg_line_name',
                    title:'管辖行名称',
                    align: "center",
                    valign: "middle",
                   
                },
                {
                    field:'org_code',
                    title:'组织机构代码',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'cust_name',
                    title:'客户名称',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'dmt_card_stl_qtty_nego_pay',
                    title:'国内证结算量议付',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'inter_card_stl_qtty_nego_pay',
                    title:'国际证结算量议付',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'adj_item',
                    title:'调整项',
                    align: "center",
                    valign: "middle",
                    
                },
                {
                    field:'data_dt',
                    title:'业务日期',
                    align: "center",
                    valign: "middle",
                    
                },                
                {
                    field:'addt_rcrd_tm',
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
        $('#table2').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/addRecord/SC003_BLqueryAll',
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
                };
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
}


		
