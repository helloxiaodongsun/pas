(function($) {
	document.defaultView = window;
	document.documentElement.focus();
	//table高度固定
	/*$(document).on("post-body.bs.table","table",function(data){
		$(this).parent().parent().addClass("tableBody");
	});*/
	if(!document.defaultView.getComputedStyle){
		document.defaultView.getComputedStyle = function (el, pseudo) {
			return el.currentStyle;
		};
	}
})(jQuery);