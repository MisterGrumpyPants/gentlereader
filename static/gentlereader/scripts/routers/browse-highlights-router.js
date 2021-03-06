define(["backbone", "utils/globals"], function(Backbone, globals) {
  var BrowseHighlightsRouter;
  globals = globals.getGlobals();
  BrowseHighlightsRouter = Backbone.Router.extend({
    initialize: function() {
      return Backbone.history.start({
        silent: true
      });
    },
    routes: {
      ":author": "selectAuthor",
      "": "getRandom"
    },
    selectAuthor: function(author) {
      return globals.app.getHighlights(author);
    },
    getRandom: function() {
      return globals.app.getRandom();
    }
  });
  return BrowseHighlightsRouter;
});
