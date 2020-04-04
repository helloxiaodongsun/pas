var prv_tmp;
var menuTree;
var orgTree;
$(function(){
	var ztreeSettingsMenu = {
        setting: {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {"Y": "ps", "N": "s"}
            },
            view: {
                isSimpleData: false,
                treeNodeKey: "id",
                treeNodeParentKey: "pId",
                checkable: true,
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false
            },
            data: {
                simpleData: {
                    enable: false,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            }
        }
    };

    var ztreeSettingsOrg = {
        setting: {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {"Y": "s", "N": "s"}
            },
            view: {
                showLine: true,
                selectedMulti: false

            },
            data: {
                key: {
                    name: 'orgName'
                },

                simpleData: {
                    enable: false,
                    idKey: "orgId",
                    pIdKey: "superOrgId",
                    rootPId: ""

                }
            }
        }
    };

	$.fn.zTree.destroy($('#menu_tree'));
    $.fn.zTree.destroy($('#org_tree'));
    //所有菜单节点，初始化菜单树
    //var menuNodes = $.param.getResultByUrl('/api/menus/tree');
    //所有机构节点，用于初始化机构树
    //var orgNodes = $.param.getResultByUrl('/org/allValidOrg');
    //根据角色id查询该角色下的所有权限对
    //var resultByUrl = $.param.getResultByUrl("/role/searchPrvRef", checklist[0].roleId, 'role');
    menuTree=$.fn.zTree.init($('#menu_tree'), ztreeSettingsMenu.setting, menuList);
    orgTree=$.fn.zTree.init($('#org_tree'), ztreeSettingsOrg.setting, orgList);
    prv_tmp = JSON.parse(JSON.stringify(prvList));
    selectByPrv_tmp(roleTypeCd);


    //权限分配-保存
    $('#todobtn_prv').click(function () {

        var orgCheckedNodes = orgTree.getCheckedNodes(true);
        var menuCheckedNodes = menuTree.getCheckedNodes(true);
        var menuIds = arrayFormat(menuCheckedNodes, 'id');
        var orgIds = arrayFormat(orgCheckedNodes, 'orgId');
        savePrvInfo(roleId, menuIds, orgIds);
        /*var menuIds_copy = Object.keys(prv_tmp_copy);
        var orgChecksArray = [];

        tmpArry=[];
        if((menuCheckedNodes == null || menuCheckedNodes.length <= 0) && (menuIds_copy == null || menuIds_copy.length <= 0)){
            return;
        }
        //删除所有
        if((menuCheckedNodes == null || menuCheckedNodes.length <= 0) && (menuIds_copy != null && menuIds_copy.length > 0)){
            prv_tmp_NO_SELECT = {};
            for(var i=0;i<menuIds_copy.length;i++){
                var tmp = arrayFormat(prv_tmp_copy[menuIds_copy[i]], 'orgId');
                tmp.push(null);
                prv_tmp_NO_SELECT[menuIds_copy[i]] = tmp;
            }
            prv_tmp_SELECT = {};
            var roleId = roleInfo['roleId'];
            savePrvInfo(roleId, prv_tmp_NO_SELECT, prv_tmp_SELECT);
            return;
        }
        if(orgCheckedNodes == null || orgCheckedNodes.length <=0){
            /!*  tmpArry.push(null);*!/
            tmpArry.push(null);

        }else {
            for(var i =0;i<orgCheckedNodes.length;i++){
                var orgHirchyStr = orgCheckedNodes[i]['orgHirchy'];

                if(orgHirchyStr == 'LV5'){
                    tmpArry.push(orgCheckedNodes[i]);
                }else{

                    var children = orgCheckedNodes[i].children;

                    getChildNodes(children);
                    tmpArry.push(orgCheckedNodes[i]);
                }
            }
        }
        //代表菜单
        /!* orgIds.push(null);*!/
        var orgIds = arrayFormat(tmpArry, 'orgId');
        var sameMenuIds = sameOfArray(menuIds, menuIds_copy);
        if (sameMenuIds == null || sameMenuIds.length === 0) {
            prv_tmp_NO_SELECT = prv_tmp_copy;

            for (var i = 0; i < menuIds.length; i++) {
                prv_tmp_SELECT[menuIds[i]] = orgIds;
            }
        } else {
            //求差集四种情况
            var diffOfArrayCopy = diffOfArray(sameMenuIds, menuIds_copy);
            // var diffOfArrayMenuId = diffOfArray(sameMenuIds, menuIds);

            if (diffOfArrayCopy == null
                || diffOfArrayCopy.length === 0) {
                //无任何差别
                for (var i = 0; i < menuIds.length; i++) {
                    diffWithCopy(true, menuIds[i], orgIds);
                }
            } else {
                for (var i = 0; i < diffOfArrayCopy.length; i++) {
                    diffWithCopy(false, diffOfArrayCopy[i], orgIds);
                }

                for (var i = 0; i < menuIds.length; i++) {
                    diffWithCopy(true, menuIds[i], orgIds);
                }
            }

        }
        var roleId = roleInfo['roleId'];
        savePrvInfo(roleId, prv_tmp_NO_SELECT, prv_tmp_SELECT);*/
    });
});

function selectByPrv_tmp(roleType) {

    var selectId = undefined;
    var keysArray = Object.keys(prv_tmp);
    var nodes = orgTree.getNodes();
    var allOrgNodes = orgTree.transformToArray(nodes);


    for (var item in allOrgNodes) {

        /*  allOrgNodes[item].nocheck = false;*/

        switch (roleType) {
            case '01':
                if(allOrgNodes[item]['orgHirchy'] !='LV1'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
                break;
            case '02':
                if(allOrgNodes[item]['orgHirchy'] !='LV2'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
                break;
            case '03':
                if(allOrgNodes[item]['orgHirchy'] !='LV3'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
                break;
            case '04':
                if(allOrgNodes[item]['orgHirchy'] !='LV4'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
                break;
            case '05':
            case '06':
                if(allOrgNodes[item]['orgHirchy'] !='LV5'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
                break;
            default:
                if(allOrgNodes[item]['orgHirchy'] !='LV5'){
                    allOrgNodes[item].nocheck = true;
                }else {
                    allOrgNodes[item].nocheck = false;
                }
        }
    }
    orgTree.refresh();
    if (keysArray && keysArray.length > 0) {

        for (var i = 0; i < keysArray.length; i++) {
            var nodeByParam = menuTree.getNodeByParam("id", keysArray[i]);
            if (nodeByParam.level == 2) {
                selectId = keysArray[i];
                break;
            }
        }

        if (!selectId) {
            selectId = keysArray[0];
        }
        var prvTmpArray = prv_tmp[selectId];
        checkNodes(orgTree, prvTmpArray, 'orgId');
        checkNodes(menuTree, keysArray, 'id');
    }
}


function checkNodes(treeTarget, checkdArray, key) {
    if (checkdArray !== undefined && checkdArray.length > 0) {
        for (var i = 0; i < checkdArray.length; i++) {
            var nodeByParam = treeTarget.getNodeByParam(key, checkdArray[i]);
            if (nodeByParam != null) {
                treeTarget.checkNode(nodeByParam, true);
            }
        }
    }
}
function prvHtmlClose() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}
function savePrvInfo(roleId, menuIds, orgIds) {
    var index = layerLoad();

    var param = {
        'roleId': roleId,
        'menuIds': menuIds,
        'orgIds': orgIds
    };
    $.ajax({
        url: portal.bp() + './json/ok.json',
        type: 'post',
        async: true,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(param),
        complete:function(XMLHttpRequest){

        }
    }).done(function (data) {
        if (data.code === '200') {
            layerClose(index);
            prvHtmlClose();
            layer.msg('权限分配成功', {icon: 1});
            //$('#roletable').bootstrapTable('refresh')
        } else {
            layer.msg('权限分配失败', {icon: 2});
            layerClose(index);
        }
    });
}
function arrayFormat(objectArray, field) {

    var idArray = [];
    if (objectArray === undefined
        || objectArray == null
        || objectArray.length === 0) {
        return idArray;
    }

    if(objectArray.length === 1 && objectArray[0] == null){
        return objectArray;
    }
    objectArray.forEach(function (value) {
        idArray.push(value[field]);
    });
    /*  $.each(objectArray, function (key, value) {

          idArray.push(value[field]);
      });*/
    return idArray;
}
