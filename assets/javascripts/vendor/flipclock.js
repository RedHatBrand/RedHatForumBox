/*! flipclock 2015-01-26 */
var Base = function() {};
Base.extend = function(a, b) {
    "use strict";
    var c = Base.prototype.extend;
    Base._prototyping=!0;
    var d = new this;
    c.call(d, a), d.base = function() {}, delete Base._prototyping;
    var e = d.constructor, f = d.constructor = function() {
        if (!Base._prototyping)
            if (this._constructing || this.constructor == f)
                this._constructing=!0, e.apply(this, arguments), delete this._constructing;
            else if (null !== arguments[0])
                return (arguments[0].extend || c).call(arguments[0], d)
    };
    return f.ancestor = this, f.extend = this.extend, f.forEach = this.forEach, f.implement = this.implement, f.prototype = d, f.toString = this.toString, f.valueOf = function(a) {
        return "object" == a ? f : e.valueOf()
    }, c.call(f, b), "function" == typeof f.init && f.init(), f
}, Base.prototype = {
    extend: function(a, b) {
        if (arguments.length > 1) {
            var c = this[a];
            if (c && "function" == typeof b && (!c.valueOf || c.valueOf() != b.valueOf()) && /\bbase\b/.test(b)) {
                var d = b.valueOf();
                b = function() {
                    var a = this.base || Base.prototype.base;
                    this.base = c;
                    var b = d.apply(this, arguments);
                    return this.base = a, b
                }, b.valueOf = function(a) {
                    return "object" == a ? b : d
                }, b.toString = Base.toString
            }
            this[a] = b
        } else if (a) {
            var e = Base.prototype.extend;
            Base._prototyping || "function" == typeof this || (e = this.extend || e);
            for (var f = {
                toSource: null
            }, g = ["constructor", "toString", "valueOf"], h = Base._prototyping ? 0 : 1; i = g[h++];)
                a[i] != f[i] && e.call(this, i, a[i]);
            for (var i in a)
                f[i] || e.call(this, i, a[i])
        }
        return this
    }
}, Base = Base.extend({
    constructor: function() {
        this.extend(arguments[0])
    }
}, {
    ancestor: Object,
    version: "1.1",
    forEach: function(a, b, c) {
        for (var d in a)
            void 0 === this.prototype[d] && b.call(c, a[d], d, a)
    },
    implement: function() {
        for (var a = 0; a < arguments.length; a++)
            "function" == typeof arguments[a] ? arguments[a](this.prototype) : this.prototype.extend(arguments[a]);
        return this
    },
    toString: function() {
        return String(this.valueOf())
    }
});
var FlipClock;
!function() {
    "use strict";
    FlipClock = function(a, b, c) {
        return b instanceof Object && b instanceof Date==!1 && (c = b, b = 0), new FlipClock.Factory(a, b, c)
    }, FlipClock.Lang = {}, FlipClock.Base = Base.extend({
        buildDate: "2014-12-12",
        version: "0.7.7",
        options: {},
        _events: {},
        _uid: !1,
        constructor: function(a) {
            "object" != typeof a && (a = {}), this._events = {}, this._uid = (new FlipClock.Uuid).toString(), this.setOptions(a)
        },
        callback: function(a) {
            if ("function" == typeof a) {
                for (var b = [], c = 1; c <= arguments.length; c++)
                    arguments[c] && b.push(arguments[c]);
                a.apply(this, b)
            }
            return this
        },
        log: function(a) {
            return window.console && console.log && console.log(a), this
        },
        getOption: function(a) {
            return this.options.hasOwnProperty(a) ? this.options[a] : null
        },
        getOptions: function() {
            return this.options
        },
        setOption: function(a, b) {
            return this.hasOwnProperty(a) || "function" == typeof this[a] ? this[a] = b : this.options[a] = b, this
        },
        setOptions: function(a) {
            for (var b in a)
                "undefined" != typeof a[b] && this.setOption(b, a[b]);
            return this
        },
        on: function(a, b) {
            this._events[a] || (this._events[a] = []);
            var c = new FlipClock.Event(a, b);
            return this._events[a].push(c), c
        },
        once: function(a, b) {
            var c = this.on(a, b);
            return c.setFireOnce(!0), c
        },
        off: function(a) {
            return this._events[a] && delete this._events[a], this
        },
        trigger: function(a) {
            if (this._events[a]) {
                var b = [];
                for (var c in arguments)
                    c > 0 && b.push(arguments[c]);
                for (var d in this._events[a])
                    this._events[a][d].fire(this, b)
            }
            return this
        },
        localize: function(a) {
            return this.translator && this.translator.localize(a), a
        },
        t: function(a) {
            return this.localize(a)
        }
    })
}(jQuery), function(a) {
    "use strict";
    String.prototype.ucfirst = function() {
        return this.substr(0, 1).toUpperCase() + this.substr(1)
    }, a.fn.FlipClock = function(b, c) {
        return new FlipClock(a(this), b, c)
    }, a.fn.flipClock = function(b, c) {
        return a.fn.FlipClock(b, c)
    }
}(jQuery), function(a) {
    "use strict";
    FlipClock.List = FlipClock.Base.extend({
        $el: !1,
        items: [],
        options: {
            classes: {
                active: "flip-clock-active",
                before: "flip-clock-before",
                flip: "flip",
                play: "play"
            },
            lastValue: 0
        },
        value: 0,
        constructor: function(a, b) {
            this.base(b), this.value = a;
            this.createList(), this.trigger("init")
        },
        select: function(a) {
            var b = this._afterListItem;
            return this.setOption("lastValue", this.value), "undefined" == typeof a ? a = this.value : this.value = a, this.value != this.getOption("lastValue") && (this._beforeListItem.$el.removeClass(this.getOption("classes").before), this.$el.find("." + this.getOption("classes").active).removeClass(this.getOption("classes").active).addClass(this.getOption("classes").before), this.items.splice(0, 1), this._afterListItem = this.createListItem(this.value, this.getOption("classes").active), this._beforeListItem.$el.remove(), this._beforeListItem = b, this.trigger("select", this.value)), this
        },
        addPlayClass: function() {
            return this.$el.addClass(this.getOption("classes").play), this
        },
        removePlayClass: function() {
            return this.$el.removeClass(this.getOption("classes").play), this
        },
        createListItem: function(a, b) {
            var c = new FlipClock.ListItem(a, {
                className: b
            });
            return this.items.push(c), this.$el.append(c.$el), this.trigger("create:item", c), c
        },
        createList: function() {
            var b = this.$el = a('<ul class="' + this.getOption("classes").flip + '"></ul>');
            return this._beforeListItem = this.createListItem(this.getPrevValue(), this.getOption("classes").before), this._afterListItem = this.createListItem(this.value, this.getOption("classes").active), b.append(this._beforeListItem.el), b.append(this._afterListItem.el), this.trigger("create:list", b), b
        }
    })
}(jQuery), function(a) {
    "use strict";
    FlipClock.ListItem = FlipClock.Base.extend({
        $el: !1,
        options: {
            classes: {
                down: "down",
                inn: "inn",
                shadow: "shadow",
                up: "up"
            },
            className: null
        },
        value: null,
        constructor: function(b, c) {
            this.base(c), this.value = b, this.$el = a(['<li class="' + (this.getOption("className") ? this.getOption("className") : "") + '">', '<a href="#">', '<div class="' + this.getOption("classes").up + '">', '<div class="' + this.getOption("classes").shadow + '"></div>', '<div class="' + this.getOption("classes").inn + '">' + b + "</div>", "</div>", '<div class="' + this.getOption("classes").down + '">', '<div class="' + this.getOption("classes").shadow + '"></div>', '<div class="' + this.getOption("classes").inn + '">' + b + "</div>", "</div>", "</a>", "</li>"].join(""))
        },
        toString: function() {
            return this.$el.html()
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.EnglishAlphaList = FlipClock.List.extend({
        options: {
            capitalLetters: !0
        },
        constructor: function(a, b) {
            a || (a = String.fromCharCode(this.getMinCharCode())), this.base(a, b), this.value || (this.value = String.fromCharCode(this.getMinCharCode()))
        },
        getMaxCharCode: function() {
            return this.getOption("capitalLetters") ? 90 : 122
        },
        getMinCharCode: function() {
            return this.getOption("capitalLetters") ? 65 : 96
        },
        getCharCode: function() {
            return this.value.charCodeAt(0)
        },
        getPrevValue: function() {
            var a = this.value.charCodeAt(0) - 1, b = this.getMinCharCode(), c = this.getMaxCharCode();
            return b > a && (a = c), String.fromCharCode(a)
        },
        getNextValue: function() {
            var a = this.value.charCodeAt(0) + 1, b = this.getMinCharCode(), c = this.getMaxCharCode();
            return a > c && (a = b), String.fromCharCode(a)
        }
    })
}(jQuery), function(a) {
    "use strict";
    FlipClock.Divider = FlipClock.Base.extend({
        $el: !1,
        options: {
            className: !1,
            classes: {
                divider: "flip-clock-divider",
                dot: "flip-clock-dot",
                label: "flip-clock-label"
            },
            excludeDots: !1,
            label: !1
        },
        translator: !1,
        constructor: function(b) {
            this.base(b), this.getOption("label") && this.setOption("label", this.t(this.getOption("label")));
            var c = this.getOption("excludeDots") ? "": ['<span class="' + this.getOption("classes").dot + ' top"></span>', '<span class="' + this.getOption("classes").dot + ' bottom"></span>'].join("");
            this.$el = a(['<span class="' + this.getOption("classes").divider + " " + (this.getOption("css") ? this.getOption("css") : "").toLowerCase() + '">', '<span class="' + this.getOption("classes").label + '">' + (this.getOption("label") ? this.getOption("label") : "") + "</span>", c, "</span>"].join(""))
        },
        toString: function() {
            return this.$el.html()
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Event = FlipClock.Base.extend({
        name: !1,
        _hasFired: !1,
        _lastResponse: null,
        _preventFire: !1,
        _fireOnce: !1,
        _callback: function() {},
        constructor: function(a, b) {
            if (!a)
                throw "Events must have a name";
            "function" == typeof b && (this._callback = b)
        },
        fire: function(a, b) {
            return this._preventFire===!1 && (this.setLastResponse(this._callback.apply(a, b)), this._hasFired=!0, this._fireOnce && (this._preventFire=!0)), this
        },
        off: function() {
            return this._preventFire=!0, this
        },
        on: function() {
            return this._preventFire=!1, this
        },
        hasFired: function() {
            return this._hasFired
        },
        getLastResponse: function() {
            return this._lastResponse
        },
        setLastResponse: function(a) {
            return this._lastResponse = a, this
        },
        getFireOnce: function() {
            return this._fireOnce
        },
        setFireOnce: function(a) {
            return this._fireOnce = a, this
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Face = FlipClock.Base.extend({
        dividers: [],
        lang: !1,
        lists: [],
        options: {
            animationRate: 1e3,
            autoPlay: !0,
            autoStart: !0,
            countdown: !1,
            defaultLanguage: "english",
            language: "english",
            minimumDigits: 0
        },
        originalValue: 0,
        time: !1,
        timer: !1,
        translator: !1,
        value: 0,
        constructor: function(a, b) {
            var c = this;
            a instanceof Date==!1 && "object" == typeof a && (b = a, a = 0), this.dividers = [], this.lists = [], this.originalValue = a, this.value = a, this.translator = new FlipClock.Translator({
                defaultLanguage: this.getOption("defaultLanguage"),
                language: this.getOption("language")
            }), this.timer = new FlipClock.Timer, this.timer.on("interval", function() {
                c.flip(), c.trigger("interval")
            }), this.base(b), this.on("add:digit", function() {
                if (this.dividers.length)
                    for (var a in this.dividers) {
                        var b = this.dividers[a];
                        b.$el.is(":first-child") || b.$el.insertAfter(b.$el.next())
                    }
            })
        },
        addDigit: function(a) {
            var b = this.createList(a);
            return this.trigger("add:digit", b), b
        },
        attachList: function(a, b) {
            a.append(b.$el)
        },
        build: function() {
            return this.getOption("autoStart") && this.start(), this.trigger("build"), this
        },
        init: function() {
            return this.setTimeObject(this.value), this.trigger("init"), this
        },
        createDivider: function(a, b, c) {
            "boolean" != typeof b && b || (c = b, b=!1);
            var d = new FlipClock.Divider({
                label: a,
                className: b,
                excludeDots: c,
                translator: this.translator
            });
            return this.dividers.push(d), this.trigger("create:divider", d), d
        },
        createList: function(a) {
            var b = this.getListObject(a);
            return (this.getOption("autoPlay") || this.timer.running) && b.addPlayClass(), this.lists.push(b), this.trigger("create:list", b), b
        },
        getListClass: function() {
            return FlipClock.NumericList
        },
        getListObject: function(a) {
            var b = this.getListClass();
            return new b(a, {
                translator: this.translator
            })
        },
        reset: function(a) {
            return this.value = this.originalValue, this.flip(), this.trigger("reset"), this.callback(a), this
        },
        start: function(a) {
            return this.timer.running || (this.trigger("before:start"), this.timer.start(), this.trigger("start"), this.callback(a)), this
        },
        stop: function(a) {
            var b = this;
            return this.timer.running && (this.trigger("before:stop"), this.timer.stop(function() {
                b.trigger("stop"), b.callback(a)
            })), this
        },
        autoIncrement: function() {
            return this.getOption("countdown") ? this.decrement() : this.increment(), this.trigger("auto:increment", this.getOption("countdown")), this
        },
        increment: function() {
            return this.value++, this.time && this.time.addSecond(), this.trigger("increment"), this
        },
        decrement: function() {
            return 0 === this.time.getTimeSeconds() ? this.stop() : (this.value--, this.time && this.time.subSecond()), this.trigger("decrement"), this
        },
        flip: function(a) {
            for (var b in a)
                this.lists[b] ? (this.lists[b].select(a[b]), this.getOption("autoPlay") && this.timer.running && this.lists[b].addPlayClass()) : this.addDigit(a[b]);
            return this.trigger("flip"), this
        },
        setTime: function(a) {
            return this.time.time = a, this.flip(), this.trigger("set:time", a), this
        },
        getTime: function() {
            return this.time
        },
        setTimeObject: function(a) {
            return this.time = new FlipClock.Time(a, {
                minimumDigits: this.getOption("minimumDigits")
            }), this
        },
        setValue: function(a) {
            return this.value = a, this.time && this.setTimeObject(new FlipClock.Time(a)), this.flip(), this.trigger("set:value", this.value), this
        },
        getValue: function() {
            return this.value
        },
        setCountdown: function(a) {
            return this.setOption("countdown", a?!0 : !1), this.timer.running && (this.stop(), this.start()), this.trigger("set:countdown", this.getOption("countdown")), this
        },
        getCountdown: function() {
            return this.getOption("countdown")
        },
        destroy: function() {
            return this.timer.destroy(), this.trigger("destroy"), this
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Factory = FlipClock.Base.extend({
        $el: !1,
        face: !1,
        options: {
            classes: {
                wrapper: "flip-clock-wrapper"
            },
            clockFace: "HourlyCounter",
            clockFaceOptions: {},
            defaultClockFace: "HourlyCounter"
        },
        constructor: function(a, b, c) {
            b instanceof Date==!1 && "object" == typeof b && (c = b, b = 0), this.base(c), this.lists = [], this.$el = a.addClass(this.getOption("classes").wrapper), this.loadClockFace(this.getOption("clockFace"), b, this.getOption("clockFaceOptions")), this.trigger("init")
        },
        loadClockFace: function(a, b, c) {
            var d = this, e = "Face";
            return a = a.ucfirst() + e, this.face.stop && this.stop(), this.$el.html(""), this.face = FlipClock[a] ? new FlipClock[a](b, c) : new (FlipClock[this.getOption("defaultClockFace") + e])(b, c), this.face.on("create:list", function(a) {
                d.face.attachList(d.$el, a)
            }), this.face.on("destroy", function() {
                d.callback(d.onDestroy)
            }), this.face.on("start", function() {
                d.callback(d.onStart)
            }), this.face.on("stop", function() {
                d.callback(d.onStop)
            }), this.face.on("reset", function() {
                d.callback(d.onReset)
            }), this.face.on("interval", function() {
                d.callback(d.onInterval)
            }), this.face.init(this), this.face.build(), this.trigger("load:face", this.face), this.callback(d.onInit), this.face
        },
        setCountdown: function(a) {
            return this.face.setCountdown(a), this
        },
        getCountdown: function() {
            return this.face.getCountdown()
        },
        destroy: function() {
            return this.face.destroy(), this.face=!1, this.$el.removeClass(this.getOption("classes").wrapper), this.$el.html(""), this
        },
        start: function() {
            return this.face.start(), this
        },
        stop: function() {
            return this.face.stop(), this
        },
        reset: function() {
            return this.face.reset(), this
        },
        setFaceValue: function(a) {
            return this.face.setValue(a), this
        },
        getFaceValue: function() {
            return this.face.getValue()
        },
        onDestroy: function() {},
        onInit: function() {},
        onInterval: function() {},
        onStart: function() {},
        onStop: function() {},
        onReset: function() {}
    })
}(jQuery), function() {
    "use strict";
    FlipClock.NumericList = FlipClock.List.extend({
        getPrevValue: function() {
            return this.value > 0 ? this.value - 1 : 9
        },
        getNextValue: function() {
            return this.value < 9 ? this.value + 1 : 0
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Time = FlipClock.Base.extend({
        time: 0,
        options: {
            minimumDigits: 0
        },
        constructor: function(a, b) {
            "object" != typeof b && (b = {}), a instanceof Date ? this.time = a : a && (this.time = Math.round(a)), this.base(b)
        },
        convertDigitsToArray: function(a) {
            var b = [];
            a = a.toString();
            for (var c = 0; c < a.length; c++)
                a[c].match(/^\d*$/g) && b.push(a[c]);
            return b
        },
        digit: function(a) {
            var b = this.toString(), c = b.length;
            return b[c - a] ? b[c - a] : !1
        },
        digitize: function(a) {
            var b = [];
            for (var c in a) {
                var d = a[c].toString();
                1 == d.length && (d = "0" + d);
                for (var e = 0; e < d.length; e++)
                    b.push(d.charAt(e))
            }
            if (b.length > this.getOption("minimumDigits") && this.setOption("minimumDigits", b.length), this.getOption("minimumDigits") > b.length)
                for (var e = b.length; e < this.getOption("minimumDigits"); e++)
                    b.unshift("0");
            return b
        },
        getDateObject: function() {
            return this.time instanceof Date ? this.time : new Date((new Date).getTime() + 1e3 * this.getTimeSeconds())
        },
        getDayCounter: function(a) {
            var b = [this.getDays(), this.getHours(!0), this.getMinutes(!0)];
            return a && b.push(this.getSeconds(!0)), this.digitize(b)
        },
        getDays: function(a) {
            var b = this.getTimeSeconds() / 60 / 60 / 24;
            return a && (b%=7), Math.floor(b)
        },
        getHourCounter: function(a) {
            var b = [this.getHours(), this.getMinutes(!0)];
            return a!==!1 && b.push(this.getSeconds(!0)), this.digitize(b)
        },
        getHourly: function(a) {
            return this.getHourCounter(a)
        },
        getHours: function(a) {
            var b = this.getTimeSeconds() / 60 / 60;
            return a && (b%=24), Math.floor(b)
        },
        getMilitaryTime: function(a, b) {
            "undefined" == typeof b && (b=!0), a || (a = this.getDateObject());
            var c = [a.getHours(), a.getMinutes()];
            return b===!0 && c.push(a.getSeconds()), this.digitize(c)
        },
        getMinutes: function(a) {
            var b = this.getTimeSeconds() / 60;
            return a && (b%=60), Math.floor(b)
        },
        getMinuteCounter: function(a) {
            var b = [this.getMinutes()];
            return a!==!1 && b.push(this.getSeconds(!0)), this.digitize(b)
        },
        getTimeSeconds: function(a, b) {
            return b || (b = new Date), Math.round(this.time instanceof Date ? a ? Math.max(this.time.getTime() / 1e3 - b.getTime() / 1e3, 0) : b.getTime() / 1e3 - this.time.getTime() / 1e3 : this.time)
        },
        getTime: function(a, b) {
            "undefined" == typeof b && (b=!0), a || (a = this.getDateObject());
            var c = a.getHours(), d = [c > 12 ? c - 12: 0 === c ? 12: c, a.getMinutes()];
            return b===!0 && d.push(a.getSeconds()), this.digitize(d)
        },
        getSeconds: function(a) {
            var b = this.getTimeSeconds();
            return a && (60 == b ? b = 0 : b%=60), Math.ceil(b)
        },
        getWeeks: function(a) {
            var b = this.getTimeSeconds() / 60 / 60 / 24 / 7;
            return a && (b%=52), Math.floor(b)
        },
        removeLeadingZeros: function(a, b) {
            var c = 0, d = [];
            for (var e in b)
                a > e ? c += parseInt(b[e], 10) : d.push(b[e]);
            return 0 === c ? d : b
        },
        addSeconds: function(a) {
            this.time instanceof Date ? this.time.setSeconds(this.time.getSeconds() + a) : this.time += a
        },
        addSecond: function() {
            this.addSeconds(1)
        },
        subSeconds: function(a) {
            this.time instanceof Date ? this.time.setSeconds(this.time.getSeconds() - a) : this.time -= a
        },
        subSecond: function() {
            this.subSeconds(1)
        },
        toString: function() {
            return this.getTimeSeconds().toString()
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Timer = FlipClock.Base.extend({
        count: 0,
        options: {
            animationRate: 1e3,
            interval: 1e3
        },
        running: !1,
        constructor: function(a) {
            this.base(a), this.trigger("init")
        },
        getElapsed: function() {
            return this.count * this.getOption("interval")
        },
        getElapsedTime: function() {
            return new Date(this.time + this.getElapsed())
        },
        reset: function(a) {
            return clearInterval(this.timer), this.count = 0, this._setInterval(a), this.trigger("reset"), this
        },
        start: function(a) {
            return this.running=!0, this._createTimer(a), this
        },
        stop: function(a) {
            var b = this;
            return this.running=!1, this._clearInterval(), setTimeout(function() {
                b.callback(a), b.trigger("stop")
            }, this.getOption("interval")), this
        },
        destroy: function(a) {
            return this._destroyTimer(a), this.trigger("destroy"), this
        },
        _clearInterval: function() {
            clearInterval(this.timer)
        },
        _createTimer: function(a) {
            this._setInterval(a)
        },
        _destroyTimer: function(a) {
            this._clearInterval(), this.running=!1, this.timer=!1, this.callback(a), this.trigger("destroy")
        },
        _interval: function(a) {
            this.callback(a), this.trigger("interval"), this.count++
        },
        _setInterval: function(a) {
            var b = this;
            this.timer = setInterval(function() {
                b.running && b._interval(a)
            }, this.getOption("interval")), this.trigger("start"), this._interval(a)
        }
    })
}(jQuery), function() {
    "use strict";
    FlipClock.Translator = FlipClock.Base.extend({
        lang: !1,
        options: {
            defaultLanguage: "english",
            language: "english"
        },
        constructor: function(a) {
            this.base(a), this.loadLanguage(this.getOption("language"))
        },
        loadLanguage: function(a) {
            var b;
            return b = FlipClock.Lang[a.ucfirst()] ? FlipClock.Lang[a.ucfirst()] : FlipClock.Lang[a] ? FlipClock.Lang[a] : FlipClock.Lang[this.getOption("defaultLanguage")], this.lang = b
        },
        localize: function(a, b) {
            var c = this.lang;
            if (!a)
                return null;
            var d = a.toLowerCase();
            return "object" == typeof b && (c = b), c && c[d] ? c[d] : a
        }
    })
}(), function() {
    "use strict";
    FlipClock.Uuid = FlipClock.Base.extend({
        value: !1,
        constructor: function(a) {
            this.value = a ? a : this.generate()
        },
        generate: function() {
            var a = (new Date).getTime(), b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
                var c = (a + 16 * Math.random())%16 | 0;
                return a = Math.floor(a / 16), ("x" == b ? c : 3 & c | 8).toString(16)
            });
            return b
        },
        equals: function(a) {
            return this.isUuid(a) && value == a
        },
        isUuid: function(a) {
            var b = new RegExp("^[a-z0-9]{32}$", "i");
            return a && (a instanceof Uuid || b.test(a.toString()))
        },
        toString: function() {
            return this.value
        }
    })
}(jQuery), function() {
    FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({
        build: function(a) {
            var a = a ? a: this.time.getMilitaryTime(!1, this.showSeconds);
            for (var b in a)
                this.createList(a[b]);
            this.createDivider().$el.insertBefore(this.lists[this.lists.length - 2].$el), this.createDivider().$el.insertBefore(this.lists[this.lists.length - 4].$el), this.base()
        },
        flip: function(a) {
            this.autoIncrement(), a = a ? a : this.time.getMilitaryTime(!1, this.showSeconds), this.base(a)
        }
    })
}(jQuery), function() {
    FlipClock.CounterFace = FlipClock.Face.extend({
        shouldAutoIncrement: !1,
        constructor: function(a, b) {
            this.base(a, b), this.timer.off("stop"), this.on("before:start", function() {
                this.shouldAutoIncrement=!0
            }), this.on("before:stop", function() {
                this.shouldAutoIncrement=!1
            }), this.on("create:list", function(a) {
                a.addPlayClass()
            })
        },
        build: function() {
            var a = this, b = this.getTime().digitize([this.getTime().time]);
            for (var c in b)
                a.createList(b[c]);
            this.autoStart && (this.shouldAutoIncrement=!0), this.base()
        },
        flip: function(a) {
            this.shouldAutoIncrement && this.autoIncrement(), a || (a = this.getTime().digitize([this.getTime().time])), this.base(a)
        },
        init: function(a) {
            var b = this;
            a.increment = function() {
                b.increment(), b.flip()
            }, a.decrement = function() {
                b.decrement(), b.flip()
            }, this.base(a)
        }
    })
}(jQuery), function() {
    FlipClock.DailyCounterFace = FlipClock.Face.extend({
        showSeconds: !0,
        build: function() {
            var a = 0, b = this.time.getDayCounter(this.showSeconds);
            for (var c in b)
                this.createList(b[c]);
            this.showSeconds ? this.createDivider("Seconds").$el.insertBefore(this.lists[this.lists.length - 2].$el) : a = 2, this.createDivider("Minutes").$el.insertBefore(this.lists[this.lists.length - 4 + a].$el), this.createDivider("Hours").$el.insertBefore(this.lists[this.lists.length - 6 + a].$el), this.createDivider("Days", !0).$el.insertBefore(this.lists[0].$el), this.base()
        },
        flip: function() {
            this.base(this.time.getDayCounter(this.showSeconds)), this.autoIncrement()
        }
    })
}(jQuery), function() {
    FlipClock.EnglishAlphabetFace = FlipClock.Face.extend({
        _autoIncrementValues: [],
        shouldAutoIncrement: !1,
        capitalLetters: !0,
        init: function(a) {
            this.base(a), this.on("before:start", function() {
                console.log("before"), this.shouldAutoIncrement=!0
            }), this.on("before:stop", function() {
                this.shouldAutoIncrement=!1
            }), this.value || (this.value = this.getListObject(this.value).value)
        },
        build: function() {
            var a = this.value.split("");
            for (var b in a)
                this.createList(a[b]);
            for (var c in this.lists)
                this._autoIncrementValues.unshift(this.lists[c].getCharCode());
            this.base()
        },
        increment: function() {
            for (var a=!0, b = 0, c = this.value.split(""); a;) {
                a=!1;
                var d = (this._autoIncrementValues[b], this.lists[this.lists.length - b - 1]);
                d ? (c[this.value.length - b - 1] = d.getNextValue(), d.getCharCode() >= d.getMaxCharCode() && (a=!0, b++)) : c.unshift(String.fromCharCode(this.getListObject(!1).getMinCharCode()))
            }
            this.value = c.join("")
        },
        decrement: function() {
            for (var a=!0, b = 0, c = this.value.split(""); a;) {
                a=!1;
                var d = (this._autoIncrementValues[b], this.lists[this.lists.length - b - 1]);
                d ? (c[this.value.length - b - 1] = d.getPrevValue(), d.getCharCode() <= d.getMinCharCode() && (a=!0, b++)) : c.unshift(String.fromCharCode(this.getListObject(!1).getMinCharCode()))
            }
            this.value = c.join("")
        },
        flip: function() {
            this.shouldAutoIncrement && this.autoIncrement(), this.base(this.value.split(""))
        },
        getListClass: function() {
            return FlipClock.EnglishAlphaList
        },
        getListObject: function(a) {
            var b = this.getListClass();
            return new b(a, {
                capitalLetters: this.capitalLetters,
                translator: this.translator
            })
        }
    })
}(jQuery), function() {
    FlipClock.HourlyCounterFace = FlipClock.Face.extend({
        constructor: function(a, b) {
            this.base(a, b), null === this.getOption("includeSeconds") && this.setOption("includeSeconds", !0)
        },
        build: function(a) {
            var b = 0, a = a ? a: this.time.getHourCounter(this.getOption("includeSeconds"));
            for (var c in a)
                this.createList(a[c]);
            this.getOption("includeSeconds")===!0 && (b = 2, this.createDivider("Seconds").$el.insertBefore(this.lists[this.lists.length - b].$el)), this.createDivider("Minutes").$el.insertBefore(this.lists[this.lists.length - 2 - b].$el), this.createDivider("Hours", !0).$el.insertBefore(this.lists[0].$el), this.base()
        },
        flip: function(a) {
            a || (a = this.time.getHourCounter(this.getOption("includeSeconds"))), this.base(a), this.autoIncrement()
        },
        appendDigitToClock: function(a) {
            this.base(a), this.dividers[0].insertAfter(this.dividers[0].next())
        }
    })
}(jQuery), function() {
    FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({
        build: function() {
            var a = this.time.getMinuteCounter(this.getOption("includeSeconds"));
            for (var b in a)
                this.createList(a[b]);
            return this.getOption("includeSeconds") && this.createDivider("Seconds").$el.insertBefore(this.lists[this.lists.length - 2].$el), this.createDivider("Minutes").$el.insertBefore(this.lists[0].$el), FlipClock.Face.prototype.build.call(this)
        },
        flip: function() {
            this.base(this.time.getMinuteCounter(this.getOption("includeSeconds")))
        }
    })
}(jQuery), function(a) {
    FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({
        meridium: !1,
        meridiumText: "AM",
        build: function() {
            var b = this.time.getTime(!1, this.showSeconds);
            this.meridiumText = this.getMeridium(), this.$meridium = a(['<ul class="flip-clock-meridium">', "<li>", '<a href="#">' + this.meridiumText + "</a>", "</li>", "</ul>"].join("")), this.base(b), this.$meridium.insertAfter(this.lists[this.lists.length - 1].$el)
        },
        flip: function() {
            this.meridiumText != this.getMeridium() && (this.meridiumText = this.getMeridium(), this.$meridium.find("a").html(this.meridiumText)), this.base(this.time.getTime(!1, this.showSeconds))
        },
        getMeridium: function() {
            return this.t((new Date).getHours() >= 12 ? "PM" : "AM")
        },
        isPM: function() {
            return "PM" == this.getMeridium()?!0 : !1
        },
        isAM: function() {
            return "AM" == this.getMeridium()?!0 : !1
        }
    })
}(jQuery), function() {
    FlipClock.Lang.Arabic = {
        years: "سنوات",
        months: "شهور",
        days: "أيام",
        hours: "ساعات",
        minutes: "دقائق",
        seconds: "ثواني"
    }, FlipClock.Lang.ar = FlipClock.Lang.Arabic, FlipClock.Lang["ar-ar"] = FlipClock.Lang.Arabic, FlipClock.Lang.arabic = FlipClock.Lang.Arabic
}(jQuery), function() {
    FlipClock.Lang.Danish = {
        years: "År",
        months: "Måneder",
        days: "Dage",
        hours: "Timer",
        minutes: "Minutter",
        seconds: "Sekunder"
    }, FlipClock.Lang.da = FlipClock.Lang.Danish, FlipClock.Lang["da-dk"] = FlipClock.Lang.Danish, FlipClock.Lang.danish = FlipClock.Lang.Danish
}(jQuery), function() {
    FlipClock.Lang.German = {
        years: "Jahre",
        months: "Monate",
        days: "Tage",
        hours: "Stunden",
        minutes: "Minuten",
        seconds: "Sekunden"
    }, FlipClock.Lang.de = FlipClock.Lang.German, FlipClock.Lang["de-de"] = FlipClock.Lang.German, FlipClock.Lang.german = FlipClock.Lang.German
}(jQuery), function() {
    FlipClock.Lang.English = {
        years: "Years",
        months: "Months",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds"
    }, FlipClock.Lang.en = FlipClock.Lang.English, FlipClock.Lang["en-us"] = FlipClock.Lang.English, FlipClock.Lang.english = FlipClock.Lang.English
}(jQuery), function() {
    FlipClock.Lang.Spanish = {
        years: "A&#241;os",
        months: "Meses",
        days: "D&#205;as",
        hours: "Horas",
        minutes: "Minutos",
        seconds: "Segundo"
    }, FlipClock.Lang.es = FlipClock.Lang.Spanish, FlipClock.Lang["es-es"] = FlipClock.Lang.Spanish, FlipClock.Lang.spanish = FlipClock.Lang.Spanish
}(jQuery), function() {
    FlipClock.Lang.Finnish = {
        years: "Vuotta",
        months: "Kuukautta",
        days: "Päivää",
        hours: "Tuntia",
        minutes: "Minuuttia",
        seconds: "Sekuntia"
    }, FlipClock.Lang.fi = FlipClock.Lang.Finnish, FlipClock.Lang["fi-fi"] = FlipClock.Lang.Finnish, FlipClock.Lang.finnish = FlipClock.Lang.Finnish
}(jQuery), function() {
    FlipClock.Lang.French = {
        years: "Ans",
        months: "Mois",
        days: "Jours",
        hours: "Heures",
        minutes: "Minutes",
        seconds: "Secondes"
    }, FlipClock.Lang.fr = FlipClock.Lang.French, FlipClock.Lang["fr-ca"] = FlipClock.Lang.French, FlipClock.Lang.french = FlipClock.Lang.French
}(jQuery), function() {
    FlipClock.Lang.Italian = {
        years: "Anni",
        months: "Mesi",
        days: "Giorni",
        hours: "Ore",
        minutes: "Minuti",
        seconds: "Secondi"
    }, FlipClock.Lang.it = FlipClock.Lang.Italian, FlipClock.Lang["it-it"] = FlipClock.Lang.Italian, FlipClock.Lang.italian = FlipClock.Lang.Italian
}(jQuery), function() {
    FlipClock.Lang.Latvian = {
        years: "Gadi",
        months: "Mēneši",
        days: "Dienas",
        hours: "Stundas",
        minutes: "Minūtes",
        seconds: "Sekundes"
    }, FlipClock.Lang.lv = FlipClock.Lang.Latvian, FlipClock.Lang["lv-lv"] = FlipClock.Lang.Latvian, FlipClock.Lang.latvian = FlipClock.Lang.Latvian
}(jQuery), function() {
    FlipClock.Lang.Dutch = {
        years: "Jaren",
        months: "Maanden",
        days: "Dagen",
        hours: "Uren",
        minutes: "Minuten",
        seconds: "Seconden"
    }, FlipClock.Lang.nl = FlipClock.Lang.Dutch, FlipClock.Lang["nl-be"] = FlipClock.Lang.Dutch, FlipClock.Lang.dutch = FlipClock.Lang.Dutch
}(jQuery), function() {
    FlipClock.Lang.Norwegian = {
        years: "År",
        months: "Måneder",
        days: "Dager",
        hours: "Timer",
        minutes: "Minutter",
        seconds: "Sekunder"
    }, FlipClock.Lang.no = FlipClock.Lang.Norwegian, FlipClock.Lang.nb = FlipClock.Lang.Norwegian, FlipClock.Lang["no-nb"] = FlipClock.Lang.Norwegian, FlipClock.Lang.norwegian = FlipClock.Lang.Norwegian
}(jQuery), function() {
    FlipClock.Lang.Portuguese = {
        years: "Anos",
        months: "Meses",
        days: "Dias",
        hours: "Horas",
        minutes: "Minutos",
        seconds: "Segundos"
    }, FlipClock.Lang.pt = FlipClock.Lang.Portuguese, FlipClock.Lang["pt-br"] = FlipClock.Lang.Portuguese, FlipClock.Lang.portuguese = FlipClock.Lang.Portuguese
}(jQuery), function() {
    FlipClock.Lang.Russian = {
        years: "лет",
        months: "месяцев",
        days: "дней",
        hours: "часов",
        minutes: "минут",
        seconds: "секунд"
    }, FlipClock.Lang.ru = FlipClock.Lang.Russian, FlipClock.Lang["ru-ru"] = FlipClock.Lang.Russian, FlipClock.Lang.russian = FlipClock.Lang.Russian
}(jQuery), function() {
    FlipClock.Lang.Swedish = {
        years: "År",
        months: "Månader",
        days: "Dagar",
        hours: "Timmar",
        minutes: "Minuter",
        seconds: "Sekunder"
    }, FlipClock.Lang.sv = FlipClock.Lang.Swedish, FlipClock.Lang["sv-se"] = FlipClock.Lang.Swedish, FlipClock.Lang.swedish = FlipClock.Lang.Swedish
}(jQuery), function() {
    FlipClock.Lang.Chinese = {
        years: "年",
        months: "月",
        days: "日",
        hours: "时",
        minutes: "分",
        seconds: "秒"
    }, FlipClock.Lang.zh = FlipClock.Lang.Chinese, FlipClock.Lang["zh-cn"] = FlipClock.Lang.Chinese, FlipClock.Lang.chinese = FlipClock.Lang.Chinese
}(jQuery);

