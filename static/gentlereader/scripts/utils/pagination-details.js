define(function() {
  /* Define pagination parameters: return "startEndMods",
  an array of objects that define each page's start and
  end models and indices; and the pgCount. The function must
  be passed a Backbone Collection and an integer
  specifying the number of items per page.
  */

  var paginationDetails;
  paginationDetails = function(collection, itemsPerPage) {
    var addPage, colLength, i, models, pgCount, startEndModels, _i, _ref;
    models = collection.models;
    colLength = collection.length;
    pgCount = Math.ceil(colLength / itemsPerPage);
    startEndModels = [];
    addPage = function() {
      var colEnd, endIndex, startIndex;
      startIndex = i * itemsPerPage;
      endIndex = (i + 1) * itemsPerPage - 1;
      /* If the calculated endIndex will exceed the
      collection's length, replace it with the end of
      the colleciton.
      */

      colEnd = colLength - 1;
      if (colEnd < endIndex) {
        endIndex = colEnd;
      }
      return startEndModels[i] = {
        startIndex: startIndex,
        startModel: models[startIndex],
        endIndex: endIndex,
        endModel: models[endIndex]
      };
    };
    for (i = _i = 0, _ref = pgCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      addPage(i);
    }
    return {
      startEndModels: startEndModels,
      pgCount: pgCount
    };
  };
  return paginationDetails;
});
