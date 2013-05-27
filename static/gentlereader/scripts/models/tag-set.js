// Generated by CoffeeScript 1.6.1

define(['backbone', 'utils/ignore-articles'], function(Backbone, ignoreArticles) {
  var TagSet;
  TagSet = Backbone.Collection.extend({
    comparator: function(item) {
      var lastName, nm;
      lastName = item.get("last_name") || "";
      nm = lastName ? lastName : item.get("name");
      return ignoreArticles(nm.toLowerCase());
    }
  });
  return TagSet;
});