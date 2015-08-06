(function (global) {

  // Map.js
  //

  function initMap () {
    var baseUrl = '//open.mapquestapi.com/geocoding/v1/address'
    var params = {
      key: 'Fmjtd%7Cluurn96z2l%2Cr2%3Do5-9w8agr',
      outFormat: 'json',
      location:  window.encodeURIComponent(mapSettings.address)
    }

    function queryString (params) {
      return Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
    }

    var url = baseUrl + '?' + queryString(params)

    $.ajax({
      type: 'get',
      url: url,
      success: function (res) {
        var loc = res.results[0].locations[0]
        var latLng = (loc && loc.latLng) || { lat: 27.4679, lng: 153.0278 }
        var lat = latLng.lat
        var lon = latLng.lng

        renderMap([lat, lon])
      }
    })

    function renderMap (loc) {
      var zoom = parseInt(mapSettings.zoom)
      var map = L.map('map', {
        scrollWheelZoom: false,
          zoomControl: false,
          attributionControl: false,
          fadeAnimation: false,
          zoomAnimation: false,
          markerZoomAnimation: false
      })
      map.dragging.disable()

      var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {style: 'toner-background'})
      tiles.addTo(map)

      L.marker(loc, {
        icon: L.divIcon({ className: 'marker-icon' })
      }).addTo(map)

      map.setView(loc, zoom)

      return map
    }
  }


  // Menu
  //

  function initMenu () {
    $('a.menu-link').on('click', function() {
      var target
      unburger()
      $('.mobilenav').removeClass('menu-show')
      $('.nav-toggle').removeClass('active')
      target = $(this).attr('href')
      $.smoothScroll({
        scrollTarget: target,
        offset: -60
      })
      return false
    })

    // HAMBURGLERv2

    $('.icon').click(function () {
      $('.mobilenav').toggleClass('menu-show')
      $('.top-menu').toggleClass('top-animate')
      $('body').toggleClass('noscroll')
      $('.mid-menu').toggleClass('mid-animate')
      $('.bottom-menu').toggleClass('bottom-animate')
    })

    // PUSH ESC KEY TO EXIT

    function unburger () {
      $('.mobilenav').removeClass('menu-show')
      $('.top-menu').removeClass('top-animate')
      $('body').removeClass('noscroll')
      $('.mid-menu').removeClass('mid-animate')
      $('.bottom-menu').removeClass('bottom-animate')
    }

    $(document).keydown(function(e) {
      if (e.keyCode == 27) {
        unburger()
      }
    })
  }


  // Countdown
  //

  function initCountdown () {
    function renderCountdown (date, lang) {
      var parsedDate = moment(date, [
          'D/M/YYYY',
          'D/M/YY',
          'D MMMM YYYY',
          'D MMMM YY',
          'D MMM YYYY',
          'D MMM YY',
          'MMMM D YYYY',
          'MMMM D YY',
          'MMM D YYYY',
          'MMM D YY'
      ])
      var now = parseInt(Date.now() / 1000)

      if (!parsedDate.isValid()) { return }

      var timeUntil = parsedDate.format('X') - now

      if (timeUntil < 0) { return }

      $('#countdown').FlipClock(timeUntil, {
        clockFace: 'DailyCounter',
        clockFaceOptions: {
          autoPlay: false,
          countdown: true,
          language: lang
        },
      })
    }

    var date = countdownSettings.date
    var lang = countdownSettings.lang

    if (date) {
      renderCountdown(date, lang)
    }
  }


  // Modals
  //

  function initModalToggle() {
    var $modalButton = $('.modal-open'),
        $modalClose  = $('.modal-close'),
        $modalSubmit = $('.modal-submit'),
        $modalCancel = $('.modal-cancel'),
        $modal       = $('.modal'),
        $overLay     = $('#modal-overlay')

    function openModal(e) {
      var target = $(this).data('target-modal')
      e.preventDefault()
      $overLay.addClass('open')
      $('#' + target).addClass('open')
      $('body').addClass("noscroll")
    }

    $(document).on('click', '.modal-open', openModal)

    function closeModal () {
      $modal.removeClass('open')
      $overLay.removeClass('open')
      $('body').removeClass("noscroll")
    }

    $(document).on('click', '.modal-close', closeModal)
    $(document).on('click', '.modal-cancel', closeModal)
    $(document).on('click', '.modal-submit', closeModal)
    $overLay.on('click', closeModal)

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        closeModal()
      }
    })
  }


  // Agenda
  //

  function initAgenda () {
    var timeFormat = 'h:mm'
    var meridianFormat = 'a'

    var $dayElems = $('.js-time-table')
    var days = $dayElems.map(function (_i, dayElem) {
      var $sessionElems = $('.js-agenda-session', dayElem)
      return {
        element: dayElem,
        sessions: $sessionElems.map(function (_i, sessionElem) {
          return {
            start: sessionElem.getAttribute('data-start'),
            end: sessionElem.getAttribute('data-end'),
            group: sessionElem.getAttribute('data-group'),
            type: sessionElem.getAttribute('data-type'),
            element: sessionElem
          }
        }).toArray()
      }
    }).toArray()

    days.forEach(function (day) {
      var container = day.element
      var ranges = day.sessions.reduce(function (ranges, session) {
        var start = moment(session.start, 'HH:mm').format('X')
        var end = moment(session.end, 'HH:mm').format('X')
        var existing = ranges.filter(function (range) {
          return range.start == start
        })[0]
        if (existing) {
          existing.sessions.push(session)

          if (existing.end < end) {
            existing.end = end
          }
        } else {
          ranges.push({
            start: start,
            end: end,
            sessions: [session]
          })
        }
        return ranges
      }, [])

      ranges.forEach(function (range) {
        var rangeRowContainer = document.createElement('div')
        var rangeRow = document.createElement('div')
        var rangeRowSessions = document.createElement('div')
        var time = moment(range.start, 'X').format(timeFormat)
        var meridian = moment(range.start, 'X').format(meridianFormat)
        var timeElem = document.createElement('div')
        var timeValueElem = document.createElement('h3')
        var meridianElem = document.createElement('span')

        $(timeElem).addClass('agenda-range-row-start-time')
        var timeText = document.createTextNode(time)
        meridianElem.appendChild(timeText)
        var meridianText = document.createTextNode(meridian)
        meridianElem.appendChild(meridianText)
        timeElem.appendChild(timeValueElem)
        timeElem.appendChild(meridianElem)

        $(rangeRowSessions).addClass('agenda-range-row-sesions-container')

        $(rangeRow).addClass('agenda-range-row')
        $(rangeRowContainer).addClass('container')
        $(rangeRowContainer).addClass('agenda-range-row-sessions-' + range.sessions.length)
        rangeRowContainer.appendChild(timeElem)
        rangeRowContainer.appendChild(rangeRowSessions)
        rangeRow.appendChild(rangeRowContainer)

        range.sessions.forEach(function (session) {
          var sessionElem = document.createElement('div')
          $(sessionElem).addClass('agenda-session')
          var sessionInner = $(session.element).find('.agenda-session-inner').clone()[0]
          sessionElem.appendChild(sessionInner)
          rangeRowSessions.appendChild(sessionElem)

          if (session.type === 'break') {
            $(rangeRow).addClass('break')
          }

          container.removeChild(session.element)
        })

        container.appendChild(rangeRow)
      })
    })
  }

  function forwardTrackingParam () {
    var params = location.search.slice(1).split('&').reduce(function (params, keyValue) {
      var key = keyValue.split('=')[0]
      var value = keyValue.split('=')[1]

      params[key] = value

      return params
    }, {})

    var paramString = 'var=' + params.var
    var registerLinks = [].slice.call(document.getElementsByClassName('js-tracking-link'))

    if (params.var) {
      registerLinks.forEach(function (registerLink) {
        var link = registerLink.getAttribute('href')
        var linkExternal = !(link.match(/^#/))
        var hasSearch = link.match(/\?/)
        if (linkExternal) {
          if (hasSearch) {
            registerLink.setAttribute('href', link + '&' + paramString)
          } else {
            registerLink.setAttribute('href', link + '?' + paramString)
          }
        }
      })
    }
  }

  // Initialisation
  //

  $(function init () {
    initMap()
    initMenu()
    // Hacky check for proper Events API
    if (document.addEventListener) {
      initCountdown()
    }
    forwardTrackingParam()
    initAgenda()
    initModalToggle()
  })
})(window)
