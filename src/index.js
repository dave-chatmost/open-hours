const MINS_PER_WEEK = 60*24*7
const MINS_PER_DAY = 60*24
const MINS_PER_HOUR = 60

const START = 'start'
const END = 'end'

const DAYS_OF_WEEK = {
  0: {name: 'Monday', abbr: 'Mon', short: 'M'},
  1: {name: 'Tuesday', abbr: 'Tue', short: 'Tu'},
  2: {name: 'Wednesday', abbr: 'Wed', short: 'W'},
  3: {name: 'Thursday', abbr: 'Thu', short: 'Th'},
  4: {name: 'Fridday', abbr: 'Fri', short: 'F'},
  5: {name: 'Saturday', abbr: 'Sat', short: 'Sa'},
  6: {name: 'Sunday', abbr: 'Sun', short: 'Su'}
}

class OpenHours {
  constructor(args) {
    let {start, end} = args
    if (Array.isArray(args)) {
      start = args[0]
      end = args[1]
    }

    this.start = parseMinutes(start)
    this.end = parseMinutes(end)
  }

  format(options) {
    let opts = {dayFmt: 'name', separator: ' to ', ...options}

    return `${DAYS_OF_WEEK[this.start.day][opts.dayFmt]} ${formatTime(this.start.hour, this.start.mins, opts)}${opts.separator}${(this.end.minutes - this.start.minutes >= MINS_PER_DAY) ? DAYS_OF_WEEK[this.end.day][opts.dayFmt]+" " : ""}${formatTime(this.end.hour, this.end.mins, opts)}`
  }
}

function parseMinutes(minutes) {
  minutes = minutes % MINS_PER_WEEK
  const day = Math.floor((minutes % MINS_PER_WEEK)/MINS_PER_DAY)
  const hour = Math.floor((minutes % MINS_PER_DAY) / MINS_PER_HOUR)
  const mins = (minutes % MINS_PER_HOUR)
  return {day, hour, mins, minutes}
}

function parse(args) {
  if (Array.isArray(args) && isNaN(args[0])) {
    return args.map((e) => (parse(e))).sort((a,b)=>(a.minutes - b.minutes))
  } else {
    return new OpenHours(args)
  }
}

function format(oh, options) {
  const opts = {dayFmt: 'name', separator: ' to ', ...options}

  if (Array.isArray(oh)) {
    return oh.map((h) => h.format(opts))
  } else {
    return oh.format(opts)
  }
}

function formatTime(hour, min, options) {
  const opts = {military: false, periodFmt: {0: 'am', 1: 'pm'}, ...options}
  if (opts.military) {
    return `${padTime(hour)}:${padTime(min)}}`
  } else {
    let h = hour % 12
    if (h == 0) h = 12
    const p = opts.periodFmt[Math.floor(hour / 12)] || ""
    return `${opts.zeroPad ? padTime(h) : h}:${padTime(min)}${p}`
  }
}

function padTime(value) {
  return (value < 10) ? `0${value}` : `${value}`
}

const shortFormat = {
  dayFmt: 'short',
  separator: ' - ',
  periodFmt: {0: 'a', 1: 'p'}
}

const abbrFormat = {
  dayFmt: 'abbr',
  periodFmt: {0: 'am', 1: 'pm'}
}


export default {parse, format}
