
var portal = {};

function tab1(obj,textstr) {
    var o = $(obj).attr("data-url"), m =$(obj).data("index"), l = textstr!=undefined&&textstr!=null?textstr:($.trim($(obj).text())==''?textstr:$.trim($(obj).text())), k = true;
    if (o == undefined || $.trim(o).length == 0 || $.trim(o) === '#') {
        return false
    }
    $(".J_menuTab",parent.document).each(
        function() {
            if ($(this).data("id") == o) {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active").siblings(".J_menuTab")
                        .removeClass("active");
                    g(this);
                    $(".J_mainContent .J_iframe",parent.document).each(
                        function() {
                            if ($(this).data("id") == o) {
                                $(this).show()
                                    .siblings(".J_iframe")
                                    .hide();
                                return false
                            }
                        })
                }
                k = false;
                return false
            }
        });
    if (k) {
        var p = '<a href="javascript:;" class="active J_menuTab" data-id="'
            + o + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
        $(".J_menuTab",parent.document).removeClass("active");
        var n = '<iframe class="J_iframe" name="iframe' + m
            + '" width="100%" height="100%" src="' + o
            + '" frameborder="0" data-id="' + o
            + '" seamless></iframe>';
        $(".J_mainContent",parent.document).find("iframe.J_iframe").hide().parents(
            ".J_mainContent",parent.document).append(n);
        $(".J_menuTabs .page-tabs-content",parent.document).append(p);
        tab2($(".J_menuTab.active",parent.document))
    }
    return false
};
function tab2(n) {
    var o = f($(n).prevAll()), q = f($(n).nextAll());
    var l = f($(".content-tabs",parent.document).children().not(".J_menuTabs"));
    var k = $(".content-tabs",parent.document).outerWidth(true) - l;
    var p = 0;
    if ($(".page-tabs-content",parent.document).outerWidth() < k) {
        p = 0
    } else {
        if (q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
            if ((k - $(n).next().outerWidth(true)) > q) {
                p = o;
                var m = n;
                while ((p - $(m).outerWidth()) > ($(".page-tabs-content",parent.document)
                    .outerWidth() - k)) {
                    p -= $(m).prev().outerWidth();
                    m = $(m).prev()
                }
            }
        } else {
            if (o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(
                true))) {
                p = o - $(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content",parent.document).animate({
        marginLeft : 0 - p + "px"
    }, "fast")
};
function f(l) {
    var k = 0;
    $(l).each(function() {
        k += $(this).outerWidth(true)
    });
    return k
};
function g(n) {
    var o = f($(n).prevAll()), q = f($(n).nextAll());
    var l = f($(".content-tabs",parent.document).children().not(".J_menuTabs"));
    var k = $(".content-tabs",parent.document).outerWidth(true) - l;
    var p = 0;
    if ($(".page-tabs-content",parent.document).outerWidth() < k) {
        p = 0
    } else {
        if (q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
            if ((k - $(n).next().outerWidth(true)) > q) {
                p = o;
                var m = n;
                while ((p - $(m).outerWidth()) > ($(".page-tabs-content",parent.document)
                    .outerWidth() - k)) {
                    p -= $(m).prev().outerWidth();
                    m = $(m).prev()
                }
            }
        } else {
            if (o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(
                true))) {
                p = o - $(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content",parent.document).animate({
        marginLeft : 0 - p + "px"
    }, "fast")
};

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
    if(arr=document.cookie.match(reg)){
      return unescape(arr[2]);
    }
    else{
     return null;
    }
}
function refreshSelectpicker(id){
	document.getElementById(id).options.selectedIndex = 0; //回到初始状态
	$("#"+id).selectpicker('refresh');//重置刷新
}
function uniq(array){
	var temp = [];
	var index = [];
	var l = array.length;
	for(var i=0;i<l;i++){
		for(var j=i+1;j<l;j++){
			if(array[i]===array[j]){
				i++;
				j = i;
			}
		}
		temp.push(array[i]);
		index.push(i);
	}
	return temp;
}
function checkFloat(value){
	var reg = /^(-?\d+)(\.\d+)?$/;
	if(!reg.test(value)){
		return false;
	}
	return true;
}

/**
 * 大于0，并且最多保留两位小数
 * @param value
 * @returns {boolean}
 */
function checkNumber(value){
	var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
	if(!reg.test(value)){
		return false;
	}
	var number = parseFloat(value);
	return !(number === 0.00 || number === 0.0);
}
/**
 * 禁用兄弟元素中的field字段
 * @param element
 * @param dataName
 */
function disableSiblings(element,dataName){
	$el = element[0]['$element'] === undefined?element:element[0]['$element'];
	$el.parent().siblings().find('[data-name="'+dataName+'"]').editable("disable");
}
/**
 * 禁用兄弟元素中的field字段并设置值
 * @param element
 * @param dataName
 * @param newValue
 */
function disableSiblingsAndSetValue(element,dataName,newValue){
	$el = element[0]['$element'] === undefined?element:element[0]['$element'];
	var rowIndex = $el.parent().parent().index();
	$el.parent().siblings().find('[data-name="'+dataName+'"]').editable("disable").editable("setValue",newValue);
	var t = $el.parent().parent().parent().parent('table').bootstrapTable('getData')[rowIndex];
	if(newValue==null){
		eval('if (t&&t.'+dataName+'!=undefined) t.'+dataName+'='+newValue);
	}else{
		eval('if (t&&t.'+dataName+'!=undefined) t.'+dataName+'="'+newValue+'"');
	}
	$el.parent().parent().parent().parent('table').bootstrapTable("resetView");
}
/**
 * 修改表格中某行某个字段的实际值
 * @param tableId
 * @param index
 * @param dataName
 * @param newValue
 * @param enable
 */
function editableTableSetValue(tableId,index,dataName,newValue,enable){
	$("#"+tableId +" tr[data-index = '" +index+"'] a[data-name = '"+dataName+"']").editable(enable).editable("setValue",newValue);
	var t = $("#"+tableId).bootstrapTable('getData')[index];
	eval('if (t&&t.'+dataName+'!=undefined) t.'+dataName+'='+newValue);
}
/**
 * 修改表格中某行某个字段的展示值
 * @param tableId
 * @param index
 * @param dataName
 * @param newValue
 */
function editableTableSetShowValue(tableId,index,dataName,newValue){
	$("#"+tableId +" tr[data-index = '" +index+"'] a[data-name = '"+dataName+"']").text(newValue);
}
/**
 * 启用兄弟元素中的field字段
 * @param element
 * @param dataName
 */
function enableSiblings(element,dataName){
	$el = element[0]['$element'] === undefined?element:element[0]['$element'];
	$el.parent().siblings().find('[data-name="'+dataName+'"]').editable("enable");
}

/**
 * 启用兄弟元素中的field字段并赋值为空
 * @param element
 * @param dataName
 */
function enableSiblingsAndSetValue(element,dataName,newValue){
	$el = element[0]['$element'] === undefined?element:element[0]['$element'];
	var rowIndex = $el.parent().parent().index();
	$el.parent().siblings().find('[data-name="'+dataName+'"]').editable("enable").editable("setValue",newValue);
	var t = $el.parent().parent().parent().parent('table').bootstrapTable('getData')[rowIndex]
	if(newValue==null){
		eval('if (t&&t.'+dataName+'!=undefined) t.'+dataName+'='+newValue);
	}else{
		eval('if (t&&t.'+dataName+'!=undefined) t.'+dataName+'="'+newValue+'"');
	}

}

/**
 * 获取兄弟元素中field字段的值
 * @param element
 * @param dataName
 * @returns
 */
function getSiblingsValue(element,dataName){
	 $el = element[0]['$element'] === undefined?element:element[0]['$element'];
	 var values = $el.parent().siblings().find('[data-name="'+dataName+'"]').editable("getValue");
	 if(values!=null){
		 return values[dataName];
	 }
	 return null;
}
/**
 * 校验bootstraptable编辑列表
 * @param element
 * @returns {String}
 */
function validateBootStrapTableEdit(element){
	var columns = element.bootstrapTable("getOptions").columns;
	var dataNames = [];
	$.each(columns,function(index,column){
		$.each(column,function(index,item){
			if(item.editable&&item.editable.validate){
				dataNames.push(item.field);
			}
		})
	});
	var result = null;
	$.each(dataNames,function(index,dataName){
		$dn = element.find('[data-name="'+dataName+'"]');
		$.each($dn,function(index,item){
			var cellNum = $(item).parent().index() + 1;
			var rowNum = $(item).parent().parent().index() + 1;
			var error = $(item).editable("validate");
			if(error&&Object.keys(error).length>0){
				result = "第"+rowNum+"行，第"+cellNum+"列，"+error[dataName];
				return false;
			}
		});
		if(result!=null){
			return false;
		}
	});
	return result;
}
/**
 * init校验bootstraptable编辑列表
 * @param element
 * @returns {String}
 */
function initBootStrapTablevalidateEdit(element){
	var columns = element.bootstrapTable("getOptions").columns;
	var dataNames = [];
	$.each(columns,function(index,column){
		$.each(column,function(index,item){
			if(item.editable&&item.editable.validate){
				dataNames.push(item.field);
			}
		})
	});
	$.each(dataNames,function(index,dataName){
		$dn = element.find('[data-name="'+dataName+'"]');
		$.each($dn,function(index,item){
			var cellNum = $(item).parent().index() + 1;
			var rowNum = $(item).parent().parent().index() + 1;
			var error = $(item).editable("validate");
		});
	});
}
/**
 * 为bootstraptable更新修改的样式
 * @param $el
 */
function updateCellDataClass($el){
	var tableDatas = $el.bootstrapTable("getData");
	$.each(tableDatas,function(index,rowData){
		if(rowData.updateCell&&Object.keys(rowData.updateCell).length>0){
			var updateCell = rowData.updateCell;
			$.each(updateCell,function(key,value){
				$el.find('[data-name="'+key+'"]').eq(index).addClass('update-cell-data');
			});
		}
	});
	initBootStrapTablevalidateEdit($el);
	layer.closeAll('loading');
}

function getSystemDate(format){
	var res = '';
	$.ajax({
		url : portal.bp() + '/pubApp/getSystemDate?r='+Math.random(),
		type:'get',
		cache:false,
		async:false,
		contentType: "application/json;charset=UTF-8",
		dataType: "json",
		data:{'format':format},
		success : function(data) {
			if(data.code=='200'){
				res = data.data;
			}
		}
	});
	return res;
}
/**
 * 查询权限范围机构层级
 * @param eleId
 * @param isCheck
 */
function findAuthOrgHirchy(eleId,isCheck,mid){
	var html = "";
	var flag = false;
	$.ajax({
		url : portal.bp() + '/org/findAuthOrgHirchy?r='+Math.random(),
		type : "get",
		async : false, // 同步 为全局变量赋值
		data : {
			'mid':mid
		},
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				var s = data.data;
				var firstValue="";
				$.each(s,function(index,item){
					if(index==0){
						firstValue = item.ENCODE;
					}
					if(isCheck!=undefined&&item.ENCODE==isCheck){
						flag = true;
					}
					if(item.ENCODE!='1'&&item.ENCODE!='3'&&item.ENCODE!='4'){
						html += '<option value="'+item.ENCODE+'">'+item.NAME+'</option>';
					}
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
(function($) {
	/**
	 * 获得项目根路径
	 *
	 * 使用方法：portal.bp();
	 */
	portal.bp = function() {
		// var curWwwPath = window.document.location.href;
		// var pathName = window.document.location.pathname;
		// var pos = curWwwPath.indexOf(pathName);
		// var localhostPaht = curWwwPath.substring(0, pos);
		// var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
		// return (localhostPaht+projectName);
		return ".";
	};
	
	getUrlParam = function(name){
		var reg = new RegExp("(^|\\?|&)"+name+"=([^&]*)(\\s|&|$)","i");
		if(reg.test(window.location.href)){
			return unescape(RegExp.$2.replace(/\+/g," "))
		}else{
			return false;
		}
	};
	Date.prototype.Format = function(fmt){
	    var o = {
	        "M+":this.getMonth()+1,
	        "d+":this.getDate(),
	        "h+":this.getHours(),
	        "m+":this.getMinutes(),
	        "s+":this.getSeconds(),
	        "q+":Math.floor((this.getMonth()+3)/3),
	        "S":this.getMilliseconds()
	    };
	    if(/(y+)/i.test(fmt))
	        fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	    for(var k in o){
	        if(new RegExp("("+k+")").test(fmt))
	            fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));
	    }
	    return fmt;
	}

	//行内编辑框可拖动
	$(document).on("show.bs.modal",".editable-popup",function(){
		$(this).draggable();
	})
	//模态框展示时调用placehodler，防止IE8没有placehodler
	$(document).on('shown.bs.modal', function () {
		$('input,textarea').placeholder();
	})

   $(document).on('pre-body.bs.table', function () {
         layer.load(2,{
             shade:[0.3,'#fff'],
         });
     })

    //数据加载成功后关闭
    $(document).on('load-success.bs.table', function () {
        layer.closeAll('loading');
    });
    
	$(document).on("click","#shoufang",function(){
		$(this).parent().prev().slideToggle(300),$(this).toggleClass("glyphicon-chevron-down").toggleClass("glyphicon-chevron-up");
		setTimeout("resetTableView(document)",301);
		
		/*if($(this).hasClass('glyphicon-chevron-up')){
			$(this).parent().prev().hide();
    		$('table').bootstrapTable('resetView',{ height:getTableHeight(document) });
    		$(this).removeClass("glyphicon glyphicon-chevron-up").addClass("glyphicon glyphicon-chevron-down");
    	}else{
    		$(this).parent().prev().show();
    		$('table').bootstrapTable('resetView',{ height:getTableHeight(document) });
    		$(this).removeClass("glyphicon glyphicon-chevron-down").addClass("glyphicon glyphicon-chevron-up");
    	}*/
	})

})(jQuery);
/**
 * 日期字符串转日期
 * @param dateStr
 * @param seperator
 * @returns {Date}
 */
function stringToDate(dateStr,seperator){
	if(!seperator){
		seperator = "-";
	}
	var dateArr = dateStr.split(seperator);
	var year = parseInt(dateArr[0]);
	var month = parseInt(dateArr[1]);
	var day = parseInt(dateArr[2]);
	return new Date(year,month-1,day);
}
function resetTableView(document){
	$('table').bootstrapTable('resetView',{ height:getTableHeight(document) });
}
function layerLoad(){
	return layer.load(2,{
        shade:[0.3,'#fff'],
    });
}
function layerClose(index){
	layer.close(index);
}
function getTableHeight(document,index){
	var windowHeight = $(document).height();
	var topHeight = $(document).find(".ibox-content").offset().top;
	if(index!=undefined&&index!=null&&index!=''){
		topHeight = $(document).find(".ibox-content").eq(index).offset().top;
	}
	var tableHeight = windowHeight - topHeight;
	// if(tableHeight<0){
	// 	tableHeight = 300;
	// }
	return tableHeight;
}
//需要处理999999的字段名
var deal999999Arr = [ 'ORG_NUM', 'REG_LINE_NUM', 'SUPER_ORG_NUM',
		'LEV5_ORG_NUM', 'LEV4_ORG_NUM', 'LEV3_ORG_NUM', 'LEV2_ORG_NUM',
		'LEV1_ORG_NUM' ];

//var dealArr = [ 'ORG_NAME'];
//处理999999，转成-
function deal999999($table){
	var tableData = $table.bootstrapTable('getData');
	if(tableData&&tableData.length>0){
		$.each(tableData,function(index,item){
			$.each(item,function(key,value){
				if(deal999999Arr.indexOf(key.toUpperCase())>-1&&value!=null&&value=='999999'){
					$table.bootstrapTable('updateCell',{index:index,field:key,value:'-'});
				}
			})
		});
	}
}


/*function test($table,val){
	var tableData = $table.bootstrapTable('getData');
	if(tableData&&tableData.length>0){
		$.each(tableData,function(index,item){
			$.each(item,function(key,value){
				if(dealArr.indexOf(key.toUpperCase())>-1&&value!=null){
					$table.bootstrapTable('updateCell',{index:index,field:key,value:val});
				}
			})
		});
	}
}
*/

//数字金额右对齐
function countFormat() {
    $("table tbody tr").not("#noteList tbody tr").each(function (i) {
        $(this).children("td").each(function(j){      //遍历获得每个td
            var text = $(this).text();
            var index = text.indexOf(".");
            if(!isNaN(text)){
            	 $(this).css("text-align","right");
            }else if(index>0){                                     //判断是否能为金额字段
                $(this).css("text-align","right");
            }
        });
    });
}

//通用报表字段脱敏方法
function remSensitive(item){
	var res ="";
	
	if(item.remSensitiveType=='01'){
		//手机号中间4位
		res += ",REPLACE("+item.field+"#SUBSTR("+item.field+"#4#4)#'****') as "+item.field;
	}else if(item.remSensitiveType=='02'){
		//证件号后4位
		res += ",REPLACE("+item.field+"#SUBSTR("+item.field+"#length("+item.field+")-3)#'****') as "+item.field;
	}else{
	    res += ',' + item.field;
	}
	return res;
}

//通用报表字段脱敏方法
function remSensitives(item){
	var res ="";

	if(item.remSensitiveType=='01'){
		//手机号中间4位
		res += ",REPLACE(A."+item.field+"#SUBSTR(A."+item.field+"#4#4)#'****') as "+item.field;
	}else if(item.remSensitiveType=='02'){
		//证件号后4位
		res += ",REPLACE(A."+item.field+"#SUBSTR(A."+item.field+"#length(A."+item.field+")-3)#'****') as "+item.field;
	}else{
	    res += ',A.' + item.field;
	}
	return res;
}

//通用报表字段脱敏方法
function remSensitivess(item){
	var res ="";

	if(item.remSensitiveType=='01'){
		//手机号中间4位
		res += ",REPLACE(A."+item.field+"#SUBSTR(A."+item.field+"#4#4)#'****') as "+item.field;
	}else if(item.remSensitiveType=='02'){
		//证件号后4位
		res += ",REPLACE(A."+item.field+"#SUBSTR(A."+item.field+"#length(A."+item.field+")-3)#'****') as "+item.field;
	}else{
	    res += ',A.' + item.field;
	}
	return res;
}

//前端页面字段脱敏
function renmSensitivePage(value,typeCode){
	var newValue ="";
	if(typeCode=='01'){
		//手机号中间4位
		newValue = value.substr(0,3)+"****"+value.substr(7);
	}else if(typeCode=='02'){
		//证件号后4位
		newValue = value.substr(0,value.length-4)+"****";
	}else{
		newValue = value;
	}
	return newValue;
}
function deepCopy(obj){
	var result = Array.isArray(obj)?[]:{};
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			if(typeof obj[key]==='object'){
				result[key] = deepCopy(obj[key]);
			}else{
				result[key] = obj[key];
			}
		}
	}
	return result;
}
function tableNeedCopy(columns,flag,needBasicInfo){
    var need = ['rowNumber','colNumber','colspan','rowspan','title','field'];
    var result = [];
    if(flag!=undefined&&flag!=null){
    	result= getSubTitle(columns,flag,needBasicInfo);  //添加表名、币种、单位、币种
    }
    $.each(columns,function(index,item){
        var v1 = [];
        $.each(item,function(i,a){
            var v2 = {};
            var values = '';
            $.each(a,function(key,value){
                if(need.indexOf(key)!=-1){
                	if(key=='title'||key=='titleCus'){
                		values = value.replace(/<br\/>/g,"");
                	}else{
                		values = value;
                	}
                	
                    v2[key] = values;
                }
            })
            v1.push(v2);
        })
        result.push(v1);
    });
    return result;
}
function tableNeedCopyZh(columns,flag,title,DW,currCd,dateDt){
    var need = ['rowNumber','colNumber','colspan','rowspan','title','field'];
    var result = [];
    if(flag!=undefined&&flag!=null){
    	result= getSubTitleZh(columns,flag,title,DW,currCd,dateDt);  //添加表名、币种、单位、币种
    }
    $.each(columns,function(index,item){
        var v1 = [];
        $.each(item,function(i,a){
            var v2 = {};
            var values = '';
            $.each(a,function(key,value){
                if(need.indexOf(key)!=-1){
                	if(key=='title'||key=='titleCus'){
                		values = value.replace(/<br\/>/g,"");
                	}else{
                		values = value;
                	}
                	
                    v2[key] = values;
                }
            })
            v1.push(v2);
        })
        result.push(v1);
    });
    return result;
}
function publicReportExcel(lastQueryParams,url){
	$.ajax({
		url : portal.bp() + '/report/'+url+'?r='+Math.random(),
		type : "post",
		async : false, // 同步 为全局变量赋值
		data : lastQueryParams,
		cache : false,
		success : function(data) {
			if(data.code=='200'){
				downloadByFileName(data.data);
			}else{
				layer.msg(data.message,{icon:2});
			}
		}
	});
}
function downloadByFileName(fileName){
	window.open (portal.bp() + '/report/downloadFile?fileName='+fileName);
}
/**
 * 查询权限范围内的条线列表
 * @returns
 */
function getAuthLine() {
    var res;
    $.ajax({
        url: portal.bp() + '/user/getAuthLine?r='+Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	res = data.data;
        }
    });
    return res;
}

//IE隔行变色
function rowStyle(row,index){
    if(index % 2 == 0){
        return {css:{'background':'#F9F9F9'}}
    }
    return {};
}

function workflowGoback(pkId){
	var res = false;
	$.ajax({
        url: portal.bp() + '/workflow/goback?r='+Math.random(),
        type: 'POST',
        async: false,
        data:{"pkIdList": [pkId]},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	layer.msg("操作成功",{icon:1});
        	res = true;
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
	return res;
}
function showWorkFlowHistory(pkId){
	layer.open({
		type:2,
		title:'审批历史',
		shadeClose:true,
		shade:0.8,
		area:['700px','520px'],
		content:portal.bp() + "/workflow/history/index?pkId="+pkId
	});
}
function role_show_permisstion(roleId,empNum){
	var url = portal.bp() + "/role/showpermission?roleId="+roleId;
	if(empNum){
		url += "&empNum="+empNum;
	}
	layer.open({
		type:2,
		title:'角色权限',
		shadeClose:true,
		shade:0.5,
		area:['800px','550px'],
		content:url
	});
}

function role_show_check(roleId,roleTypeCd){
	var url = portal.bp() + "/role/showpermission/check?roleId="+roleId+'&roleTypeCd='+roleTypeCd;
	layer.open({
		id:'prvCheck',
		type:2,
		title:'角色权限',
		anim:1,
		shadeClose:true,
		shade:0.5,
		area:['800px','580px'],
		content:url
	});
}


//表头和数据列错位修改
function resizeTables(){
	$(window).trigger("resize");
}


//导出时添加表名、日期、单位、币种、(个贷需要添加是否包含不良)
function getSubTitle(columns,flag,needBasicInfo){
    var res = [];
    var dateStr = $("#DATA_DT").val()==undefined ||$("#DATA_DT").val()==''?"无":$("#DATA_DT").val();
    var cur = $("#CURR_CD").val()==undefined?"无":$("#CURR_CD").val();
    var dw = $("#DW").val()==undefined?"无":$("#DW").val();
    var isCntnNp = $("#IS_Cntn_NP").selectpicker('val');
    var tableName;
    if(flag=='0'){              //根据flag判断主表还是下钻
        tableName= $("#tableNameCn").text();
	}else if(flag=='1'){
    	tableName = $("#detailModelTitle").text();
	}
    var colSum = 0;
    var column1 = columns[0];
    for(var i= 0;i < column1.length;i++){
        colSum += column1[i].colspan;
    }

    if(cur=='01'){
        cur = '人民币';
    }else if(cur=='02'){
        cur = '外折人';
    }else if(cur=='03'){
        cur = '本外币';
	}

    if(dw=='01'){
        dw = '元';
    }else if(dw=='02'){
        dw = '万元';
    }else if(dw=='03'){
        dw = '亿元';
	}
    if(isCntnNp=='0'){
    	isCntnNp = '不包含';
    }else if(isCntnNp=='1'){
    	isCntnNp = '包含';
    }else{
    	isCntnNp ='';
    }
    var subTitle ='';
    if(isCntnNp!=undefined&&isCntnNp!=null&&isCntnNp!=''){
    	if(cur=='无' && dw=='无'){
    		subTitle = "统计日期:"+ dateStr +"    是否包含不良:"+ isCntnNp;
    	}else if(cur=='无' && dw!='无'){
    		subTitle = "统计日期:"+ dateStr +"     单位:"+ dw +"     是否包含不良:"+ isCntnNp;
    	}else if(cur!='无' && dw=='无'){
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur+"     是否包含不良:"+ isCntnNp;
    	}else{
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur+"     单位:"+ dw +"     是否包含不良:"+ isCntnNp;
    	}
    	
    	
    }else{
    	if(cur=='无' && dw=='无'){
    		subTitle = "统计日期:"+ dateStr;
    	}else if(cur=='无' && dw!='无'){
    		subTitle = "统计日期:"+ dateStr +"     单位:"+ dw ;
    	}else if(cur!='无' && dw=='无'){
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur ;
    	}else{
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur+"     单位:"+ dw ;
    	}
    }

    res.push([{title: tableName, rowNumber: 1, colNumber: 1, rowspan: 1, colspan:colSum,field: null}]);
    
    if(needBasicInfo!=undefined&&needBasicInfo!=null&&needBasicInfo==true){
    	var basicInfo = $(".ul-basicinfo li span").text();
    	if(basicInfo!=undefined&&basicInfo!=null){
    		res.push([{title: basicInfo, rowNumber: 1, colNumber: 1, rowspan: 1, colspan:colSum,field: null}]);
    	}
    }
    
    res.push([{title: subTitle, rowNumber: 2, colNumber: 1, rowspan: 1, colspan: colSum,field: null}]);
    return res;
}


//导出时添加表名、日期、单位、币种、(个贷需要添加是否包含不良)
function getSubTitleZh(columns,flag,title,DW,currCd,dataDt){
    var res = [];
    var dateStr = $("#DATA_DT").val()==undefined ||$("#DATA_DT").val()==''?"无":$("#DATA_DT").val();
    var cur = $("#CURR_CD").val()==undefined?"无":$("#CURR_CD").val();
    var dw = $("#DW").val()==undefined?"无":$("#DW").val();
    var isCntnNp = $("#IS_Cntn_NP").selectpicker('val');
    var tableName;
    if(flag=='0'){              //根据flag判断主表还是下钻
        tableName= $("#tableNameCn").text();
	}else if(flag=='1'){
    	tableName = $("#detailModelTitle").text();
	}else if(flag=='2'){
		tableName = title;
	}
    var colSum = 0;
    var column1 = columns[0];
    for(var i= 0;i < column1.length;i++){
        colSum += column1[i].colspan;
    }
    
    if(flag=='2'){
    	dateStr=dataDt;
    }
    
    if(flag=='2'){
    	if(currCd=='01'){
	        cur = '人民币';
    	}else if(currCd=='02'){
    		cur = '外折人';
    	}else if(currCd=='03'){
    		cur = '本外币';
    	}
    }else{
	    if(cur=='01'){
	        cur = '人民币';
	    }else if(cur=='02'){
	        cur = '外折人';
	    }else if(cur=='03'){
	        cur = '本外币';
		}
    }
    if(flag=='2'){
		if(DW=='01'){
		    dw = '元';
		}else if(DW=='02'){
		    dw = '万元';
		}else if(DW=='03'){
		    dw = '亿元';
		}
    }else{
    	if(dw=='01'){
		    dw = '元';
		}else if(dw=='02'){
		    dw = '万元';
		}else if(dw=='03'){
		    dw = '亿元';
		}
    }
    if(isCntnNp=='0'){
    	isCntnNp = '不包含';
    }else if(isCntnNp=='1'){
    	isCntnNp = '包含';
    }else{
    	isCntnNp ='';
    }
    var subTitle ='';
    if(isCntnNp!=undefined&&isCntnNp!=null&&isCntnNp!=''){
    	if(cur=='无'){
    		subTitle = "统计日期:"+ dateStr +"     单位:"+ dw +"    是否包含不良:"+ isCntnNp;
    	}else{
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur+"     单位:"+ dw +"     是否包含不良:"+ isCntnNp;
    	}
    }else{
    	if(cur=='无'){
    		subTitle = "统计日期:"+ dateStr +"     单位:"+ dw;
    	}else{
    		subTitle = "统计日期:"+ dateStr +"     币种:"+ cur+"     单位:"+ dw ;
    	}
    }

    
    res.push([{title: tableName, rowNumber: 1, colNumber: 1, rowspan: 1, colspan:colSum,field: null}]);
    res.push([{title: subTitle, rowNumber: 2, colNumber: 1, rowspan: 1, colspan: colSum,field: null}]);
    return res;
}