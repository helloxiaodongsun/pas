$(function(){
	var ztreeSettingsMenu = {
        setting: {
            /*check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {"Y": "ps", "N": "s"}
            },*/
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
            },
            callback: {
                /*  onCheck: menuCheck,*/
                /* beforeClick: menubeforeClick,*/
                /* onClick: menuClick,*/
            }
        }
    };

    var ztreeSettingsOrg = {
        setting: {
            /*check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {"Y": "s", "N": "s"}
            },*/
            view: {
                showLine: true,
                selectedMulti: false,

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
            },
            callback: {
                /*  onCheck: orgCheck*/


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
    $.fn.zTree.init($('#menu_tree'), ztreeSettingsMenu.setting, menuNodes);
    $.fn.zTree.init($('#org_tree'), ztreeSettingsOrg.setting, orgNodes);

});