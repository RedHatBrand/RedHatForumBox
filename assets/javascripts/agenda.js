(function (global) {
  var AgendaSession = React.createClass({
    render: function () {
      var Speaker = (function () {
        if (this.props.speakerSlug) {
          return React.createElement('a', {
            'className': 'modal-open',
            'data-target-modal': this.props.speakerSlug,
            href: '#' + this.props.speakerSlug
          }, React.createElement('h3', {
            className: 'agenda-session-header-speaker'
          }, this.props.speaker))
        } else {
          return React.createElement('h3', {
            className: 'agenda-session-header-speaker'
          }, this.props.speaker)
        }
      }.bind(this))()

      return React.createElement('div', { className: 'agenda-session' },
        React.createElement('div', { className: 'agenda-session-inner' },
          React.createElement('header', { className: 'session-header' },
            (this.props.title ? React.createElement('h3', { className: 'agenda-session-header-text' },
              this.props.title
            ) : null),
            (this.props.speaker ? Speaker : null)
          ),
          React.createElement('div', { className: 'agenda-session-content' },
            (this.props.location ? React.createElement('p', { className: 'agenda-session-content-location' },
              this.props.location
            ) : null),
            (this.props.group ? React.createElement('p', { className: 'agenda-session-content-group' },
              this.props.group
            ) : null)
          )
        )
      )
    }
  })

  var AgendaTimeSlot = React.createClass({
    isBreak: function () {
      return this.props.sessions.every(function (session) {
        return session.type.match(/break/)
      })
    },
    buildSessions: function () {
      return this.props.sessions.map(function (session) {
        return React.createElement(AgendaSession, {
          type: session.type,
          start: session.start,
          end: session.end,
          title: session.title,
          speaker: session.speaker,
          speakerSlug: session['speaker-slug'],
          group: session.group,
          location: session.location
        })
      })
    },
    render: function () {
      return React.createElement('div', { className: 'agenda-range-row' + (this.isBreak() ? ' break' : '') },
        React.createElement('div', { className: 'container agenda-range-row-sessions-' + this.props.sessions.length  },
          React.createElement('div', { className: 'agenda-range-row-start-time' },
            moment(this.props.start, 'HH:mm').format(this.props.timeFormat),
            moment(this.props.start, 'HH:mm').format(this.props.meridianFormat)
          ),
          React.createElement('div', { className: 'agenda-range-row-sesions-container' },
            this.buildSessions()
          )
        )
      )
    }
  })

  var AgendaDay = React.createClass({
    buildTimeSlots: function () {
      return this.props.sessions.reduce(function (startTimes, session) {
        if (startTimes.indexOf(session.start) === -1) {
          startTimes.push(session.start)
        }
        return startTimes
      }, []).map(function (timeSlotStart) {
        return React.createElement(AgendaTimeSlot, {
          timeFormat: this.props.timeFormat,
          meridianFormat: this.props.meridianFormat,
          start: timeSlotStart,
          sessions: this.props.sessions.filter(function (session) {
            return session.start === timeSlotStart
          })
        })
      }.bind(this))
    },
    render: function () {
      return React.createElement('div', { className: 'agenda-day' },
        React.createElement('div', { className: 'container agenda-day-info' },
          React.createElement('h1', null, this.props.name),
          React.createElement('h2', null, this.props.date)
        ),
        React.createElement('div', { className: 'time-table' },
          this.buildTimeSlots()
        )
      )
    }
  })

  var Agenda = React.createClass({
    getDefaultProps: function () {
      return {
        timeFormat: 'h:mm',
        meridianFormat: 'a'
      }
    },
    buildDays: function () {
      return this.props.days.map(function (day) {
        return React.createElement(AgendaDay, {
          timeFormat: this.props.timeFormat,
          meridianFormat: this.props.meridianFormat,
          name: day.name,
          date: day.date,
          sessions: day.sessions
        })
      }.bind(this))
    },
    render: function () {
      return React.createElement('div', {}, this.buildDays())
    }
  })

  var agendaMount = document.getElementById('agenda-component')
  React.render(React.createElement(Agenda, { days: days }), agendaMount)
})(window)
