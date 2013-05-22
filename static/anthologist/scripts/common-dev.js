// Generated by CoffeeScript 1.6.1

requirejs.config({
  baseUrl: "/static/anthologist/scripts",
  paths: {
    jquery: "lib/jquery",
    underscore: "lib/underscore",
    backbone: "lib/backbone",
    typeahead: "lib/typeahead",
    jade: "lib/jade-runtime"
  },
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    typeahead: {
      deps: ["jquery"],
      exports: "typeahead"
    },
    jade: {
      exports: "jade"
    }
  }
});

require(['base-main']);
