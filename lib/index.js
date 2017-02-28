'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MINS_PER_WEEK = 60 * 24 * 7;
var MINS_PER_DAY = 60 * 24;
var MINS_PER_HOUR = 60;

var START = 'start';
var END = 'end';

var DAYS_OF_WEEK = {
  0: { name: 'Monday', abbr: 'Mon', short: 'M' },
  1: { name: 'Tuesday', abbr: 'Tue', short: 'Tu' },
  2: { name: 'Wednesday', abbr: 'Wed', short: 'W' },
  3: { name: 'Thursday', abbr: 'Thu', short: 'Th' },
  4: { name: 'Fridday', abbr: 'Fri', short: 'F' },
  5: { name: 'Saturday', abbr: 'Sat', short: 'Sa' },
  6: { name: 'Sunday', abbr: 'Sun', short: 'Su' }
};

var OpenHours = function () {
  function OpenHours(args) {
    _classCallCheck(this, OpenHours);

    var start = args.start,
        end = args.end;

    if (Array.isArray(args)) {
      start = args[0];
      end = args[1];
    }

    this.start = parseMinutes(start);
    this.end = parseMinutes(end);
  }

  _createClass(OpenHours, [{
    key: 'format',
    value: function format(options) {
      var opts = _extends({ dayFmt: 'name', separator: ' to ' }, options);

      return DAYS_OF_WEEK[this.start.day][opts.dayFmt] + ' ' + formatTime(this.start.hour, this.start.mins, opts) + opts.separator + (this.end.minutes - this.start.minutes >= MINS_PER_DAY ? DAYS_OF_WEEK[this.end.day][opts.dayFmt] + " " : "") + formatTime(this.end.hour, this.end.mins, opts);
    }
  }]);

  return OpenHours;
}();

function parseMinutes(minutes) {
  minutes = minutes % MINS_PER_WEEK;
  var day = Math.floor(minutes % MINS_PER_WEEK / MINS_PER_DAY);
  var hour = Math.floor(minutes % MINS_PER_DAY / MINS_PER_HOUR);
  var mins = minutes % MINS_PER_HOUR;
  return { day: day, hour: hour, mins: mins, minutes: minutes };
}

function parse(args) {
  if (Array.isArray(args) && isNaN(args[0])) {
    return args.map(function (e) {
      return parse(e);
    }).sort(function (a, b) {
      return a.minutes - b.minutes;
    });
  } else {
    return new OpenHours(args);
  }
}

function format(oh, options) {
  var opts = _extends({ dayFmt: 'name', separator: ' to ' }, options);

  if (Array.isArray(oh)) {
    return oh.map(function (h) {
      return h.format(opts);
    });
  } else {
    return oh.format(opts);
  }
}

function formatTime(hour, min, options) {
  var opts = _extends({ military: false, periodFmt: { 0: 'am', 1: 'pm' } }, options);
  if (opts.military) {
    return padTime(hour) + ':' + padTime(min) + '}';
  } else {
    var h = hour % 12;
    if (h == 0) h = 12;
    var p = opts.periodFmt[Math.floor(hour / 12)] || "";
    return (opts.zeroPad ? padTime(h) : h) + ':' + padTime(min) + p;
  }
}

function padTime(value) {
  return value < 10 ? '0' + value : '' + value;
}

var shortFormat = {
  dayFmt: 'short',
  separator: ' - ',
  periodFmt: { 0: 'a', 1: 'p' }
};

var abbrFormat = {
  dayFmt: 'abbr',
  periodFmt: { 0: 'am', 1: 'pm' }
};

exports.default = { parse: parse, format: format };