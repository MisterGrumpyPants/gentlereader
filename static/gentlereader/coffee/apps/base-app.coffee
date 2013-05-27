define ['jquery',
        'apps/search-app',
        'lib/picturefill'],

  ($, searchApp, picturefill) ->

    BaseApp = ->

      $searchBtn = $(".nav-search")
      $searchCont = $(".nav-search--container")
      $browseBtn = $(".nav-browse, .subnav-browse--close")
      $browseCont = $(".subnav-browse--container")

      menuToggle = ($desired, $other) ->
        $desired.slideToggle "fast", ->
          $(document).off "click"
          if $desired.css("display") == "block"
            $other.slideUp()
            # Clicking outside the container will close it
            $desired.click (e) ->
              e.stopPropagation()
            $(document).one "click", (e) ->
              $desired.slideToggle "fast"



      # show and hide browse
      $browseBtn.click (e) ->
        e.stopPropagation()
        menuToggle $browseCont, $searchCont

      # show and hide search
      $searchBtn.click (e) ->
        e.stopPropagation()
        menuToggle $searchCont, $browseCont


      $getCopy = $(".get-copyright-info")
      $copyCont = $(".footer-copyright")
      $getCopy.click (e) ->
        e.preventDefault()
        $copyCont.slideToggle "fast", ->
          if $copyCont.css("display") == "block"
            $("html, body").animate scrollTop: $copyCont.offset().top



      searchApp.initialize()


    return BaseApp