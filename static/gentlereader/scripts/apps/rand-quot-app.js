define(['backbone', 'models/rand-quot-set', 'views/rand-quot-view', 'lib/matchMedia', 'utils/isElementInViewport'], function(Backbone, RandQuotSet, RandQuotView, matchMedia, isElementInViewport) {
  var RandQuotApp, removeStyle;
  removeStyle = function() {
    var $a, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      $a = arguments[_i];
      _results.push($a.removeAttr("style"));
    }
    return _results;
  };
  RandQuotApp = Backbone.View.extend({
    initialize: function(options) {
      this["dom"] = {};
      this.dom.body = $(".rq-body");
      this.dom.back = $(".rq-backdrop");
      this.dom.cont = $(".rq-content");
      this["settings"] = {};
      this.settings.desktop = function() {
        if (matchMedia('screen and (min-width: 760px)').matches) {
          return true;
        } else {
          return false;
        }
      };
      this.settings.ipad = function() {
        if (matchMedia('only screen and (min-device-width : 768px) and (max-device-width : 1024px)').matches) {
          return true;
        } else {
          return false;
        }
      };
      if (options) {
        this.settings.home = options.home || false;
      }
      this.setClickEvents();
      return this.getQuot();
    },
    setClickEvents: function() {
      var _this = this;
      return $(function() {
        $(".rq-btn").click(function() {
          _this.settings.getThenShow = true;
          return _this.getQuot();
        });
        $(".rq-backdrop, .rq-close").click(function() {
          return _this.hideQuot();
        });
        return $(".rq-another").click(function() {
          _this.settings.getThenShow = false;
          return _this.getQuot();
        });
      });
    },
    getQuot: function() {
      /* @settings.running should be "true" while there is
      fetching and rendering going on -- then it turns to false.
      This settings prevents weirdness from happening if user
      clicks .rq-another too quickly -- trying to get a new quote
      while another is still fetching/rendering.
      */

      var randQuotSet,
        _this = this;
      if (this.settings.running) {

      } else {
        this.settings.running = true;
        randQuotSet = new RandQuotSet();
        return randQuotSet.fetch({
          cache: false,
          error: function() {
            return console.log("Failed to fetch a random quotation.");
          },
          success: function() {
            return _this.renderQuot(randQuotSet);
          }
        });
      }
    },
    renderQuot: function(randQuotSet) {
      var params;
      params = {
        model: randQuotSet.models[0]
      };
      /* If there is no @activeQuot, this highlight's view will
      be it. If there is one already, set the "offscreen" option
      on the view and run @switchQuot.
      */

      if (!this.activeQuot) {
        this.activeQuot = new RandQuotView(params);
        if (this.settings.desktop()) {
          this.desktopFirst();
        } else {
          this.dom.body.addClass("opened");
        }
        return this.settings.running = false;
      } else {
        params["offscreen"] = true;
        this.offscreenQuot = new RandQuotView(params);
        return this.switchQuot();
      }
    },
    desktopFirst: function() {
      /* If this is the first load and we're at desktop size,
      throw the @dom.body offscreen, and once it's filled slide
      it onscreen.
      */

      this.dom.body.hide().addClass("opened");
      this.dom.body.css({
        "margin-right": "-28.128em",
        "opacity": "0"
      });
      this.dom.body.show().animate({
        "opacity": "1"
      }, {
        duration: 200,
        queue: false
      });
      return this.dom.body.animate({
        "margin-right": "0"
      }, {
        duration: 700,
        queue: false
      });
    },
    switchQuot: function() {
      /* Animate a transition between active and offscreen
      highlights; then destroy the old view and make
      the new one the app's @activeQuot.
      */

      var $offQuotEl, c, repositionHighlight,
        _this = this;
      $offQuotEl = $(this.offscreenQuot.el);
      c = document.getElementById("rqContent");
      this.dom.cont.height(window.getComputedStyle(c).height);
      this.dom.cont.width(window.getComputedStyle(c).width);
      repositionHighlight = function() {
        var scrollTo, top;
        $offQuotEl.css({
          position: "static",
          right: "auto"
        });
        $offQuotEl.animate({
          opacity: "1"
        });
        if (!_this.settings.getThenShow) {
          top = $("#rqTop").offset().top;
          scrollTo = _this.settings.desktop() && !_this.settings.home && !_this.settings.ipad() ? top - 60 : top - 20;
          if (!isElementInViewport(document.getElementById("rqTop"))) {
            $('body, html').animate({
              scrollTop: scrollTo
            }, "fast");
          }
        }
        return removeStyle($offQuotEl, _this.dom.cont);
      };
      return $(this.activeQuot.el).fadeOut(function() {
        _this.activeQuot.remove();
        _this.dom.cont.animate({
          height: $offQuotEl.height() + "px"
        }, function() {
          return repositionHighlight();
        });
        _this.activeQuot = _this.offscreenQuot;
        _this.offscreenQuot = "";
        if (_this.settings.getThenShow) {
          _this.showQuot();
        }
        return _this.settings.running = false;
      });
    },
    showQuot: function() {
      var currentTop;
      currentTop = $(window).scrollTop();
      this.dom.body.css({
        top: currentTop
      });
      this.dom.back.fadeIn("fast");
      return this.dom.body.addClass("show");
    },
    hideQuot: function() {
      var _this = this;
      return this.dom.body.animate({
        top: "-1000px"
      }, 200, "linear", function() {
        return _this.dom.back.fadeToggle("slow", function() {
          _this.dom.body.removeClass("show");
          return removeStyle(_this.dom.body, _this.dom.back);
        });
      });
    }
  });
  return RandQuotApp;
});
