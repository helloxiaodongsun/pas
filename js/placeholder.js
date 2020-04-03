;(function($){
  $.fn.placeholder = function(options){
    options = $.extend({
      placeholderColor:'#999',
      isSpan:true, //是否使用插入span标签模拟placeholder的方式，默认是需要
      onInput:true //实时监听输入框
    },options);

     return this.each(function(){
      var _this = this;
      var supportPlaceholder = 'placeholder' in document.createElement('input');
      if(!supportPlaceholder){
        //不支持placeholder属性的操作
        var defaultValue = $(_this).attr('placeholder');
        if(defaultValue!=undefined&&defaultValue!=null){
        	var defaultColor = $(_this).css('color');
        	if(!options.isSpan){
        		$(_this).focus(function () {
        			var pattern = new RegExp("^" + defaultValue + "$|^$");
        			pattern.test($(_this).val()) && $(_this).val('').css('color', defaultColor);
        		}).blur(function () {
        			if($(_this).val() == defaultValue) {
        				$(_this).css('color', defaultColor);
        			}
        			else if($(_this).val().length == 0) {
        				$(_this).val(defaultValue).css('color', options.placeholderColor)
        			}
        		}).trigger('blur');
        	}else{
        		var $simulationSpan = $('<span class="wrap-placeholder">'+defaultValue+'</span>');
        		$simulationSpan.css({
        			'position':'absolute',
        			'display':'inline-block',
        			'overflow':'hidden',
        			'width':$(_this).outerWidth(),
        			'height':$(_this).outerHeight(),
        			'color':options.placeholderColor,
        			'margin-left':$(_this).css('margin-left'),
        			'margin-top':$(_this).css('margin-top'),
        			'padding-left':parseInt($(_this).css('padding-left')) + 2 + 'px',
        			'padding-top':_this.nodeName.toLowerCase() == 'textarea' ? parseInt($(_this).css('padding-top')) + 2 : 0,
        					'line-height':_this.nodeName.toLowerCase() == 'textarea' ? $(_this).css('line-weight') : $(_this).outerHeight() + 'px',
        							'font-size':$(_this).css('font-size'),
        							'font-family':$(_this).css('font-family'),
        							'font-weight':$(_this).css('font-weight')
        		});
        		
        		//通过before把当前$simulationSpan添加到$(_this)前面，并让$(_this)聚焦
        		$(_this).before($simulationSpan.click(function () {
        			$(_this).trigger('focus');
        		}));
        		
        		//当前输入框聚焦文本内容不为空时，模拟span隐藏
        		$(_this).val().length != 0 && $simulationSpan.hide();
        		
        		if (options.onInput) {
        			//绑定oninput/onpropertychange事件
        			var inputChangeEvent = typeof(_this.oninput) == 'object' ? 'input' : 'propertychange';
        			$(_this).bind(inputChangeEvent, function () {
        				$simulationSpan[0].style.display = $(_this).val().length != 0 ? 'none' : 'inline-block';
        			});
        		}else {
        			$(_this).focus(function () {
        				$simulationSpan.hide();
        			}).blur(function () {
        				/^$/.test($(_this).val()) && $simulationSpan.show();
        			});
        		};
        	}
        }
      }
    });
  }
})(jQuery);