//删除id数组
var deleteIds = [];
var bodyIndex = 0;
var date = $.param.getEtlDate();
//菜单id
var mid = getUrlParam('mid');
$(function () {

    //新增行
    $("#btn_add").click(function () {
        var length = $("#table1").bootstrapTable("getData").length;
        var addtRcrdTm = getSystemDate("yyyy-MM-dd HH:mm:ss");
        $("#table1").bootstrapTable("insertRow", {
            index: length,
            row: {
                isAdd: true,
                subBrchNum: '',
                subBrchName: '',
                custName: '',
                orgCode: '',
                mdlBizIncomAcct: '',
                mdlBizIncomName: '',
                tranOutDrct: '',
                tranOutCntptyNum: '',
                tranOutCntptyName: '',
                tranOutBeginDt: '',
                tranOutMatDt: '',
                tranAmt: '',
                memo: '',
                addtRcrdTm: addtRcrdTm,
                addtRcrdPersonEmpno: empNum
            }
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));
    });
    //删除行
    $("#btn_del").click(function () {
        var length = $("#table1").bootstrapTable("getData").length;
        var checklist = $('#table1').bootstrapTable('getSelections');
        var ids = [];
        $.each(checklist, function (index, item) {
            ids.push(item.number);
            if (item.addtRcrdId != undefined && item.addtRcrdId != null && item.addtRcrdId != '') {
                deleteIds.push(item.addtRcrdId);
            }
        });
        $("#table1").bootstrapTable("remove", {
            field: 'number',
            values: ids
        });
        //更新表中修改过字段的颜色
        updateCellDataClass($("#table1"));
    });
    //保存
    $("#btn_save").click(function () {
        //bootstrapTable 编辑列表校验
        var validateError = validateBootStrapTableEdit($("#table1"));
        if (validateError != null) {
            layer.msg(validateError, {icon: 2});
            return;
        }

        var addData = [];
        var updateData = [];
        var deleteData = deleteIds;
        var tableData = $("#table1").bootstrapTable("getData");
        $.each(tableData, function (index, item) {
            if (item.addtRcrdId !== undefined && item.addtRcrdId != null && item.addtRcrdId !== '') {
                //修改数据
                if (item.updateCell && Object.keys(item.updateCell).length > 0) {
                    updateData.push(item)
                }
            } else {
                //新增数据
                addData.push(item);
            }
        });
        if (addData.length === 0 && updateData.length === 0 && deleteData === 0) {
            layer.msg("没有任何修改，无需保存", {icon: 3});
            return;
        }
        var data = {
            'addData': addData,
            'updateData': updateData,
            'deleteData': deleteData
        };
        var index;
        $.ajax({
            url: portal.bp() + '/table/addRecord/GS036SaveAll',
            type: 'post',
            cache: false,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == '200') {
                    layer.msg("保存成功", {icon: 1});
                    query();
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

    });
    query();

    //初始化报表说明(备注)
    $.ajax({
        url: portal.bp() + '/table/queryNote',
        type: "get",
        async: false, // 同步 为全局变量赋值
        data: {
            'tableName': 'R_INV_LINE_RES_TRAN_OUT_INFO-GS036'
        },
        cache: false,
        success: function (data) {
            var s = data.data;
            if (s.length == 0) {
                var trHtml = "<tr><td>暂无报表说明!</td></tr>";
                $("#noteList").append(trHtml);
            } else {
                for (var i = 0; i < s.length; i++) {
                    //console.log(s[i].table_NOTE);
                    var trHtml = "<tr><td align='left' class='note' style='white-space:pre;'>" + s[i].table_NOTE + "</td></tr>";
                    $("#noteList").append(trHtml);
                }
                $("#noteList .no-records-found").hide();
            }
        }
    });

});

//查询
function query() {
    deleteIds = [];
    TableObjPage.table1();
    TableObjPageHistory.table2();
}

//查询修改记录
/*function queryHistory() {
	TableObjPageHistory.table2();
}*/
var oldTable;
var TableObjPage = {
    table1: function () {
        var columns = [
            [
                {
                    field: 'check',
                    checkbox: true
                },
                {
                    field: 'number',
                    title: '序号',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        row.number = index + 1;
                        return index + 1;
                    }
                },
                {
                    field: 'subBrchNum',
                    title: '经营单位编号',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '经营单位编号',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') {
                                return '经营单位编号必填';
                            }
                            if (value != null && value !== '' && !checkFloat(value)) return '经营单位编号必须是数字';
                        }
                    }
                },
                {
                    field: 'subBrchName',
                    title: '经营单位名称',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '经营单位名称',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "经营单位名称必填";
                        }
                    }
                },
                {
                    field: 'custName',
                    title: '客户名称',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '客户名称',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "客户名称必填";
                        }
                    }
                },
                {
                    field: 'orgCode',
                    title: '组织机构代码',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '组织机构代码',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "组织机构代码必填";
                        }
                    }
                },
                {
                    field: 'mdlBizIncomAcct',
                    title: '中收科目号',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '中收科目号',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') {
                                return '中收科目号必填';
                            }

                        }
                    }
                },
                {
                    field: 'mdlBizIncomName',
                    title: '中收科目名称',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '中收科目名称',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') {
                                return '中收科目名称必填';
                            }

                        }
                    }
                },
                {
                    field: 'tranOutDrct',
                    title: '转移方向',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'select',
                        title: '转移方向',
                        source: $.param.getEditableJsonByParentId("TRAN_OUT_DRCT"),
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "转移方向必填";
                        }
                    }
                },
                {
                    field: 'tranOutCntptyNum',
                    title: '转移对手单位编号',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '转移对手编号',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            //if(value==null||value=='') return "转移对手编号必填";
                            if (value == null || value === '') {
                                return '转移对手单位编号编号必填';
                            }

                            if (value != null && value !== '' && !checkFloat(value)) return '转移对手单位编号必须是数字';

                        }
                    }
                },
                {
                    field: 'tranOutCntptyName',
                    title: '转移对手单位',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '转移对手单位',
                        placement: 'top',
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "转移对手单位必填";
                        }
                    }
                },
                {
                    field: 'tranOutBeginDt',
                    title: '转移开始日期',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'date',
                        title: '转移开始日期',
                        //mode:'inline',
                        placement: 'left',
                        format: 'yyyy-mm-dd',
                        language:"zh-CN",
                        emptytext: "空",
                        validate: function (value) {
                            if (value == null || value === '') return "转移起始日必填";
                        }
                    }
                },
                {
                    field: 'tranOutMatDt',
                    title: '转移结束日期',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'date',
                        title: '转移结束日期',
                        //mode:'inline',
                        format: 'yyyy-mm-dd',
                        placement: 'left',
                        emptytext: "空"
                    }
                },
                {
                    field: 'tranAmt',
                    title: '中间业务收入转移金额',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '中间业务收入转移金额',
                        placement: 'top',
                        emptytext: "空",
                        formatter: function (value, row, index) {
                            if (value) {
                                return value;
                            } else {
                                return '';
                            }
                        },
                        validate: function (v) {
                            if (v == null || v === '') return "中间业务收入必填";
                            if (v != null && v !== '' && !checkNumber(v)) return '中间业务收入必须大于0，并且最多保留两位小数';

                        }
                    }
                },
                {
                    field: 'memo',
                    title: '备注',
                    align: "center",
                    valign: "middle",
                    editable: {
                        type: 'text',
                        title: '备注',
                        placement: 'top',
                        emptytext: "空",
                        formatter: function (value, row, index) {
                            if (value) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    }
                },
                {
                    field: 'addtRcrdTm',
                    title: '补录时间',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'addtRcrdPersonEmpno',
                    title: '补录人员工号',
                    align: "center",
                    valign: "middle"
                }
            ]
        ];
        $('#table1').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/addRecord/GS036_BLquery',
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
                    'pageNum': (params.offset / params.limit) + 1
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50, 100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:450, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    oldTable = JSON.parse(JSON.stringify(res.data));
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            rowStyle: function (row, index) {
                if (row.isAdd) {
                    //新增行样式
                    /*['active','success','info','warning','danger']*/
                    /*return {
                            css:{
                                'color':'green'
                            }
                    }*/
                    return {classes: 'info'};
                } else {
                    return {};
                }
            },
            onLoadSuccess: function (data) {
                $('#table1').bootstrapTable('resetView', {
                    height: getTableHeight(document)
                });
                initBootStrapTablevalidateEdit($("#table1"));
                resizeTables();
            },
            onEditableSave: function (field, row, oldValue, $el) {
                $("#table1").bootstrapTable("resetView");
                if (row.addtRcrdId != null && row.addtRcrdId !== '') {
                    //修改
                    $.each(oldTable.rows, function (index, item) {
                        if (item.addtRcrdId === row.addtRcrdId) {
                            if (eval("item." + field) === eval("row." + field)) {
                                $el.removeClass('update-cell-data');
                                //修改标志
                                if (row.updateCell === undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                delete row.updateCell[field];
                            } else {
                                $el.addClass('update-cell-data');
                                //修改标志
                                if (row.updateCell === undefined || row.updateCell == null) {
                                    row.updateCell = {};
                                }
                                row.updateCell[field] = '1';
                            }
                        }
                    });
                }
            },
            columns: columns

        });
    }
};

var TableObjPageHistory = {
    table2: function () {
        var columns = [
            [
                {
                    field: 'number',
                    title: '序号',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        row.number = index + 1;
                        return index + 1;
                    }
                },
                {
                    field: 'subBrchNum',
                    title: '经营单位编号',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'subBrchName',
                    title: '经营单位名称',
                    align: "center",
                    valign: "middle"
                },

                {
                    field: 'custName',
                    title: '客户名称',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'orgCode',
                    title: '组织机构代码',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'mdlBizIncomAcct',
                    title: '中收科目号',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'mdlBizIncomName',
                    title: '中收科目名称',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'tranOutDrct',
                    title: '转移方向',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'tranOutCntptyNum',
                    title: '转移对手单位编号',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'tranOutCntptyName',
                    title: '转移对手单位',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value === null ||value ===undefined || value==='null') {
                            return '';
                        }else{
                            return value;
                        }

                    }

                },
                {
                    field: 'tranOutBeginDt',
                    title: '转移开始日期',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'tranOutMatDt',
                    title: '转移结束日期',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'tranAmt',
                    title: '中间业务收入转移金额',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'memo',
                    title: '备注',
                    align: "center",
                    valign: "middle"

                },
                {
                    field: 'addtRcrdTm',
                    title: '补录时间',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'addtRcrdPersonEmpno',
                    title: '补录人员工号',
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'opeTypeCd',
                    title: '操作类型',
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value === '1') return '新增';
                        if (value === '2') return '修改';
                        if (value === '0') return '删除';
                    }
                }
            ]
        ];
        $('#table2').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/table/addRecord/GS036queryHistory',
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
                    'pageNum': (params.offset / params.limit) + 1
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 100,      //每页的记录行数（*）
            pageList: [50, 100],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height: getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code === '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: columns

        });
    }
};