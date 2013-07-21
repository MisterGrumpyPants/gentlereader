define(['jquery', 'apps/search-app', 'lib/fastclick'], function($, searchApp, FastClick) {
  var BaseApp;
  BaseApp = function() {
    var $browseBtn, $browseCont, $copyCont, $getCopy, $homeSearch, $searchBtn, $searchCont, menuToggle;
    $(function() {
      return FastClick.attach(document.body);
    });
    $homeSearch = $("#homeSearch");
    $homeSearch.bind("touchstart", function(e) {
      return e.stopPropagation;
    });
    $homeSearch.bind("touchend", function(e) {
      e.stopPropagation;
      return $(e.target).trigger("focus");
    });
    $searchBtn = $(".nav-search");
    $searchCont = $(".nav-search--container");
    $browseBtn = $(".nav-browse, .subnav-browse--close");
    $browseCont = $(".subnav-browse--container");
    menuToggle = function($desired, $other) {
      return $desired.slideToggle("fast", function() {
        $(document).off("click");
        if ($desired.css("display") === "block") {
          $other.slideUp();
          $desired.click(function(e) {
            return e.stopPropagation();
          });
          $(document).one("click", function(e) {
            return $desired.slideToggle("fast");
          });
        }
        return $(".search-form").find("input[type='search']").focus();
      });
    };
    $browseBtn.click(function(e) {
      e.stopPropagation();
      return menuToggle($browseCont, $searchCont);
    });
    $searchBtn.click(function(e) {
      e.stopPropagation();
      return menuToggle($searchCont, $browseCont);
    });
    $("#toTop").click(function() {
      return $("html, body").animate({
        scrollTop: 0
      });
    });
    $getCopy = $(".get-copyright-info");
    $copyCont = $(".footer-copyright");
    $getCopy.click(function(e) {
      e.preventDefault();
      return $copyCont.slideToggle("fast", function() {
        if ($copyCont.css("display") === "block") {
          return $("html, body").animate({
            scrollTop: $copyCont.offset().top
          });
        }
      });
    });
    return searchApp.initialize();
  };
  return BaseApp;
});
