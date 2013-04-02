/* Config parameters set in require-config.js. */

require(['backbone',
         'apps/br-author-app2',
         'apps/rand-quot-app',
         'utils/globals',
         'utils/nav-dropdown',
         'apps/copyright-app'],
         
	function (Backbone, BrAuthorApp, RandQuotApp, globals, navDropdown, cr) {
		var globals = globals.getGlobals();
		var app = globals.app = new BrAuthorApp();
		navDropdown();
		RandQuotApp();
		cr();
	}	
);