define(['jquery'], function ($) {
	var toggleCopyright = function () {
		$('.get-copyright-info').click(function () {
			$('#copyright-info').toggle();
			document.getElementById('copyright-info').scrollIntoView();
		});
	};
	return toggleCopyright;
});