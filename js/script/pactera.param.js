/**
 * jQuery format - v1.0
 * auth: xiaodong.sun
 * E-mail: xiaodong.sun@pactera.com
 *
 */
var tipsMap = {};
(function ($, undefined) {
    $.param = $.param || {};
    $.ajax({
        url: portal.bp() + './json/pubApp/getPubApp.json?r='+Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
            var col = data.data;
            $.each(col, function (a, b) {
                $.param[a] = this;
            });
        }
    });
    $.extend($.param, {
        getDisplay: function (appName, appValue) {

            var map = $.param[appName];
            if (!map) {
                //alert( appName + " not defined!");
                return appValue;
            }
            appValue = $.trim(appValue);
            if (map[appValue] == undefined || map[appValue] == 'undefined') {
                return appValue;
            }

            return map[appValue];
        },
        getSelectOption: function (appName) {
            var map = $.param[appName];
            if (!map) {
                return null;
            }
            var html = "";
            $.each(map, function (k, v) {
                html += "<option value='" + k + "'>" + v + "</option>"
            });
            return html;
        },
        getSelectOptionExclusive: function (appName, exclusive) {
            var map = $.param[appName];
            if (!map) {
                return null;
            }
            var html = "";
            $.each(map, function (k, v) {
                var flag = true;
                $.each(exclusive, function (index, item) {
                    if (item == k) {
                        flag = false;
                        return false;
                    }
                });
                if (flag) {
                    html += "<option value='" + k + "'>" + v + "</option>"
                }
            });
            return html;
        },
        getSelectMap: function (appName) {
            var map = $.param[appName];
            if (!map) {
                return null;
            }
            return map;
        },
        getSelectOptionOrderTeamName: function (empno) {
            var html = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getTeamName?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "empno": empno
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.name + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getSelectOptionOrderTeamNames: function (empno) {
            var result;
            $.ajax({
                url: portal.bp() + '/pubApp/getTeamName?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "empno": empno
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    result = data.data;
                   /* $.each(col, function (index, item) {
                        html += "<option value='" + item.name + "'>" + item.name + "</option>"
                    });*/
                }
            });
            return result;
        },
        getSelectOptionOrderTarget: function (tableNames) {
        	var html = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getRuleTarget?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "tableNames": tableNames
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getCorpType: function () {
        	var json = [];
            $.ajax({
                url: portal.bp() + '/pubApp/getCorpType?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	var col = data.data;
                    $.each(col, function (index, item) {
                    	var j = {value:item.name,text:item.name};
                    	json.push(j);
                    });
                }
            });
            return json;


        },
        getAcctCate: function () {
            var html = "<option value='0'>所有</option>";;
            $.ajax({
                url: portal.bp() + '/pubApp/getAcctCate?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getCardName: function () {
            var html = "<option value='0'>所有</option>";;
            $.ajax({
                url: portal.bp() + '/pubApp/getCardName?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getSelectOptionOrder: function (appName) {
            var html = "";
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+appName+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": appName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getSelectOptionOrderThreeLayersDeep: function (appName) {
            var html = "";
            $.ajax({
                url: portal.bp() + './../json/pubApp/getParamByParentId.'+appName+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": appName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getSelectObject: function (appName) {
            var col;
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+appName+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": appName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                     col = data.data;
                }
            });
            return col;
        },
        getSelectObjectRelativePath: function (appName) {
            var col;
            $.ajax({
                url: appName+'?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    col = data.data;
                }
            });
            return col;
        },
        getSelectOptionOrderCerType: function () {
            var html = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getCerType?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getSelectOptionOrderOrgCode: function (custName) {
            var result = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getOrgCode?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "custName": custName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
            return result;
        },
        getSelectOptionOrderCustName: function (orgCode) {
            var result = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getCustName?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "orgCode": orgCode
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
            return result;
        },
        getSelectOptionOrderBranchNames: function (custName,cerType,cerNum) {
            var result = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getBranchNames?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "custName": custName,
                    "cerType":cerType,
                    "cerNum":cerNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
            return result;
        },
        getCustByCerNum:function(cerType,cerNum){
        	var custName ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/getCustNameByCerNum?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "cerType": cerType,
                    "cerNum": cerNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	custName = data.data;
                }
            });
        	return custName;
        },
        getSelectOptionOrderByName: function (appName) {
            var html = "";
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentIdOrderByName.'+appName+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": appName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getRelationStatus: function () {
            var html = "";
            $.ajax({
                url: portal.bp() + '/relation/getRealStatusByUserRole?r='+Math.random(),
                type: 'post',
                async: false,
                /*data: {
                    "parentId": appName
                },*/
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.encode + "'>" + item.name + "</option>"
                    });
                }
            });
            return html;
        },
        getRelationStatusList: function () {
            var relaStatusList = "";
            $.ajax({
                url: portal.bp() + '/relation/getRealStatusByUserRole?r='+Math.random(),
                type: 'post',
                async: false,
                /*data: {
                    "parentId": appName
                },*/
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    relaStatusList = data.data;
                }
            });
            return relaStatusList;
        },
        getSelectOptionFirst: function (appName) {
            var col;
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+appName+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": appName
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    col = data.data[0];
                }
            });
            return col;
        },
        getTableHeaderByType: function (tableType) {
            var columns = "";
            $.ajax({
                url: portal.bp() + '/table/column?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "tableType": tableType
                },
                dataType: "json",
            }).done(function (data) {
                if (data.code == '200') {
                    columns = data.data;
                    $.each(columns, function (index, item) {
                        $.each(item, function (subIndex, subItem) {

                            if (subItem.subTableName != undefined && subItem.subTableName != null) {
                                var increaseIndex = function index(value, row, index) {
                                    var html = '';
                                    html += '<a href="javascript:void(0)" id="showModel" '+'colName="'+subItem.field+'"' +
                                        'subTableName="' + subItem.subTableName + '" >' + value + '</a>';
                                    return html;
                                }
                                subItem.events = operateEvents;
                                subItem.formatter = increaseIndex;
                            }

                            if (subItem.title === '序号') {
                                var increaseIndex = function index(value, row, index) {
                                    return index + 1;
                                }
                                subItem.formatter = increaseIndex;
                            }
                        });

                    });
                }
            });
            return columns;
        },
        getTableLinkByType: function (tableType) {
            var columns = "";
            $.ajax({
                url: portal.bp() + '/table/column?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "tableType": tableType
                },
                dataType: "json",
            }).done(function (data) {
                if (data.code == '200') {
                    columns = data.data;
                    $.each(columns, function (index, item) {
                        $.each(item, function (subIndex, subItem) {

                            if (subItem.subTableName != undefined && subItem.subTableName != null) {
                                var increaseIndex = function index(value, row, index) {
                                    var html = '';
                                    html += '<a href="javascript:void(0)" id="showModel" '+'colName="'+subItem.field+'"' +
                                        'subTableName="' + subItem.subTableName + '" >';
                                        if(value !=null && value != undefined && value != ''){
                                            html +=  value + '</a>';
                                        }else{
                                            html +=  '<<' + '</a>';
                                        }
                                    return html;
                                }
                                subItem.events = operateEvents;
                                subItem.formatter = increaseIndex;
                            }

                            if (subItem.title === '序号') {
                                var increaseIndex = function index(value, row, index) {
                                    return index + 1;
                                }
                                subItem.formatter = increaseIndex;
                            }
                        });

                    });
                }
            });
            return columns;
        },
        getTableNewHeaderByType: function (typeCd,mdlBizIncomStdAccts) {
            var columns = "";
            $.ajax({
                url: portal.bp() + '/table/newColumn?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                	"typeCd":typeCd,
                    "mdlBizIncomStdAccts": mdlBizIncomStdAccts
                },
                dataType: "json",
            }).done(function (data) {
                if (data.code == '200') {
                    columns = data.data;
                    $.each(columns, function (index, item) {
                        $.each(item, function (subIndex, subItem) {

                            if (subItem.subTableName != undefined && subItem.subTableName != null) {
                                var increaseIndex = function index(value, row, index) {
                                    var html = '';
                                    html += '<a href="javascript:void(0)" id="showModel" '+'colName="'+subItem.field+'"' +
                                        'subTableName="' + subItem.subTableName + '" >' + value + '</a>';
                                    return html;
                                }
                                subItem.events = operateEvents;
                                subItem.formatter = increaseIndex;
                            }

                            if (subItem.title === '序号') {
                                var increaseIndex = function index(value, row, index) {
                                    return index + 1;
                                }
                                subItem.formatter = increaseIndex;
                            }
                        });

                    });
                }
            });
            return columns;
        },
        getmdlBizIncomStdAcct:function(typeCd){
        	var html = '';
        	$.ajax({
                url: portal.bp() + '/table/getmdlBizIncomStdAcct?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "typeCd": typeCd,
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        html += "<option value='" + item.mdlBizIncomStdAcct + "'>" + item.mdlBizIncomDesc + "</option>"
                    });
                }
            });
        	return html;
        },
        getSelectOrgNumOrgNameRef: function (code, parentId) {
            var col;
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentIdAndCode.'+parentId+'.'+code+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "code": code,
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    col = data.data;
                }
            });
            return col;
        },
        getResultByUrl: function (url, param, key) {
        	var data ;
        	var object = new Object();
        	if(param==null||param==undefined){
        		data = {};
        	}else{
        		object[key] = param;
        		data = object;
        	}
            var col;
            $.ajax({
                url: portal.bp() + url+'?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json",
                data: data
            }).done(function (data) {
                if (data.code == '200') {
                    col = data.data;
                }
            });

            return col;
        },
        getSelectCustomsClassify: function (name, parentId) {
            var col;
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentIdAndName.'+parentId+'.'+name+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "name": name,
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    col = data.data;
                }
            });
            return col;
        },
        getEditableJsonByParentId: function(parentId){
        	var json = [];
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+parentId+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                    	var j = {value:item.encode,text:item.name};
                    	json.push(j);
                    });
                }
            });
            return json;
        },
        getEditableJsonByParentIdByType: function(parentId){
            var json = [];
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentIdByType.'+parentId+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        var j = {value:item.encode,text:item.name};
                        json.push(j);
                    });
                }
            });
            return json;
        },
        getEtlDate:function(){
        	var date = "";
            $.ajax({
                url: portal.bp() + '/pubApp/getEtlDate?r='+Math.random(),
                type: 'get',
                async: false,
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	date = data.data;
                }
            });
            return date;
        },
        getAcctNum:function(acctNum,belongBrchNum){
        	var isExist = "0";
        	$.ajax({
                url: portal.bp() + '/pubApp/getAcctNum?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "acctNum": acctNum,
                    "belongBrchNum":belongBrchNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	isExist = data.data;
                }
            });
        	return isExist;
        },

        getAgtInfo:function(trdSeq){
        	var AgtInfo;
        	$.ajax({
                url: portal.bp() + '/pubApp/getAgtInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "trdSeq": trdSeq
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	AgtInfo = data.data;
                }
            });
        	return AgtInfo;
        },
        queryBelongBrchNum:function(belongOrgNum){
        	var belongBrchNum = "";
        	$.ajax({
                url: portal.bp() + '/table/addRecord/queryBelongBrchNum?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "belongOrgNum": belongOrgNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	belongBrchNum = data.data;
                }
            });
        	return belongBrchNum;
        },
        getBranchName:function(branchNum,flag){
        	var branchName ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/getBranchName?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "branchNum": branchNum,
                    "flag":flag
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	branchName = data.data;
                }
            });
        	return branchName;
        },
        getBranchInfo:function(branchNum){
        	var branchInfo;
        	$.ajax({
        		url: portal.bp() + '/pubApp/getLEV45OrgInfoByLEV5Num?r='+Math.random(),
        		type: 'get',
        		async: false,
        		data: {
        			"branchNum": branchNum,
        		},
        		dataType: "json"
        	}).done(function (data) {
        		if (data.code == '200') {
        			branchInfo = data.data;
        		}
        	});
        	return branchInfo;
        },
        getRegLineName:function(regLineNum){
        	var regLineName ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/getRegLineName?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "regLineNum": regLineNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	regLineName = data.data;
                }
            });
        	return regLineName;
        },

        getTableParam:function (parentId) {
            var result = [];
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+parentId+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        result.push({value:item.encode,text:item.name});
                    });
                }
            });
            return result;
        },
        getTableOrientCd:function (parentId) {
            var result = [];
            $.ajax({
                url: portal.bp() + './json/pubApp/getParamByParentId.'+parentId+'.json?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "parentId": parentId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    $.each(col, function (index, item) {
                        if(item.encode!='02'){
                            result.push({value:item.encode,text:item.name});
                        }
                    });
                }
            });
            return result;
        },

        getIsAdd:function(mon){
        	var num ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/queryIsAdd?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "mon": mon
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	num = data.data;
                }
            });
        	return num;
        },
        getIsAdds:function(mon){
        	var num ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/queryIsAdds?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "mon": mon
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	num = data.data;
                }
            });
        	return num;
        },
        getIsExistTeamInfo:function(teamId,mon){
        	var num ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/getIsExistTeamInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                	"teamId":teamId,
                    "mon": mon
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	num = data.data;
                }
            });
        	return num;
        },
        getTeamInfo:function(teamId){
        	var datas;
        	$.ajax({
                url: portal.bp() + '/pubApp/getTeamInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "teamId": teamId
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	datas = data.data;
                }
            });
        	return datas;
        },
        getOrgInfo:function(subBrchNo){
        	var datas;
        	$.ajax({
                url: portal.bp() + '/pubApp/getOrgInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "subBrchNo": subBrchNo
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	datas = data.data;
                }
            });
        	return datas;
        },
        getWindowPhase:function(){
        	var flag ="";
        	$.ajax({
                url: portal.bp() + '/pubApp/getWindowPhase?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	flag = data.data;
                }
            });
        	return flag;
        },
        getOrgByLevel:function(level,mid){
        	var html = "";
            $.ajax({
                url: portal.bp() + '/org/findOrgByLevel?r='+Math.random(),
                type: 'post',
                async: false,
                data: {
                    "level": level,
                    "mid": mid
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                    var col = data.data;
                    tipsMap = {};
                    $.each(col, function (index, item) {
                    	eval("tipsMap."+item.orgName.replace(/[\u0000-\u00FF]/g,"")+"='"+item.childOrgNames+"'");
                        html += "<option value='" + item.orgNum + "'>" + item.orgName + "</option>"
                    });
                }
            });
            return html;

        },
        getOrgByLevels:function(level,mid){
        	var result;
            $.ajax({
                url: portal.bp() + '/org/findOrgByLevel?r='+Math.random(),
                type: 'post',
                async: false,
                data: {
                    "level": level,
                    "mid": mid
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                  result = data.data;
                }
            });
            return result;

        },
        getCustInfo:function(custId,cerType,cerNum){
        	var result;
        	$.ajax({
                url: portal.bp() + '/pubApp/getCustInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "custId": custId,
                    "cerType": cerType,
                    "cerNum": cerNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
        	return result;
        },
        getEmpInfo:function(empNum){
        	var result;
        	$.ajax({
                url: portal.bp() + '/pubApp/getEmpInfo?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "empNum": empNum
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
        	return result;
        },
        getEmpRole:function(empNum,mid){
        	var result;
        	$.ajax({
                url: portal.bp() + '/pubApp/getEmpRole?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "empNum": empNum,
                    "mid":mid
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
        	return result;
        },
        findExistOrgCode:function(orgCode){
        	var result;
        	$.ajax({
                url: portal.bp() + '/pubApp/findExistOrgCode?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "orgCode": orgCode
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
        	return result;
        },
        findExistOrgCode_SC003:function(orgCode){
        	var result;
        	$.ajax({
                url: portal.bp() + '/pubApp/findExistOrgCode_SC003?r='+Math.random(),
                type: 'get',
                async: false,
                data: {
                    "orgCode": orgCode
                },
                dataType: "json"
            }).done(function (data) {
                if (data.code == '200') {
                	result = data.data;
                }
            });
        	return result;
        },
        validEmpNum:function(queryParam) {
        var res;
        $.ajax({
            url: portal.bp() + '/relation/validOrgOfAcctAndEmpNum',
            type: 'post',
            async: false,
            contentType: "application./json;charset=UTF-8",
            dataType: "json",
            cache: false,
            data: JSON.stringify(queryParam),
            success: function (data) {
                res=data;
            }
        });
        return res;
    }
    });
})(jQuery)
