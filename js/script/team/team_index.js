var teamBasicInfo_Add = undefined;
var teamBasicInfo_edit = undefined;
var teamMemberSelectIdList = [];
var teamMemberSelectList = [];
var teamMemberRowList= [];
var teamMemberLong = undefined;
var edit_PkId = undefined;
var teamBasicInfo_Add_tmp = undefined;
var teamIdTmp = undefined;
var teamProcessType = undefined;
var teamStep = undefined;
var teamEditUrl =undefined;
var team_Type_tmp = '';
var team_Type_tmp_splice = '';
var team_Char_tmp = '';
var checkKey = [];
var line = '';
var post = '';
//所属机构选项的html值
var orgListHtml = '';
//获取所属条线
var authLine = '';
//团队主页查询-团队id
var teamId = undefined;
//团队主页查询-团队名称
var teamName = undefined;
//团队主页查询-团队类型
var teamTypeCd = undefined;
//团队主页查询-团队性质
var teamCharCd = undefined;
//团队主页查询-所属机构
var belongOrg = undefined;

//var date = $.param.getEtlDate();
var exportColumns =[
    {'field':'TEAM_ID', 'title': '团队编号'},
    {'field':'TEAM_NAME', 'title': '团队名称'},
    {'field':'TEAM_TYPE_DESC', 'title': '团队类型'},
    {'field':'TEAM_CHAR_DESC', 'title': '团队性质'},
    {'field':'BELONG_LINE_DESC', 'title': '所属条线'},
    {'field':'ORG_NAME', 'title': '所属机构'},
    {'field':'EFF_DT', 'title': '生效日期'},
    {'field':'INVALID_DT', 'title': '失效日期'},
    {'field':'TEAM_MEMBER_CD', 'title': '成员编号'},
    {'field':'TEAM_MEMBER', 'title': '成员名称'},
    {'field':'BELONG_ORG_NAME', 'title': '所属机构/上级机构'},
    {'field':'TEAM_LONG', 'title': '是否团队长'}
];

$(function () {

   /* $("#show_effDt").datetimepicker({
        language:"zh-CN",
        format:"yyyy-mm-dd",
        minView:2,
        autoclose:true,
        todayBtn:true,
        clearBtn:false,
    });*/
    //$("#show_effDt").val(date);
    var type = 'post'; //ajax类型
    //获取团队类型
     team_Type_tmp=$.param.getSelectOptionOrder("TEAM_TYPE");
     team_Char_tmp = $.param.getSelectOptionOrder("TEAM_CHAR");
     var html = "";
     $.ajax({
         url: portal.bp() + './json/team/getParamByParentIdAndCode.json',
         type: 'get',
         async: false,
         cache: false,
         data: {
             'code': '01',
             'parentId': 'TEAM_TYPE',
         },
         dataType: "json",
         success: function (data) {
             if (data.code == '200') {
                 var col = data.data;
                 html += "<option value='" + col.encode + "'>" + col.name + "</option>"
             }
         }
     });
    team_Type_tmp_splice=html;
    $("#teamTypeCd").html("").append(team_Type_tmp);
    $('#teamTypeCd').selectpicker('refresh');
    //获取团队性质
    $("#teamCharCd").html("").append(team_Char_tmp);
    $('#teamCharCd').selectpicker('refresh');
    $('#teamMember').on('hide.bs.modal', function () {
        $('#teamMemberTable').bootstrapTable('destroy');
    });
    post = $.param.getSelectOptionOrder("POST");
    line = $.param.getSelectOptionOrder("LINE");
    orgListHtml=getOrgList();
    //获取所属机构
    $('#belongOrg').html("").append(orgListHtml).selectpicker('refresh');
    $('#belongOrg_Add').html("").append(orgListHtml).selectpicker('refresh');
    //获取团队类型
    $("#teamTypeCd_Add").html("").append(team_Type_tmp).selectpicker('refresh');
    //获取团队性质
    $("#teamCharCd_add").html("").append(team_Char_tmp).selectpicker('refresh');
    //获取所属条线
    authLine = getAuthLine();
    $("#belongLine").html("").append(authLine).selectpicker('refresh');
    //数据显示列表
    TableObj.oTableInit();
   // layer.closeAll();
    //防止IE8没有placleholder
    $('input,textarea').placeholder();

    //表单校验
    addModalValidator();

    //Modal验证销毁重构
    $('#add_Modal').on('hidden.bs.modal', function () {
        $("#formAdd").data('bootstrapValidator').destroy();
        $('#formAdd').data('bootstrapValidator', null);
        $('#formAdd')[0].reset();
        addModalValidator();
       /* $('#belongOrg_Add').selectpicker('refresh');
        $('#teamTypeCd_Add').selectpicker('refresh');
        $('#teamCharCd_add').selectpicker('refresh');
        $('#belongLine').selectpicker('refresh');*/

    });
    //新增、编辑团队员工成员页面
    $('#userInfoAdd_modal').on('hidden.bs.modal', function () {
        $('#userInfoAdd_formSearch')[0].reset();
        $('#belongOrgId_memberList').selectpicker('refresh');
        $('#belongPostCd_memberList').selectpicker('refresh');
        $('#belongLine_memberList').selectpicker('refresh');
        $('#userListTable').bootstrapTable('destroy');
        $('#userListSelectedTable').bootstrapTable('destroy');
        $('#userList_back').attr('style','display:auto');
    });
    //新增、编辑团队机构成员页面
    $('#orgInfoAdd_modal').on('hidden.bs.modal', function () {
        $('#belongOrgId_orgInfoAdd').selectpicker('refresh');
        $('#orgListTable').bootstrapTable('destroy');
        $('#orgListBeSelectedTable').bootstrapTable('destroy');
        $('#userList_back').attr('style','display:auto');
    });

    //选择机构成员页面添加按钮
    $('#btn_orgInfoMemberCheck').click(function () {

        if(teamMemberSelectList.length==0){
            return;
        }

        if (teamMemberRowList.length > 0) {
            var array = new Array();
            $.each(teamMemberSelectList, function (index, value1) {

              /*  if (teamMemberRowList.indexOf(value) < 0) {
                    teamMemberRowList.push(value);
                    $('#orgListBeSelectedTable').bootstrapTable('prepend', value);
                }*/
              $.each(teamMemberRowList,function (index, value2) {
                  if(value1['ORGID']==value2['ORGID']){
                      flag=true;
                     return;
                  }
              });

                if(!flag){
                    teamMemberRowList.push(value1);
                    array.push(value1);
                }
            });
            $('#orgListBeSelectedTable').bootstrapTable('append', array);
        }else{

            teamMemberRowList=JSON.parse(JSON.stringify(teamMemberSelectList));
            $('#orgListBeSelectedTable').bootstrapTable('append', teamMemberRowList);
            /*$.each(teamMemberSelectList, function (index, value) {

                    teamMemberRowList.push(value);
                    $('#orgListBeSelectedTable').bootstrapTable('append', value);

            })*/

        }
        layer.closeAll();

    });
    //选择机构成员页面删除按钮
    $('#btn_orgInfoMemberDel').click(function () {
        var data = $('#orgListBeSelectedTable').bootstrapTable('getSelections');
        if(data.length>0){
           var orgIdArray= $.map(data,function (value, index) {
               var valueIndex = teamMemberRowList.indexOf(value);
               if(valueIndex >=0){
                   teamMemberRowList.splice(valueIndex, 1);
               }

               if(value['ORGID'] == teamMemberLong){
                   teamMemberLong = undefined;
               }
                return value['ORGID'];
            });

            var data = $('#orgListBeSelectedTable').bootstrapTable('remove',{field:'ORGID', values: orgIdArray});
            layer.closeAll();

        }

    });
    //选择机构员工成员页面添加按钮
    $('#btn_userInfoMemberCheck').click(function () {

        if(teamMemberSelectList.length==0){
            return;
        }

        if (teamMemberRowList.length > 0) {
            var array = new Array();
            $.each(teamMemberSelectList, function (index, value1) {

                var flag = false;
                $.each(teamMemberRowList,function (index, value2) {
                    if(value1['EMPNUM']==value2['EMPNUM']){
                        flag=true;
                        return;
                    }
                });

                if(!flag){
                    teamMemberRowList.push(value1);
                    array.push(value1);
                }
            })
            $('#userListSelectedTable').bootstrapTable('append', array);
        }else{
            teamMemberRowList=JSON.parse(JSON.stringify(teamMemberSelectList));
            $('#userListSelectedTable').bootstrapTable('append', teamMemberRowList);
           /* $.each(teamMemberSelectList, function (index, value) {

                teamMemberRowList.push(value);
                var array = new Array();
                array.push(value);
               //

            })*/
           // updateCellDataClass($('#userListSelectedTable'));

        };
        layer.closeAll();

    });
    //选择机构员工成员页面删除按钮
    $('#btn_userInfoMemberDel').click(function () {
        var data = $('#userListSelectedTable').bootstrapTable('getSelections');
        if(data.length>0){
            var empNUmArray= $.map(data,function (value, index) {
                var obJIndex = getObJIndex(teamMemberRowList, 'EMPNUM', value['EMPNUM']);
               // var valueIndex = teamMemberRowList.indexOf(value);
                if(obJIndex >=0){
                    teamMemberRowList.splice(obJIndex, 1);
                }

                if(value['EMPNUM'] == teamMemberLong){
                    teamMemberLong = undefined;
                }
                return value['EMPNUM'];
            });

            var data = $('#userListSelectedTable').bootstrapTable('remove',{field:'EMPNUM', values: empNUmArray});
            layer.closeAll();

        }
    });

    $('#teamCharCd_add').on('changed.bs.select', function (a, b, c, d) {

        if ($(this).selectpicker('val') == '01') {
            $('#teamTypeCd_Add').html("").append(team_Type_tmp_splice);
            $('#teamTypeCd_Add').selectpicker('refresh');
        }else {
            $('#teamTypeCd_Add').html("").append(team_Type_tmp);
            $('#teamTypeCd_Add').selectpicker('refresh');
        }
           $('#teamTypeCd_Add').selectpicker('val','').change();

    });

    //新增按钮
    $("#btn_add").click(function () {
        initValue();
        teamProcessType = 1;
        teamStep = 1;
        $("#myModalLabel").text("新增团队");
        type = 'post';
        $("#add_Modal").modal("show");
        //addModalValidator();
        $('#belongOrg_Add').html("").append(orgListHtml).selectpicker('refresh');
        $("#teamTypeCd_Add").html("").append(team_Type_tmp).selectpicker('refresh');
        $("#teamCharCd_add").html("").append(team_Char_tmp).selectpicker('refresh');
        $("#belongLine").html("").append(authLine).selectpicker('refresh');

        //防止IE8没有placleholder
        $('input,textarea').placeholder();
    });


    //修改按钮
    $("#btn_upd").click(function () {
        initValue();
        teamProcessType = 2;
        teamStep = 1;
       /* $('input,textarea').placeholder();*/
        var checklist = $('#teamTable').bootstrapTable('getSelections');
        if (checklist.length > 1) {
            layer.msg("只能选择一条记录", {icon: 3});
        } else if (checklist.length == 0) {
            layer.msg("请选择团队", {icon: 3});
        } else {
            //赋值

            if(checklist[0]['teamTypeCd']=='01'){
                //个人团队
                userListAdd('01',checklist[0]['teamId'],'1','0','1');
                $('#userList_back').attr('style','display:none');
            }else{
                //机构团队
                orgListAdd('02', checklist[0]['teamId'], '1', '0','1');
                $('#orgMemberback').attr('style','display:none');
            }
            teamBasicInfo_Add = checklist[0];

        }
    });
    //删除按钮
    $("#btn_del").click(function () {
       initValue();
        var checklist = $('#teamTable').bootstrapTable('getSelections');
        if (checklist.length == 0) {
            layer.msg("请选择团队", {icon: 3});
        } else {
            var text = "确定删除选中的" + checklist.length + "项吗？";
            layer.confirm(text, {
                btn: ['确定', '取消'] //按钮
            }, function () {
                layer.msg("删除成功", {icon: 1});

            }, function () {

            });
        }

    });

    $('#orgMemberEditSubmit').click(function () {
        $('#orgInfoEdit_modal').modal('hide');
        if (teamMemberLong == null || teamMemberLong == undefined
            || teamMemberSelectIdList.indexOf(teamMemberLong) < 0) {
            layer.msg('保存失败', {icon: 2});
            return;
        }
        if (teamIdTmp == null || teamIdTmp == undefined) {

            teamIdTmp = $('#teamTable').bootstrapTable('getSelections');
            if (teamIdTmp == null || teamIdTmp == undefined) {
                layer.msg('保存失败', {icon: 2});
                return;
            }
        }

        var data = {
            'teamId': teamIdTmp,
            'teamMember': teamMemberSelectIdList,
            'teamLeader': teamMemberLong,
            'isApproval': '1',
            'teamProcessType':teamProcessType
        };
        var index;
        //保存，提交审批
        $.ajax({
            url: portal.bp() + '/team/saveTeamWhenEdit',
            type: 'get',
            data: data,
            success: function (data) {
                if (data.code == 200) {
                    layer.msg(data.message, {icon: 1});
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        })
    });


    $('#userListEdit_submit').click(function () {
        $('#userInfoEdit_modal').modal('hide');
        if (teamMemberLong == null || teamMemberLong == undefined
            || teamMemberSelectIdList.indexOf(teamMemberLong) < 0) {
            layer.msg('保存失败', {icon: 2});
            return;
        }
        if (teamIdTmp == null || teamIdTmp == undefined) {
            teamIdTmp = $('#teamTable').bootstrapTable('getSelections');
            if (teamIdTmp == null || teamIdTmp == undefined) {
                layer.msg('保存失败', {icon: 2});
                return;
            }
        }

        var data = {
            'teamId': teamIdTmp,
            'teamMember': teamMemberSelectIdList,
            'teamLeader': teamMemberLong,
            'isApproval': '1',
            'teamProcessType':teamProcessType
        };
        var index;
        //保存，提交审批
        $.ajax({
            url: portal.bp() + '/team/saveTeamWhenEdit',
            type: 'get',
            data: data,
            success: function (data) {
                if (data.code == 200) {
                    layer.msg(data.message, {icon: 1});
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        })
    });

    //选择团队成员
    // return;
    $("#selectTeamMember").click(function () {


        //表单校验
        var bootstrapValidator = $("#formAdd").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) {
            return;
        }

        var teamTypeValue = $("#teamTypeCd_Add").val();
        var teamChar = $("#teamCharCd_add").val();
        teamBasicInfo_Add = {
            "teamTypeCd": $("#teamTypeCd_Add").val(),
            "belongOrg": $("#belongOrg_Add").val(),
            "teamCharCd": $("#teamCharCd_add").val(),
            "teamDesc": $("#teamDesc_Add").val(),
            "belongLine": $("#belongLine").val(),
        };
        $("#add_Modal").modal("hide");
        if (teamProcessType == 1 && teamStep == 1) {
            teamMemberSelectIdList = [];
            teamMemberSelectList = [];
            teamMemberLong = undefined;
            if (teamTypeValue == '01') {
                userListAdd('01', '', '', '1','');
            } else {
                orgListAdd('02', '', '', '1','');
            };
            return;
        };

        if (teamProcessType == 1 && teamStep != 1) {
            if (teamBasicInfo_Add.teamTypeCd == teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue == '01') {
                userListAdd('01', '', '', '1','');
                $('#userListSelectedTable').bootstrapTable('append', teamMemberRowList);
            }
            if (teamBasicInfo_Add.teamTypeCd == teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue != '01') {
                orgListAdd('02', '', '', '1','');
                $('#orgListBeSelectedTable').bootstrapTable('append', teamMemberRowList);
            }

            if (teamBasicInfo_Add.teamTypeCd != teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue == '01') {
                teamMemberSelectIdList = [];
                teamMemberSelectList = [];
                teamMemberLong = undefined;
                teamMemberRowList=[];
                userListAdd('01', '', '', '1','');
            }

            if (teamBasicInfo_Add.teamTypeCd != teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue != '01'){
                teamMemberSelectIdList = [];
                teamMemberSelectList = [];
                teamMemberLong = undefined;
                teamMemberRowList = [];
                orgListAdd('02', '', '', '1','');
            }
            return;
        }

        if (teamProcessType == 3 && teamStep == 1) {
            teamMemberSelectList = [];
            teamMemberSelectIdList = [];
            teamMemberLong = undefined;
            teamMemberRowList = [];
            if (teamBasicInfo_edit.teamTypeCd == teamBasicInfo_Add.teamTypeCd && teamTypeValue == '01') {
                userListAdd('01', teamBasicInfo_edit.teamId, '0', '0','');
            }

            if (teamBasicInfo_edit.teamTypeCd == teamBasicInfo_Add.teamTypeCd && teamTypeValue != '01') {
                orgListAdd('02', teamBasicInfo_edit.teamId, '0', '0','');
            }

            if (teamBasicInfo_edit.teamTypeCd != teamBasicInfo_Add.teamTypeCd && teamTypeValue == '01') {
                userListAdd('01', '', '', '1','');
            }

            if (teamBasicInfo_edit.teamTypeCd != teamBasicInfo_Add.teamTypeCd && teamTypeValue != '01'){
                orgListAdd('02', '', '','1','');
            }
            return;

        }



        if (teamProcessType == 3 && teamStep !=1){
            if (teamBasicInfo_Add.teamTypeCd == teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue == '01') {
                userListAdd('01', '', '', '1','');
                $('#userListSelectedTable').bootstrapTable('append', teamMemberRowList);
            }
            if (teamBasicInfo_Add.teamTypeCd == teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue != '01'){
                orgListAdd('02', '', '', '1','');
                $('#orgListBeSelectedTable').bootstrapTable('append', teamMemberRowList);
            }

            if (teamBasicInfo_Add.teamTypeCd != teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue == '01'){
                teamMemberSelectIdList = [];
                teamMemberSelectList = [];
                teamMemberLong = undefined;
                teamMemberRowList=[];
                userListAdd('01', '', '', '1','');
            }

            if (teamBasicInfo_Add.teamTypeCd != teamBasicInfo_Add_tmp.teamTypeCd && teamTypeValue != '01'){
                teamMemberSelectIdList = [];
                teamMemberSelectList = [];
                teamMemberLong = undefined;
                teamMemberRowList=[];
                orgListAdd('02', '', '', '1','');
            }
            return;
        }

    });

    //团队成员为员工时保存
    $("#userListSave").click(function () {


        if (teamMemberRowList.size <= 0) {
            layer.msg("至少选择一个员工", {icon: 3});
            return;
        }

        if (teamMemberLong == undefined || teamMemberLong == null) {
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }

        var flag=false;
        var teamMemberRowIdList = [];
        $.each(teamMemberRowList,function (index, value) {

            if(teamMemberRowIdList.indexOf((value['EMPNUM'])<0)){
                teamMemberRowIdList.push((value['EMPNUM']));
            }

            if(value['EMPNUM']==teamMemberLong){
                flag = true;
            }
        });

        if(!flag){
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }
        if (teamBasicInfo_Add == null
            || teamBasicInfo_Add == undefined
            || Object.keys(teamBasicInfo_Add).length <= 0
            || teamBasicInfo_Add.teamTypeCd == null
            || teamBasicInfo_Add.teamTypeCd == undefined
            || teamBasicInfo_Add.belongOrg == null
            || teamBasicInfo_Add.belongOrg == undefined
            || teamBasicInfo_Add.teamCharCd == null
            || teamBasicInfo_Add.teamCharCd == undefined) {
            layer.msg("团队基本信息不符合规则", {icon: 3});
            return;
        }
        teamBasicInfo_Add['teamLeader'] = teamMemberLong;
        //teamMemberRowList=[];
        teamBasicInfo_Add['teamMember'] = teamMemberRowIdList;
        //teamBasicInfo_Add['pkId'] = edit_PkId;

        var url = undefined;
        if (teamProcessType == 1 || teamProcessType == 2) {
            url = '/team/saveTeam';
        } else {
            url = '/team/saveTeamWhenModify';
            teamBasicInfo_Add['pkId'] = teamBasicInfo_edit.pkId;
            teamBasicInfo_Add['teamId'] = teamBasicInfo_edit.teamId;
        }
        var index;
        $.ajax({
            url: portal.bp() + url,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: "json",
            data: JSON.stringify(new Array(teamBasicInfo_Add)),
            success: function (data) {
                $('#orgInfoAdd_modal').modal('hide');
                $('#userInfoAdd_modal').modal('hide');
                if (data.code != '200') {
                    layer.msg(data.message, {icon: 2});
                    return;
                }
                var teamIds = data.data;
                if (teamIds == undefined
                    || teamIds == null
                    || teamIds.length == 0) {

                    layer.msg("获取已保存的信息失败", {icon: 2});
                    return;
                }
                $('#saveConfirm_formSearch')[0].reset();
                //防止IE8没有placleholder
                $('input,textarea').placeholder();
                $('#saveSuccessTable').bootstrapTable("destroy");
                $("#save_confirm_modal").modal('show');
                $.ajax({

                        url: portal.bp() + '/team/findTeamBasicInfoMgmtOnEditableByTeamId',
                        type: 'post',
                        data: {
                            'teamId': teamIds[0]
                        },

                        success: function (data) {

                            var data = data.data;
                            if (data == undefined
                                || data == null) {

                                layer.msg("获取已保存的信息失败", {icon: 2});
                                return;
                            }
                            teamBasicInfo_edit = data;
                            edit_PkId = data.pkId;

                            $("#saveConfirm_teamId").val(data.teamId);
                            $("#saveConfirm_teamId").attr("readonly", "readonly");

                            $("#saveConfirm_teamName").val(data.teamName);
                            $("#saveConfirm_teamName").attr("readonly", "readonly");

                            $("#saveConfirm_teamTypeCd").val(data.teamType);
                            $("#saveConfirm_teamTypeCd").attr("readonly", "readonly");

                            $("#saveConfirm_teamCharCd").val(data.teamChar);
                            $("#saveConfirm_teamCharCd").attr("readonly", "readonly");

                            $("#saveConfirm_belongLine").val(data.belongLineDesc);
                            $("#saveConfirm_belongLine").attr("readonly", "readonly");


                            $("#saveConfirm_belongOrg").val(data.belongOrgDesc);
                            $("#saveConfirm_belongOrg").attr("readonly", "readonly");

                            TableObj.saveConfirm(teamIds, data.teamTypeCd);

                        }
                    }
                );

            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        });
    });
    $("#orgMemberSave").click(function () {

        if (teamMemberRowList.length <= 0) {
            layer.msg("至少选择一个机构", {icon: 3});
            return;
        }

        if (teamMemberLong == undefined || teamMemberLong == null) {
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }
        var teamMemberList = $.map(teamMemberRowList, function (value, index) {

            return value['ORGID'];
        });


        if (teamMemberList.indexOf(teamMemberLong) < 0) {
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }

        if (teamBasicInfo_Add == null
            || teamBasicInfo_Add == undefined
            || Object.keys(teamBasicInfo_Add).length <= 0
            || teamBasicInfo_Add.teamTypeCd == null
            || teamBasicInfo_Add.teamTypeCd == undefined
            || teamBasicInfo_Add.belongOrg == null
            || teamBasicInfo_Add.belongOrg == undefined
            || teamBasicInfo_Add.teamCharCd == null
            || teamBasicInfo_Add.teamCharCd == undefined) {
            layer.msg("团队基本信息不符合规则", {icon: 3});
            return;
        }
        teamBasicInfo_Add['teamLeader'] = teamMemberLong;
        teamBasicInfo_Add['teamMember'] = teamMemberList;
        //teamBasicInfo_Add['pkId'] = edit_PkId;

        var url = undefined;
        if (teamProcessType == 1 || teamProcessType == 2) {
            url = '/team/saveTeam';
        } else {//3
            url = '/team/saveTeamWhenModify';
            teamBasicInfo_Add['pkId'] = teamBasicInfo_edit.pkId;
            teamBasicInfo_Add['teamId'] = teamBasicInfo_edit.teamId;
        }
        var index;
        $.ajax({
            url: portal.bp() + url,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: "json",
            data: JSON.stringify(new Array(teamBasicInfo_Add)),
            success: function (data) {

                var code = data.code;
                if (code != '200'
                ) {

                    layer.msg(data.message, {icon: 2});
                    return;
                }
                var teamIds = data.data;
                if (teamIds == undefined
                    || teamIds == null
                    || teamIds.length == 0
                ) {

                    layer.msg("获取已保存的信息失败", {icon: 2});
                    return;
                }


                $('#saveConfirm_formSearch')[0].reset();
                $('input,textarea').placeholder(); //防止IE8没有placleholder
                $('#saveSuccessTable').bootstrapTable("destroy");
                $("#save_confirm_modal").modal('show');


                $.ajax({

                        url: portal.bp() + '/team/findTeamBasicInfoMgmtOnEditableByTeamId',
                        type: 'post',
                        data: {
                            'teamId': teamIds[0]
                        },

                        success: function (data) {

                            var data = data.data;
                            if (data == undefined
                                || data == null) {

                                layer.msg("获取已保存的信息失败", {icon: 2});
                                return;
                            }
                            getOrgList('belongOrg_Add');
                            edit_PkId = data.pkId;
                            teamBasicInfo_edit = data;

                            $("#saveConfirm_teamId").val(data.teamId);
                            $("#saveConfirm_teamId").attr("readonly", "readonly");

                            $("#saveConfirm_teamName").val(data.teamName);
                            $("#saveConfirm_teamName").attr("readonly", "readonly");

                            $("#saveConfirm_teamTypeCd").val(data.teamType);
                            $("#saveConfirm_teamTypeCd").attr("readonly", "readonly");

                            $("#saveConfirm_teamCharCd").val(data.teamChar);
                            $("#saveConfirm_teamCharCd").attr("readonly", "readonly");

                            $("#saveConfirm_belongOrg").val(data.belongOrgDesc);
                            $("#saveConfirm_belongOrg").attr("readonly", "readonly");

                            $("#saveConfirm_belongLine").val(data.belongLineDesc);
                            $("#saveConfirm_belongLine").attr("readonly", "readonly");

                            TableObj.saveConfirm(teamIds, data.teamTypeCd);

                            $('#orgInfoAdd_modal').modal('hide');
                            $('#userInfoAdd_modal').modal('hide');

                        }
                    }
                );

            },
            beforeSend:function(XMLHttpRequest){
                index = layerLoad();
            },
            complete:function(XMLHttpRequest){
                layerClose(index);
            }
        });


    });


    $("#orgMemberSubmit").click(function () {

        if (teamMemberRowList.size <= 0) {
            layer.msg("至少选择一个机构", {icon: 3});
            return;
        }

        if (teamMemberLong == undefined || teamMemberLong == null) {
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }
        var flag=false;
        var teamMemberRowIdList = [];
        $.each(teamMemberRowList,function (index, value) {

            if(teamMemberRowIdList.indexOf((value['ORGID'])<0)){
                teamMemberRowIdList.push((value['ORGID']));
            }

            if(value['ORGID']==teamMemberLong){
                flag = true;
            }
        });

        if(!flag){
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }

        if (teamBasicInfo_Add == null
            || teamBasicInfo_Add == undefined
            || Object.keys(teamBasicInfo_Add).length <= 0
            || teamBasicInfo_Add.teamTypeCd == null
            || teamBasicInfo_Add.teamTypeCd == undefined
            || teamBasicInfo_Add.belongOrg == null
            || teamBasicInfo_Add.belongOrg == undefined
            || teamBasicInfo_Add.teamCharCd == null
            || teamBasicInfo_Add.teamCharCd == undefined) {
            layer.msg("团队基本信息不符合规则", {icon: 3});
            return;
        }
        teamBasicInfo_Add['teamLeader'] = teamMemberLong;
        teamBasicInfo_Add['teamMember'] = teamMemberRowIdList;
        //teamBasicInfo_Add['pkId'] = edit_PkId;
        var url = undefined;
        if (teamProcessType == 1) {
            url = '/team/saveTeamApproval';
        } else {
            url = '/team/saveTeamApprovalWhenModify';
            teamBasicInfo_Add['pkId'] = teamBasicInfo_edit.pkId;
            teamBasicInfo_Add['teamId'] = teamBasicInfo_edit.teamId;
        }
        var index;
        $.ajax({
            url: portal.bp() + url,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: "json",
            data: JSON.stringify(new Array(teamBasicInfo_Add)),
            success: function (data) {

                var code = data.code;
                $('#orgInfoAdd_modal').modal('hide');
                initValue();
                if (code == 200) {
                    layer.msg("提交成功", {icon: 1});
                    query();
                } else {
                    layer.msg(data.message, {icon: 2});
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
    //团队成员为员工时提交审批
    $("#userList_submit").click(function () {

        if (teamMemberRowList.size <= 0) {
            layer.msg("至少选择一个机构", {icon: 3});
            return;
        }

        if (teamMemberLong == undefined || teamMemberLong == null) {
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }

        var flag=false;
        var teamMemberRowIdList = [];
        $.each(teamMemberRowList,function (index, value) {

            if(teamMemberRowIdList.indexOf((value['EMPNUM'])<0)){
                teamMemberRowIdList.push((value['EMPNUM']));
            }

            if(value['EMPNUM']==teamMemberLong){
                flag = true;
            }
        });
        if(!flag){
            layer.msg("每个团队必须有一个团队长", {icon: 3});
            return;
        }

        if (teamBasicInfo_Add == null
            || teamBasicInfo_Add == undefined
            || Object.keys(teamBasicInfo_Add).length <= 0
            || teamBasicInfo_Add.teamTypeCd == null
            || teamBasicInfo_Add.teamTypeCd == undefined
            || teamBasicInfo_Add.belongOrg == null
            || teamBasicInfo_Add.belongOrg == undefined
            || teamBasicInfo_Add.teamCharCd == null
            || teamBasicInfo_Add.teamCharCd == undefined) {
            layer.msg("团队基本信息不符合规则", {icon: 3});
            return;
        }
        teamBasicInfo_Add['teamLeader'] = teamMemberLong;
        teamBasicInfo_Add['teamMember'] = teamMemberRowIdList;
        //teamBasicInfo_Add['pkId'] = edit_PkId;
        var url = undefined;
        if (teamProcessType == 1 || teamProcessType == 2) {
            url = '/team/saveTeamApproval';
        } else {
            url = '/team/saveTeamApprovalWhenModify'
            teamBasicInfo_Add['pkId'] = teamBasicInfo_edit.pkId;
            teamBasicInfo_Add['teamId'] = teamBasicInfo_edit.teamId;
        }

        var index;
        $.ajax({
            url: portal.bp() + url,
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: "json",
            data: JSON.stringify(new Array(teamBasicInfo_Add)),
            success: function (data) {

                var code = data.code;

                $('#userInfoAdd_modal').modal('hide');

                if (code == 200) {
                    layer.msg("提交成功", {icon: 1});
                    query();
                } else {
                    layer.msg(data.message, {icon: 2});
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
    //orgMemberSubmit
    //返回上一步
    $('#userList_back').click(function () {

        teamStep = 2;

       var flag=false;
        if (teamBasicInfo_Add != undefined && teamBasicInfo_Add != null
            && Object.keys(teamBasicInfo_Add).length > 0) {
            $("#teamTypeCd_Add").selectpicker('val', teamBasicInfo_Add.teamTypeCd);
            $("#belongOrg_Add").selectpicker('val', teamBasicInfo_Add.belongOrg);
            $("#teamCharCd_add").selectpicker('val', teamBasicInfo_Add.teamCharCd);
            $("#belongLine").selectpicker('val', teamBasicInfo_Add.belongLine);
            $("#teamDesc_Add").val(teamBasicInfo_Add.teamDesc);
            teamBasicInfo_Add_tmp = JSON.parse(JSON.stringify(teamBasicInfo_Add));
            teamMemberRowList = $('#userListSelectedTable').bootstrapTable('getData');
            flag=true;
        }
        $('#userInfoAdd_modal').modal('hide');
        if(flag){
            $('#add_Modal').modal('show');
        }
    });

    $('#orgMemberback').click(function () {
        teamStep = 2;
        var flag=false;
        if (teamBasicInfo_Add != undefined && teamBasicInfo_Add != null
            && Object.keys(teamBasicInfo_Add).length > 0) {
            $("#teamTypeCd_Add").selectpicker('val', teamBasicInfo_Add.teamTypeCd);
            $("#belongOrg_Add").selectpicker('val', teamBasicInfo_Add.belongOrg);
            $("#teamCharCd_add").selectpicker('val', teamBasicInfo_Add.teamCharCd);
            $("#belongLine").selectpicker('val', teamBasicInfo_Add.belongLine);
            $("#teamDesc_Add").val(teamBasicInfo_Add.teamDesc);
            teamBasicInfo_Add_tmp = JSON.parse(JSON.stringify(teamBasicInfo_Add));
            teamMemberRowList = $('#orgListBeSelectedTable').bootstrapTable('getData');
            flag=true;
        }
        $('#orgInfoAdd_modal').modal('hide');
        if(flag){
            $('#add_Modal').modal('show');
        }
    });


    window.operateEvents = {

        //orgTeamlong
        "click #userTeamlongSelect": function (e, value, row, index) {
            teamMemberLong = row.EMPNUM;
        },
        "click #orgTeamlongBeSelected": function (e, value, row, index) {
            teamMemberLong = row.ORGID;
        }/*,
        "click #orgTeamlongEdit": function (e, value, row, index) {
            teamMemberLong = row.ORGID;
        },
        "click #userTeamlongEdit": function (e, value, row, index) {
            teamMemberLong = row.EMPNUM;
        },*/
    };

    //提交审批
    $('#confirm_approval').click(function () {


        approvalByPkId(edit_PkId);


    });

    //保存后修改
    $('#confirm_edit').click(function () {
        initValue();

        if(teamProcessType ==1 || teamProcessType == 3){
            teamProcessType = 3;
            teamStep = 1;
        }else if(teamProcessType ==2 || teamProcessType == 3){
            teamProcessType = 4;
            teamStep = 1;
        }

        $('#save_confirm_modal').modal('hide');
        var teamId = $('#saveConfirm_teamId').val();
        if (teamId == undefined || teamId == null) {
            layer.msg("未获取到团队编号", {icon: 2});
            return;
        }
        //根据teamId查询到基本信息
        var index;
        var teamBasicMgmt=undefined;
        $.ajax({
                url: portal.bp() + '/team/findTeamBasicInfoMgmtOnEditableByTeamId',
                type: 'post',
                async: false,
                data: {
                    'teamId': teamId
                },

                success: function (res) {
                    if (res.code != 200 || res.data == undefined || res.data == null) {
                        layer.msg("获取已保存的信息失败", {icon: 2});
                        return;
                    }
                    teamBasicMgmt = JSON.parse(JSON.stringify(res.data));
                    teamBasicInfo_edit = JSON.parse(JSON.stringify(res.data));
                    edit_PkId = res.data.pkId;
                },
                beforeSend:function(XMLHttpRequest){
                    index = layerLoad();
                },
                complete:function(XMLHttpRequest){
                    layerClose(index);
                }
            }
        );

        if(teamBasicMgmt == null || teamBasicMgmt == undefined){
            return;
        }

        if(teamProcessType == 3){
            $('#myModalLabel').text('团队修改');
            $("#teamTypeCd_Add").selectpicker('val', teamBasicInfo_edit.teamTypeCd);
            $("#belongOrg_Add").selectpicker('val', teamBasicInfo_edit.belongOrg);
            $("#teamCharCd_add").selectpicker('val', teamBasicInfo_edit.teamCharCd);
            $("#belongLine").selectpicker('val', teamBasicInfo_edit.belongLine);
            $("#teamDesc_Add").val(teamBasicInfo_edit.teamDesc);
            $('#add_Modal').modal('show');
            return;
        }

        if(teamBasicMgmt['teamTypeCd']=='01'){
            //个人团队
            userListAdd('01',teamBasicMgmt['teamId'],'0','0','1');
            $('#userList_back').attr('style','display:none');
        }else{
            //机构团队
            orgListAdd('02', teamBasicMgmt['teamId'], '0', '0','1');
            $('#orgMemberback').attr('style','display:none');
        }
        teamBasicInfo_Add = teamBasicMgmt;

    });

    $("#show_history").click(function(){
    	var checklist = $('#approvetable').bootstrapTable('getSelections');
    	if(checklist==null||checklist.length!=1){
    		layer.msg('请选择一条数据',{icon:3});
    		return;
    	}
    	showWorkFlowHistory(checklist[0].pkId);
    });
    //导出
    $('#btn_export').click(function () {
        //ajax将数据传回后台，生成excel文件，并返回excel文件名称
        //组装查询参数

        $.ajax({
            url:portal.bp() + './json/team/queryByPage.json',
            type: 'post',
            cache: false,
            async: false,
            contentType: "application/x-www-form-urlencoded",
            data: {
                'teamId':  teamId,
                'teamName':  teamName,
                'teamTypeCd': teamTypeCd,
                'teamCharCd': teamCharCd,
                'belongOrg':  belongOrg,
                'teamIdList': checkKey,
                'tableHeader':JSON.stringify(exportColumns)}
        }).done(
            function (res) {
                if(res.code == '200'){
                    var pathName = res.data;
                    //根据获得的excel名称，下载对应的excel
                    downloadByFileName(pathName);
                } else {
                    layer.msg(data.message, {icon: 2});
                }
            }
        );

    });
});
function userworkflowGoback(pkId){
	if(workflowGoback(pkId)){
		$('#approvetable').bootstrapTable('destroy')
	    TableObj.showApproveDetailTable();
	}
}
function delMgmt(pkId){
	$.ajax({
        url: portal.bp() + '/team/workflow/del?r='+Math.random(),
        type: 'POST',
        async: false,
        data:{"pkIdList": [pkId]},
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
        	layer.msg("操作成功",{icon:1});
        	$('#approvetable').bootstrapTable('destroy')
    	    TableObj.showApproveDetailTable();
        }else{
        	layer.msg(data.message,{icon:2});
        }
    });
}

//分页查询用户列表
var TableObj = {
    oTableInit: function () {
        var columns = [];
        //操作列是否展示

        columns = [
            {
                field: 'check',
                checkbox: true,
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'teamId',
                title: '团队编号',
            }, {
                field: 'teamName',
                title: '团队名称',
                clickToSelect: false,
                formatter: teamDetailLink
            }, {
                field: 'effDt',
                title: '生效日期',
            }, {
                field: 'invalidDt',
                title: '失效日期'

            },
            {
                field: 'teamType',
                title: '团队类型',
            },
            {
                field: 'teamChar',
                title: '团队性质',
            },
            {
                field: 'belongLineDesc',
                title: '所属条线',
            }
            ,
            {
                field: 'belongOrgName',
                title: '所属机构',
            }
        ];

        $('#teamTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/team/queryByPage.json',
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
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'teamId': $('#teamId').val(),
                    'teamName': $('#teamName').val(),
                    'teamTypeCd': $('#teamTypeCd').val(),
                    'teamCharCd': $('#teamCharCd').val(),
                    'belongOrg': $('#belongOrg').val()
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:500, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (data) {

                $('#teamTable').bootstrapTable('checkBy', {
                    field: "teamId",
                    values: checkKey
                });
                $('#teamTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                resizeTables();
            },
            onCheck: function (row, $element) {

                var key = row.teamId;
                if (checkKey.indexOf(key) < 0) {
                    checkKey.push(key);
                }


            },
            onUncheck: function (row, $element) {

                var key = row.teamId;
                if (checkKey.indexOf(key) >= 0) {
                    checkKey.splice(checkKey.indexOf(key), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].teamId;
                        if (checkKey.indexOf(key) < 0) {
                            checkKey.push(key);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var key = rows[i].teamId;
                        if (checkKey.indexOf(key) >= 0) {
                            checkKey.splice(checkKey.indexOf(key), 1);
                        }
                    }
                }

            }
        });
    },
    teamMemberTableFactory: function (pkId, teamTypeCd, teamId, validTag, operType) {
        //操作列是否展示
        var columns;
        if('01' == teamTypeCd){
            columns = [
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'MEMBERID',
                    title: '成员编号',
                }, {
                    field: 'MEMBERNAME',
                    title: '成员名称',
                }, {
                    field: 'MEMBEROFORG',
                    title: '所属机构',
                }, {
                    field: 'MEMBEROFCAPTAIN',
                    title: '是否队长',
                    formatter: function (value, row, index) {
                        if (row.MEMBEROFCAPTAIN == '1') {
                            return '是';
                        }
                        return '否';
                    }
                }

            ]
        }else{

            columns = [
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'MEMBERID',
                    title: '成员编号',
                }, {
                    field: 'MEMBERNAME',
                    title: '成员名称',
                }, {
                    field: 'MEMBEROFORG',
                    title: '上级机构',
                }, {
                    field: 'MEMBEROFCAPTAIN',
                    title: '是否队长',
                    formatter: function (value, row, index) {
                        if (row.MEMBEROFCAPTAIN == '1') {
                            return '是';
                        }
                        return '否';
                    }
                }

            ]

        }
        //团队成员表格
        $('#teamMemberTable').bootstrapTable({
            url: portal.bp() + './json/team/queryTeamMemberByPage.json',
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
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'teamId': teamId,
                    'teamTypeCd': teamTypeCd,
                    'pkId': pkId,
                    'validTag': validTag,
                    'operType': operType
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height:500, //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns
        });
    },
    userListAddFactory: function (teamId,url) {
        columns = [
            {
                field: 'check',
                checkbox: true,
                selectItemName: 'check'
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'EMPNUM',
                title: '员工工号'
            }, {
                field: 'EMPNAME',
                title: '员工名称',
            }, {
                field: 'BELONGPOST',
                title: '所属岗位',
            }, {
                field: 'ORGNAME',
                title: '所属机构',
            },
            {
                field: 'BELONGLINE',
                title: '所属条线',
            }/*,
            {
                field: 'TEAMLONG',
                title: '是否是团队长',
                visible: false,
                formatter: function (value, row, index) {
                    var html = '3';
                   // html = '<input type="radio" name="USER_TEAMLONG_SELECT" id="userTeamlongSelect" value="' + row.EMPNUM + '"/>';
                    return html;
                }

            }*/
        ];
        $('#userListTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/team/selectUserList.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            height: getTableHeight(document),
            uniqueId: 'EMPNUM',
            onCheck: function (row, $element) {

                if (teamMemberSelectIdList.indexOf(row.EMPNUM) < 0) {
                    teamMemberSelectIdList.push(row.EMPNUM);
                    teamMemberSelectList.push(row);

                }

            },
            onUncheck: function (row) {

                if (teamMemberSelectIdList.indexOf(row.EMPNUM) >= 0) {
                    teamMemberSelectIdList.splice(teamMemberSelectIdList.indexOf(row.EMPNUM), 1);
                    teamMemberSelectList.splice(teamMemberSelectIdList.indexOf(row.EMPNUM), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {

                        if (teamMemberSelectIdList.indexOf(rows[i]['EMPNUM']) < 0) {

                            teamMemberSelectIdList.push(rows[i]['EMPNUM']);
                            teamMemberSelectList.push(rows[i]);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        if (teamMemberSelectIdList.indexOf(rows[i]['EMPNUM']) >= 0) {
                            teamMemberSelectIdList.splice(teamMemberSelectIdList.indexOf(rows[i]['EMPNUM']), 1);
                            teamMemberSelectList.splice(teamMemberSelectIdList.indexOf(rows[i]['EMPNUM']),1);
                        }
                    }
                }

            },
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'empNum': $('#empNum_memberList').val(),
                    'empName': $('#empName_memberList').val(),
                    'belongPostCd': $('#belongPostCd_memberList').val(),
                    'belongOrgId': $('#belongOrgId_memberList').val(),
                    'belongLine': $('#belongLine_memberList').val(),
                    'teamId': teamId
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: columns,
            onLoadSuccess: function (data) {

                $('#userListTable').bootstrapTable('checkBy', {
                    field: "EMPNUM",
                    values: teamMemberSelectIdList
                });
                $('#userListTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                resizeTables();
            }
        });

    },
    userListSelectFactory: function (teamType,teamId,relaStatus,oprIndex) {
        var url = portal.bp() + '/team/selectTeamMember';
        if(oprIndex == '1'){
            url = '';
        }
        columns = [
            {
                field: 'check',
                checkbox: true,
                selectItemName: 'check'
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'EMPNUM',
                title: '员工工号'
            }, {
                field: 'EMPNAME',
                title: '员工名称',
            }, {
                field: 'BELONGPOST',
                title: '所属岗位',
            }, {
                field: 'ORGNAME',
                title: '所属机构',
            },
            {
                field: 'BELONGLINE',
                title: '所属条线',
            },
            {
                field: 'TEAMLONG',
                title: '是否是团队长',
                clickToSelect: false,
                valign: "top",
                events: operateEvents,
                formatter: function (value, row, index) {

                    var html = '';
                    if(oprIndex =='1'){
                        if(row["EMPNUM"] == teamMemberLong){
                            html = '<input type="radio" name="USER_TEAMLONG_SELECT" checked="checked" id="userTeamlongSelect" value="' + row.EMPNUM + '"/>';
                        }else {
                            html = '<input type="radio" name="USER_TEAMLONG_SELECT" id="userTeamlongSelect" value="' + row.EMPNUM + '"/>';
                        }
                        return html;
                    }

                    if(row["TEAMLONG"]=='1'){
                        html = '<input type="radio" name="USER_TEAMLONG_SELECT" checked="checked" id="userTeamlongSelect" value="' + row.EMPNUM + '"/>';
                        teamMemberLong = row.EMPNUM;
                    }else{
                        html = '<input type="radio" name="USER_TEAMLONG_SELECT" id="userTeamlongSelect" value="' + row.EMPNUM + '"/>';
                    }

                    return html;
                }

            }
        ];
        $('#userListSelectedTable').bootstrapTable('destroy').bootstrapTable({
            url: url,
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            //height: getTableHeight(document),
            uniqueId: 'EMPNUM',
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                        'teamType': teamType,
                        'relaStatus':relaStatus,
                        'teamId': teamId
                }
            },
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    teamMemberRowList=JSON.parse(JSON.stringify(res.data));
                    teamMemberSelectList=JSON.parse(JSON.stringify(res.data));
                    teamMemberSelectIdList=[]
                    $.each(res.data,function (index, value) {
                        if(teamMemberSelectIdList.indexOf(value['EMPNUM'])<0){
                            teamMemberSelectIdList.push(value['EMPNUM']);
                        }

                    })
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            columns: columns/*,
            onLoadSuccess: function (data) {
             teamMemberRowList=data;
             teamMemberSelectList=data;
             teamMemberSelectIdList=[]
             $.each(data,function (index, value) {
                 if(teamMemberSelectIdList.indexOf(value['EMPNUM'])<0){
                     teamMemberSelectIdList.push(value['EMPNUM']);
                 }

             })
            }*/
        });

    },
    userListAddFactoryWhenEdit: function (teamId) {
        columns = [
            {
                field: 'check',
                checkbox: true,
                selectItemName: 'check'
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'EMPNUM',
                title: '员工工号'
            }, {
                field: 'EMPNAME',
                title: '员工名称',
            }, {
                field: 'BELONGPOST',
                title: '所属岗位',
            }, {
                field: 'ORGNAME',
                title: '所属机构',
            },
            {
                field: 'BELONGLINE',
                title: '所属条线',
            },
            {
                field: 'TEAMLONG',
                title: '是否是团队长',
                clickToSelect: false,
                valign: "top",
                events: operateEvents,
                formatter: function (value, row, index) {
                    //var html = '<div class="radio"><input type="radio" name="TEAMLONG"/></div>';
                    var html = '<input type="radio" name="USER_TEAMLONG" id="userTeamlong" value="' + row.EMPNUM + '"/>';
                    return html;
                }

            }
        ];
        $('#userListTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + '/team/queryUserListOfAddWhenModifyByTeamId',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            height: 320,
            uniqueId: 'EMPNUM',
            onCheck: function (row, $element) {

                var empnum = row.EMPNUM;
                if (teamMemberSelectIdList.indexOf(empnum) < 0) {
                    teamMemberSelectIdList.push(empnum);
                }


            },
            onUncheck: function (row, $element) {

                var empnum = row.EMPNUM;
                if (teamMemberSelectIdList.indexOf(empnum) >= 0) {
                    teamMemberSelectIdList.splice(teamMemberSelectIdList.indexOf(empnum), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var empnum = rows[i].EMPNUM;
                        if (teamMemberSelectIdList.indexOf(empnum) < 0) {
                            teamMemberSelectIdList.push(empnum);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var empnum = rows[i].EMPNUM;
                        if (teamMemberSelectIdList.indexOf(empnum) >= 0) {
                            temUserMemberplice(teamMemberSelectIdList.indexOf(empnum), 1);
                        }
                    }
                }

            },
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'empNum': $('#empNum_memberList').val(),
                    'empName': $('#empName_memberList').val(),
                    'belongPostCd': $('#belongPostCd_memberList').val(),
                    'belongOrgId': $('#belongOrgId_memberList').val(),
                    'belongLine': $('#belongLine_memberList').val(),
                    'teamId': teamId
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 5,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns,
            onLoadSuccess: function (data) {

                $('#userListTable').bootstrapTable('checkBy', {
                    field: "EMPNUM",
                    values: teamMemberSelectIdList
                });
                $('#userListTable').bootstrapTable('resetView',{
                    height:getTableHeight(document)
                });
                /*var $input = $("input[id='userTeamlong'][value='" + teamMemberLong + "'][name='USER_TEAMLONG']");
                if (teamMemberLong != undefined && teamMemberLong != null && $input.length > 0) {
                    $input.prop("checked", "checked");
                }*/
                resizeTables();
            }
        });

    },
    orgListAddFactory: function () {

       var  orgColumns = [
            {
                field: 'check',
                checkbox: true,
                selectItemName: 'check'
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'ORGID',
                title: '机构ID'
                // visible: false
            },
            {
                field: 'ORGNUM',
                title: '机构编号'
            },
           {
                field: 'ORGNAME',
                title: '机构名称',
            },
            {
                field: 'SUPERORGNAME',
                title: '上级机构',
            } ,
            {
               field: 'TEAMLONG',
               title: '是否是团队长',
                visible: false,
               formatter: function (value, row, index) {
                   var html = '3';
                  // html = '<input type="radio" name="ORG_TEAMLONG_BESELECTED" id="orgTeamlongBeSelected" value="' + row.ORGID + '"/>';
                   return html;
               }
           }
        ];

        $('#orgListTable').bootstrapTable('destroy').bootstrapTable({
            url: portal.bp() + './json/team//selectOrgList.json',
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            height: 320,
            uniqueId: 'ORGNUM',
            onCheck: function (row, $element) {

                if (teamMemberSelectIdList.indexOf(row.ORGID) < 0 && teamMemberSelectList.indexOf(row) <0) {
                    teamMemberSelectIdList.push(row.ORGID);
                    teamMemberSelectList.push(row);

                }

            },
            onUncheck: function (row, $element) {


                if (teamMemberSelectIdList.indexOf(row.ORGID) >= 0 && teamMemberSelectList.indexOf(row) >=0) {
                    teamMemberSelectIdList.splice(teamMemberSelectIdList.indexOf(row.ORGID), 1);
                    teamMemberSelectList.splice(teamMemberSelectList.indexOf(row), 1);
                }
            },
            onCheckAll: function (rows) {

                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {

                        if (teamMemberSelectIdList.indexOf(rows[i]['ORGID']) < 0
                             && teamMemberSelectList.indexOf(rows[i]) < 0) {

                            teamMemberSelectIdList.push(rows[i]['ORGID']);
                            teamMemberSelectList.push(rows[i]);
                        }
                    }
                }

            },
            onUncheckAll: function (rows) {
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        if (teamMemberSelectIdList.indexOf(rows[i]['ORGID']) >= 0
                            && teamMemberSelectList.indexOf(rows[i]) >=0 ) {
                            teamMemberSelectIdList.splice(teamMemberSelectIdList.indexOf(rows[i]['ORGID']), 1);
                            teamMemberSelectList.splice(teamMemberSelectList.indexOf(rows[i]),1);
                        }
                    }
                }

            },
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'superOrgId': $('#belongOrgId_orgInfoAdd').val()
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            uniqueId: "ORGID",      //每一行的唯一标识，一般为主键列
            columns: orgColumns,
            onLoadSuccess: function (data) {
            $('#orgListTable').bootstrapTable('checkBy', {
                field: "ORGID",
                values: teamMemberSelectIdList
            });
            $('#orgListTable').bootstrapTable('resetView',{
                height:getTableHeight(document)
            });
            resizeTables();
        }
        });

    },
    orgListBeSelectedFactory: function (teamType,teamId,relaStatus,oprIndex) {
        var url=portal.bp() + '/team/selectTeamMember';
        if(oprIndex=='1'){
            url = '';
        }
        var  orgColumns = [
            {
                field: 'check',
                checkbox: true,
                selectItemName: 'check'
            },
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'ORGID',
                title: '机构ID'
                // visible: false
            },
            {
                field: 'ORGNUM',
                title: '机构编号'
            }, {
                field: 'ORGNAME',
                title: '机构名称',
            }, {
                field: 'SUPERORGNAME',
                title: '上级机构',
            },
            {
                field: 'TEAMLONG',
                title: '是否是团队长',
                clickToSelect: false,
                valign: "top",
                events: operateEvents,
                formatter: function (value, row, index) {

                    var html = '';
                    if(oprIndex=='1'){
                        if(row["ORGID"] == teamMemberLong){
                            html = '<input type="radio" name="ORG_TEAMLONG_BESELECTED" checked="checked" id="orgTeamlongBeSelected" value="' + row.ORGID + '"/>';
                        }else {
                            html = '<input type="radio" name="ORG_TEAMLONG_BESELECTED" id="orgTeamlongBeSelected" value="' + row.ORGID + '"/>';
                        }
                        return html;
                    }
                    if(row["TEAMLONG"]=='1'){
                        html = '<input type="radio" name="ORG_TEAMLONG_BESELECTED" checked="checked" id="orgTeamlongBeSelected" value="' + row.ORGID + '"/>';
                        teamMemberLong = row.ORGID;
                    }else{
                        html = '<input type="radio" name="ORG_TEAMLONG_BESELECTED" id="orgTeamlongBeSelected" value="' + row.ORGID + '"/>';
                    }
                    return html;
                }
            }
        ];

        $('#orgListBeSelectedTable').bootstrapTable('destroy').bootstrapTable({
            url: url,
            method: 'post',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: false,     //是否显示分页（*）
            sortStable: false,      //是否启用排序
            height: 320,
            singleSelect: false,    //是否单选，true时没有全选按钮
            "queryParamsType": "limit",
            contentType: "application/x-www-form-urlencoded",
            queryParams: function (params) {
                return {
                    'teamType': teamType,
                    'relaStatus':relaStatus,
                    'teamId': teamId

                };
            },
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            //height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    teamMemberRowList=JSON.parse(JSON.stringify(res.data));
                    teamMemberSelectList=JSON.parse(JSON.stringify(res.data));
                    teamMemberSelectIdList=[]
                    $.each(res.data,function (index, value) {
                        if(teamMemberSelectIdList.indexOf(value['ORGID'])<0){
                            teamMemberSelectIdList.push(value['ORGID']);
                        }

                    })
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            uniqueId: "ORGID",      //每一行的唯一标识，一般为主键列
            columns: orgColumns
        });

    },
    saveConfirm: function (teamIds, teamTypeCd) {
        var column = '';
        if('02'==teamTypeCd){
            column = [
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'ORGID',
                    title: '机构编号'
                }, {
                    field: 'ORGNAME',
                    title: '机构名称',
                }, {
                    field: 'SUPERORGNAME',
                    title: '上级机构',
                },
                {
                    field: 'TEAMLONG',
                    title: '是否是团队长',
                    formatter: function (value, row, index) {
                        if (row.TEAMLONG != undefined
                            && row.TEAMLONG != null
                            && row.TEAMLONG == 1) {
                            return '是';

                        }
                        return '否';
                    }
                }
            ]
        }else {
            column = [
                {
                    field: 'Number',
                    title: '序号',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    field: 'EMPID',
                    title: '成员编号'
                }, {
                    field: 'EMPNAME',
                    title: '成员名称',
                }, {
                    field: 'ORGNAME',
                    title: '所属机构',
                },
                {
                    field: 'TEAMLONG',
                    title: '是否是团队长',
                    formatter: function (value, row, index) {
                        if (row.TEAMLONG != undefined
                            && row.TEAMLONG != null
                            && row.TEAMLONG == 1) {
                            return '是';
                        }
                        return '否';
                    }
                }
            ]
        }



        if (teamTypeCd == undefined
            || teamTypeCd == null) {
            return;
        }

        $('#saveSuccessTable').bootstrapTable({
            url: portal.bp() + '/team/findMemebrByTeamId',
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
                return {
                    'pageSize': params.limit,
                    'pageNum': (params.offset / params.limit) + 1,
                    'teamId': teamIds[0],
                    'teamTypeCd': teamTypeCd
                };
            },
            sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1,      //初始化加载第一页，默认第一页
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
            height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: column
        });
    },
    showApproveDetailTable: function () {
        var columns = [];
        //操作列是否展示

        columns = [
			{
			    field: 'check',
			    checkbox: true
			},
            {
                field: 'Number',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'teamId',
                title: '团队编号',
            }, {
                field: 'teamName',
                title: '团队名称',
                clickToSelect: false,
                formatter: teamDetailLink,
            }, {
                field: 'effDt',
                title: '生效日期',
            }, {
                field: 'invalidDt',
                title: '失效日期'

            },
            {
                field: 'teamType',
                title: '团队类型',
            },
            {
                field: 'teamChar',
                title: '团队性质',
            },
            {
                field: 'belongLineDesc',
                title: '所属条线',
            },
            {
            	field: '',
            	title: '状态',
            	formatter: function (value, row, index) {
            		var res = '';
            		if(row.validTag == '1' && row.startEndFlag!=undefined&&row.startEndFlag!=null&&row.startEndFlag=='1'){
            			//第一节点
            			if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='0'){
            				//退回到第一节点
            				res = '审批拒绝';
            			}else if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='2'){
            				//已撤回
            				res = '已撤回';
            			}
            		}else if (row.validTag == '1' && row.startEndFlag!=undefined&&row.startEndFlag!=null&&row.startEndFlag=='0'){
            			//最后节点
            			res = '审批通过';
            		}else if(row.validTag != '1'){
                        res = '已删除';
                    }
            		else{
            			//中间节点
            			if(row.roleName!=undefined&&row.roleName!=null){
            				res = '待'+row.roleName+'审批';
            			}else{
            				res = '待审批';
            			}
            		}
            		return res;
                }
            },
            {
                field: '',
                title: '备注',
                formatter: function (value, row, index) {
                	if(row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='0'){
                		return row.dealComntDesc;
                	}
                }
            },
            {
                field: 'opeType',
                title: '操作类型',
                formatter: function (value, row, index) {

                    return $.param.getDisplay('OPETYPE', value);
                }
            },
            {
                field: '',
                title: '操作',
                formatter: function (value, row, index) {
                	var html = '';
            		if(row.isInitPersion=='1'&&row.validTag=='1'){
            			//是任务发起人、有效
            			if((row.opeType=='1'||row.opeType=='2') && row.startEndFlag=='1'){
            				//新增或修改、审批流程到第一节点
            				html += '<span class="oper-mid" ></span><a id="btn_edit" onclick="editDummy(\'' + row.opeType + '\',\'' + row.pkId + '\',\'' + row.teamId + '\',\'' + row.teamTypeCd + '\');" class="oper-left" ><b>编辑</b></a>';
            				html += '<span class="oper-mid" ></span><a id="btn_edit" onclick="approvalByPkId(\'' + row.pkId + '\');" class="oper-right" ><b>发起审核</b></a>';
            			}
            			if(row.startEndFlag=='1'){
            				//开始节点，可删除
            				html += '<span class="oper-mid" ></span><a id="btn_sp_del" onclick="delMgmt(\''+row.pkId+'\');" class="oper-left" ><b>删除</b></a>';
            			}
            			if(row.initpersionisgoback=='1'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
            				//非结束节点、任务发起人，可撤回
            				html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="userworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
            			}
            		}
            		if(row.initpersionisgoback=='0'&&(row.startEndFlag==undefined||row.startEndFlag==null||row.startEndFlag!='0')){
            			//非结束节点
            			if(row.isProcerPersion=='1'&&row.arriveNodeTheCheckStatus!=undefined&&row.arriveNodeTheCheckStatus!=null&&row.arriveNodeTheCheckStatus=='1'){
            				//是最新处理人、到达该节点是通过，可撤回
            				html += '<span class="oper-mid" ></span><a id="btn_sp_goback" onclick="userworkflowGoback(\''+row.pkId+'\');" class="oper-left" ><b>撤回</b></a>';
            			}
            		}
            		return html;

                    /*if (row.validTag == '1' && (row.opeType == '1' || row.opeType == '2') && row.startEndFlag == '1') {
                        //有效、新增或修改、审批流程到第一节点
                        return '<a id="btn_edit" onclick="editDummy(\'' + row.opeType + '\',\'' + row.pkId + '\',\'' + row.teamId + '\',\'' + row.teamTypeCd + '\');" class="oper-left" ><b>编辑</b></a>'
                            + "  " + '<a id="btn_edit" onclick="approvalByPkId(\'' + row.pkId + '\');" class="oper-right" ><b>发起审核</b></a>';
                    }*/
                }
            },
        ]

        $('#approvetable').bootstrapTable({
            url: portal.bp() + './json/team/ownWorkflowList.json',
            method: 'POST',      //请求方式（*）
            striped: true,      //是否显示行间隔色
            cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,     //是否显示分页（*）
            sortStable: true,      //是否启用排序
            sortOrder: "desc",     //排序方式
            singleSelect: true,    //是否单选，true时没有全选按钮
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
            pageSize: 10,      //每页的记录行数（*）
            pageList: [5, 10, 25],  //可供选择的每页的行数（*）
            clickToSelect: true,    //是否启用点击选中行
            resizable: true,			//是否可调整列宽度
           //height:getTableHeight(document), //表格固定高度
            responseHandler: function (res) { //服务端返回数据
                if (res.code == '200') {
                    return res.data;
                } else {
                    layer.msg(res.message, {icon: 2});
                    return {};
                }
            },
            //uniqueId: "empNum",      //每一行的唯一标识，一般为主键列
            columns: columns
        });
    },

};
//第一节点编辑
function editDummy(opetype, pkId, teamId, teamTypeCd) {
    initValue();
    $('#showApproveModal').modal('hide');
    var data=undefined;
    if (teamId == undefined || teamId == null) {
        layer.msg("未获取到团队编号", {icon: 2});
        return;
    }
    //根据teamId查询到基本信息
    $.ajax({
            url: portal.bp() + '/team/findTeamBasicInfoMgmtOnEditableByTeamId',
            type: 'post',
            async: false,
            data: {
                'teamId': teamId
            },
            success: function (res) {

                if (res.code !='200' || res.data == undefined || res.data == null) {
                    layer.msg("获取已保存的信息失败", {icon: 2});
                }else{
                    data = res.data;
                }
            }/*,
            beforeSend:function(XMLHttpRequest){
                layerLoad();
            },
            complete:function(XMLHttpRequest){
                var index = layer.index;
                layerClose(index);
            }*/
        }
    );
    if (opetype == '1') {
        teamProcessType = 3;
        teamStep = 1;
        edit_PkId = data.pkId;
        teamBasicInfo_edit = JSON.parse(JSON.stringify(data));
        $('#myModalLabel').text('团队修改');
        $("#teamTypeCd_Add").selectpicker('val', teamBasicInfo_edit.teamTypeCd).selectpicker('refresh');
        $("#belongOrg_Add").selectpicker('val', teamBasicInfo_edit.belongOrg).selectpicker('refresh');
        $("#teamCharCd_add").selectpicker('val', teamBasicInfo_edit.teamCharCd).selectpicker('refresh');
        $("#belongLine").selectpicker('val', teamBasicInfo_edit.belongLine).selectpicker('refresh');
        $("#teamDesc_Add").val(teamBasicInfo_edit.teamDesc);
        $('#add_Modal').modal('show');
        return;
    }
        teamProcessType = 4;
        teamStep = 1;
        teamIdTmp=teamId;

        if (pkId == null || pkId == undefined) {
            layer.msg("未获取到团队编号", {icon: 2});
            return;
        }
    teamBasicInfo_Add = JSON.parse(JSON.stringify(data));
    teamBasicInfo_edit= JSON.parse(JSON.stringify(data));

    if(teamBasicInfo_Add['teamTypeCd']=='01'){
        //个人团队
        userListAdd('01',teamId,'0','0','1');
        $('#userList_back').attr('style','display:none');
    }else{
        //机构团队
        orgListAdd('02', teamId, '0', '0','1');
        $('#orgMemberback').attr('style','display:none');
    }

}

//添加团队详情
function teamDetailLink(value, row, index) {
    var pkId = row.pkId;
    var teamTypeCd = row.teamTypeCd;
    var teamId = row.teamId;
    var validTag = row.validTag;
    var operType = row.operType;

    var htmltext = '<a id="toTeamDetail class="oper-left"  onclick="teamDetailaClick(' + '\'' + pkId + '\',\'' + teamTypeCd + '\',\'' + teamId + '\',\'' + validTag + '\',\'' + operType + '\')"><b>'+row.teamName+'</b></a>'

    return htmltext;

}


function teamDetailaClick(pkId, teamTypeCd, teamId, validTag, operType) {
    $('#teamMember').modal("show");
    TableObj.teamMemberTableFactory(pkId, teamTypeCd, teamId, validTag, operType);
};

function initValue() {
    teamBasicInfo_Add = undefined;
    teamBasicInfo_edit = undefined;
    teamMemberSelectIdList = [];
    teamMemberSelectList = [];
    teamMemberLong = undefined;
    edit_PkId = undefined;
    teamBasicInfo_Add_tmp = undefined;
    teamIdTmp = undefined;
    //teamProcessType = undefined;
    teamStep = undefined;
    teamEditUrl =undefined;
    teamMemberRowList = [];


}

//查询
function query() {
    checkKey = [];
    teamId = $('#teamId').val();
    teamName = $('#teamName').val();
    teamTypeCd = $('#teamTypeCd').val();
    teamCharCd = $('#teamCharCd').val();
    belongOrg = $('#belongOrg').val();
    TableObj.oTableInit();
}

function query_memberList() {
    $('#userListTable').bootstrapTable('destroy');
    TableObj.userListAddFactory();
}

function query_memberListEdit() {
    $('#userListEditTable').bootstrapTable('destroy');
    TableObj.userListAddWhenEditNoInsert(teamIdTmp);
}

//新增团队机构成员查询
function query_orgList() {
    $('#orgListTable').bootstrapTable('refresh');

}

function query_orgListEdit() {
    $('#orgListEditTable').bootstrapTable('destroy');
    TableObj.orgListAddWhenEditNoInsert(teamIdTmp,teamEditUrl);
}

//新增团队机构成员重置
function resetForm_orgList() {
    $('#orgInfoAdd_formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $('#belongOrgId_orgInfoAdd').selectpicker('refresh');
}

//重置
function resetForm() {
    $('#formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $('#teamTypeCd').selectpicker('refresh');
    $('#teamCharCd').selectpicker('refresh');
    $('#belongOrg').selectpicker('refresh');
}

//重置
function resetForm_memberList() {
    $('#userInfoAdd_formSearch')[0].reset();
    $('input,textarea').placeholder(); //防止IE8没有placleholder
    $('#belongOrgId_memberList').selectpicker('refresh');
    $('#belongPostCd_memberList').selectpicker('refresh');
    $('#belongLine_memberList').selectpicker('refresh');
}

function addModalValidator() {
    //表单校验
    $("#formAdd").bootstrapValidator({
        live: ['submitted'],
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            teamTypeCd_Add: {
                validators: {
                    notEmpty: {
                        message: "团队类型不能为空"
                    }
                }
            },
            belongOrg_Add: {
                validators: {
                    notEmpty: {
                        message: "所属机构不能为空"
                    }
                }
            },
            teamCharCd_add: {
                validators: {
                    notEmpty: {
                        message: "团队性质不能为空"
                    }
                }
            },
            teamDesc_Add: {
                validators: {
                    stringLength: {
                        max: 100,
                        message: "团队描述不能超过100个字"
                    }
                }
            },
            belongLine: {
                validators: {
                    notEmpty: {
                        message: "所属条线不能为空"
                    }
                }
            }
        }
    });
}

// getOrgList_OrgMemeberAdd('belongOrgId_orgInfoAdd');
//添加机构成员页面获得的机构列表，用户所在分行下的所有管辖行和分行，不包括虚拟机构
function getOrgList_OrgMemeberAdd(item) {
    $.ajax({
        url: portal.bp() + '/org/OrgForGroupOfOrgMember',
        type: "get",
        cache: false,
        success: function (data) {
            var html = undefined;
            var list = data.data;
            $.each(list, function (key, value) {
                html += '<optgroup label="' + key + '">';
                $.each(value, function (index, item) {
                    html += '<option value="' + item.orgId + '">' + item.orgName + '</option>';
                })
                html += '</optgroup>';
            });

            $('#' + item).html(html);
            $('#' + item).selectpicker('refresh');
            /* $('#belongOrg').html(html);
             $('#belongOrg').selectpicker('refresh');*/
        }
    });
}

function showApproveDetail() {
    $('#approvetable').bootstrapTable('destroy')
    TableObj.showApproveDetailTable();
    $("#showApproveModal").modal("show");
}

//根据pkid提交审批
function approvalByPkId(pkId) {


    if (pkId == null
        || pkId == undefined) {
        layer.msg('提交审批失败', {icon: 2});
    }
    var array = new Array();
    array.push(pkId);
    $.ajax({
        url: portal.bp() + '/team/workflowPass',
        type: "post",
        cache: false,
        data: {
            pkIdList: array
        },
        success: function (data) {

            teamBasicInfo_Add = undefined;
            teamBasicInfo_edit = undefined;
            teamMemberSelectIdList = [];
            teamMemberLong = undefined;
            edit_PkId = undefined;
            teamBasicInfo_Add_tmp = undefined;
            if (data.code == '200') {
                $('#save_confirm_modal').modal('hide');
                layer.msg('提交审核成功', {icon: 1})

            } else {
                $('#save_confirm_modal').modal('hide');
                layer.msg(data.message, {icon: 2})
            }

            $('#approvetable').bootstrapTable('refresh');

        }
    });

};
//初始化机构选择列表
function getOrgList() {
    var html;
    $.ajax({
        url: portal.bp() + './json/org/getAuthOrgForGroup.json',
        type: "get",
        data:{'menuId':'4310'},
        cache: false,
        dataType:'json',
        async: false,
        success: function (data) {
            var list = data.data;
            $.each(list,function(key,value){
                html += '<optgroup label="'+key+'">';
                $.each(value,function(index,item){
                    html += '<option value="'+item.orgId+'">'+item.orgName+'</option>';
                })
                html += '</optgroup>';
            });
        }
    });
    return html;
};
function getAuthLine() {
    var html = "";
    $.ajax({
        url: '../json/team/getAuthLine.json'+'?r='+Math.random(),
        type: 'get',
        async: false,
        dataType: "json"
    }).done(function (data) {
        if (data.code == '200') {
            var col = data.data;
            $.each(col, function (index, item) {
                html += "<option value='" + item.ENCODE + "'>" + item.NAME + "</option>"
            });
        }
    });
    return html;
};
function userListAdd(teamType,teamId,relaStatus,oprIndex,title) {
    $('#userInfoAdd_modal').modal('show');
    if(title=='' || title == undefined){
        $('#userInfoAdd_Modal_Label').text('选择员工团队成员');
    }else {
        $('#userInfoAdd_Modal_Label').text('编辑员工团队成员');
    }
    //获取机构列表
    $("#belongOrgId_memberList").html("").append(orgListHtml);
    $("#belongOrgId_memberList").selectpicker('refresh');
    //获取岗位列表
    $("#belongPostCd_memberList").html("").append(post);
    $('#belongPostCd_memberList').selectpicker('refresh');
    //获取条线列表
    $("#belongLine_memberList").html("").append(line);
    $('#belongLine_memberList').selectpicker('refresh');
    TableObj.userListSelectFactory(teamType, teamId, relaStatus,oprIndex);
    TableObj.userListAddFactory();
};
function orgListAdd(teamType,teamId,relaStatus,oprIndex,title) {
    //机构团队
    $('#orgInfoAdd_modal').modal('show');
    if(title=='' || title == undefined){
        $('#orgInfoAdd_modal_Label').text('选择机构团队成员');
    }else {
        $('#orgInfoAdd_modal_Label').text('编辑机构团队成员');
    }
    $("#belongOrgId_orgInfoAdd").html("").append(orgListHtml);
    $("#belongOrgId_orgInfoAdd").selectpicker('refresh');
    TableObj.orgListBeSelectedFactory(teamType,teamId,relaStatus,oprIndex);
    TableObj.orgListAddFactory();
};
function getObJIndex(array, key, valueObj) {
    var indexKey=-1;
    $.each(array,function (index, value) {
        if(value[key]==valueObj){
            indexKey=index;
            return;
        }

    })

    return indexKey;
}

