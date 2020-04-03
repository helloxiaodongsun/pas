var columns_m,columns_q,columns_y;
$(function(){
	if(professionType!=null&&professionType=="ZT"){
		//整体打分
		if(charCnfgFlg=='1'){
	    	//特色化考核方案
	    	columns_m = [
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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '一月',
	                 field: 'indexM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '二月',
	                 field: 'indexM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '三月',
	                 field: 'indexM3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '四月',
	                 field: 'indexM4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '五月',
	                 field: 'indexM5Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '六月',
	                 field: 'indexM6Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '七月',
	                 field: 'indexM7Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '八月',
	                 field: 'indexM8Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '九月',
	                 field: 'indexM9Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十月',
	                 field: 'indexM10Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十一月',
	                 field: 'indexM11Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十二月',
	                 field: 'indexM12Str',
	                 align: "center",
	                 valign: "middle",
	             },
	         ];

	         columns_q = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度1',
	                 field: 'indexDecProgQ1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度2',
	                 field: 'indexDecProgQ2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度3',
	                 field: 'indexDecProgQ3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度4',
	                 field: 'indexDecProgQ4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度1',
	                 field: 'indexDecProgM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度2',
	                 field: 'indexDecProgM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度3',
	                 field: 'indexDecProgM3Str',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];

	         columns_y = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];
	    }else{
	    	columns_m = [
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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务必保权重(%)',
	                 field: 'neguIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务必保权重(%)',
	            	 field: 'neguIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务必保权重(%)',
	            	 field: 'neguIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务必保权重(%)',
	            	 field: 'neguIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务力争权重(%)',
	                 field: 'whfIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务力争权重(%)',
	            	 field: 'whfIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务力争权重(%)',
	            	 field: 'whfIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务力争权重(%)',
	            	 field: 'whfIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	                 title: '一月',
	                 field: 'indexM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '二月',
	                 field: 'indexM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '三月',
	                 field: 'indexM3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '四月',
	                 field: 'indexM4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '五月',
	                 field: 'indexM5Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '六月',
	                 field: 'indexM6Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '七月',
	                 field: 'indexM7Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '八月',
	                 field: 'indexM8Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '九月',
	                 field: 'indexM9Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十月',
	                 field: 'indexM10Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十一月',
	                 field: 'indexM11Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十二月',
	                 field: 'indexM12Str',
	                 align: "center",
	                 valign: "middle",
	             },
	         ];

	         columns_q = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务必保权重(%)',
	                 field: 'neguIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务必保权重(%)',
	            	 field: 'neguIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务必保权重(%)',
	            	 field: 'neguIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务必保权重(%)',
	            	 field: 'neguIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务力争权重(%)',
	                 field: 'whfIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务力争权重(%)',
	            	 field: 'whfIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务力争权重(%)',
	            	 field: 'whfIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务力争权重(%)',
	            	 field: 'whfIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度1',
	                 field: 'indexDecProgQ1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度2',
	                 field: 'indexDecProgQ2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度3',
	                 field: 'indexDecProgQ3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度4',
	                 field: 'indexDecProgQ4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度1',
	                 field: 'indexDecProgM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度2',
	                 field: 'indexDecProgM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度3',
	                 field: 'indexDecProgM3Str',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];

	         columns_y = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务必保权重(%)',
	                 field: 'neguIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务必保权重(%)',
	            	 field: 'neguIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务必保权重(%)',
	            	 field: 'neguIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务必保权重(%)',
	            	 field: 'neguIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '整体业务力争权重(%)',
	                 field: 'whfIndexWeiZT',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	            	 title: '公司业务力争权重(%)',
	            	 field: 'whfIndexWeiGS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '零售业务力争权重(%)',
	            	 field: 'whfIndexWeiLS',
	            	 align: "center",
	            	 valign: "middle",
	             },
	             {
	            	 title: '市场业务力争权重(%)',
	            	 field: 'whfIndexWeiSC',
	            	 align: "center",
	            	 valign: "middle",
	             },
	         ];
	    }
	    
	}else{
		//非整体打分
		if(charCnfgFlg=='1'){
	    	//特色化考核方案
	    	columns_m = [
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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '一月',
	                 field: 'indexM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '二月',
	                 field: 'indexM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '三月',
	                 field: 'indexM3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '四月',
	                 field: 'indexM4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '五月',
	                 field: 'indexM5Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '六月',
	                 field: 'indexM6Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '七月',
	                 field: 'indexM7Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '八月',
	                 field: 'indexM8Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '九月',
	                 field: 'indexM9Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十月',
	                 field: 'indexM10Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十一月',
	                 field: 'indexM11Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十二月',
	                 field: 'indexM12Str',
	                 align: "center",
	                 valign: "middle",
	             },
	         ];

	         columns_q = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度1',
	                 field: 'indexDecProgQ1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度2',
	                 field: 'indexDecProgQ2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度3',
	                 field: 'indexDecProgQ3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度4',
	                 field: 'indexDecProgQ4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度1',
	                 field: 'indexDecProgM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度2',
	                 field: 'indexDecProgM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度3',
	                 field: 'indexDecProgM3Str',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];

	         columns_y = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];
	    }else{
	    	columns_m = [
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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标权重(%)',
	                 field: 'neguIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标权重(%)',
	                 field: 'whfIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '一月',
	                 field: 'indexM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '二月',
	                 field: 'indexM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '三月',
	                 field: 'indexM3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '四月',
	                 field: 'indexM4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '五月',
	                 field: 'indexM5Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '六月',
	                 field: 'indexM6Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '七月',
	                 field: 'indexM7Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '八月',
	                 field: 'indexM8Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '九月',
	                 field: 'indexM9Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十月',
	                 field: 'indexM10Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十一月',
	                 field: 'indexM11Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '十二月',
	                 field: 'indexM12Str',
	                 align: "center",
	                 valign: "middle",
	             },
	         ];

	         columns_q = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标权重(%)',
	                 field: 'neguIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标权重(%)',
	                 field: 'whfIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度1',
	                 field: 'indexDecProgQ1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度2',
	                 field: 'indexDecProgQ2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度3',
	                 field: 'indexDecProgQ3Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度季度4',
	                 field: 'indexDecProgQ4Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度1',
	                 field: 'indexDecProgM1Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度2',
	                 field: 'indexDecProgM2Str',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标分解进度月度3',
	                 field: 'indexDecProgM3Str',
	                 align: "center",
	                 valign: "middle",
	             }
	         ];

	         columns_y = [

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
	                 title: '指标名称',
	                 field: 'indexName',
	                 clickToSelect: false,
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标类别',
	                 field: 'assIndexCateDesc',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '指标单位',
	                 field: 'assIndexUnit',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '考核指标定位',
	                 align: "center",
	                 field: 'assIndexOrientCd',
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0011', value);
	                 }
	             },
	             {
	                 title: '业绩统计口径',
	                 field: 'perStatCaliCd',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0009', value);
	                 }
	             },
	             {
	                 title: '得分计算规则',
	                 field: 'scoreCalcRule',
	                 align: "center",
	                 valign: "middle",
	                 formatter: function (value, row, index) {
	                     return $.param.getDisplay('TB0012', value);
	                 }
	             },
	             {
	                 title: '得分上限（倍）',
	                 field: 'scoreCeil',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标折算比例',
	                 field: 'neguConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '必保指标权重(%)',
	                 field: 'neguIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标折算比例',
	                 field: 'whfConvtRatio',
	                 align: "center",
	                 valign: "middle",
	             },
	             {
	                 title: '力争指标权重(%)',
	                 field: 'whfIndexWei',
	                 align: "center",
	                 valign: "middle",
	             },
	         ];
	    }
	    
	}
    
    
    table_m_query();
    table_q_query();
    table_y_query();
});


 //月度指标
 function table_m_query() {
     $("#datatable_m").bootstrapTable('destroy');
     $('#datatable_m').bootstrapTable({
         url: portal.bp() + '/assess/queryTable?r=' + Math.random(),
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
                 'assPropNum': assPropNum,
                 'isValidFlag':isValidFlag,
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
                 return res.data;
             } else {
                 layer.msg(res.message, {icon: 2});
                 return {};
             }
         },
         onLoadSuccess: function (data) {
        	 resizeTables();
         },
         columns: columns_m,

     });
 }
 //季度指标
 //月度指标
 function table_q_query() {
     $("#datatable_q").bootstrapTable('destroy');
     $('#datatable_q').bootstrapTable({
         url: portal.bp() + '/assess/queryTable?r=' + Math.random(),
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
                 'assPropNum': assPropNum,
                 'isValidFlag':isValidFlag,
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
                 return res.data;
             } else {
                 layer.msg(res.message, {icon: 2});
                 return {};
             }
         },
         onLoadSuccess: function (data) {
        	 resizeTables();
         },
         columns: columns_q,

     });
 }
 //年度指标
 function table_y_query() {
     $("#datatable_y").bootstrapTable('destroy');
     $('#datatable_y').bootstrapTable({
         url: portal.bp() + '/assess/queryTable?r=' + Math.random(),
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
                 'assPropNum': assPropNum,
                 'isValidFlag':isValidFlag,
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
                 return res.data;
             } else {
                 layer.msg(res.message, {icon: 2});
                 return {};
             }
         },
         onLoadSuccess: function (data) {
        	 resizeTables();
         },
         columns: columns_y,

     });
 }
