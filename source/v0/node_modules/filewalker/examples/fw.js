
var started = Date.now();

var assert = require('assert');

var filewalker = require('..');

var options = {
  maxPending: -1,
  maxAttempts: 3,
  attemptTimeout: 3000,
  // matchRegExp: /\.(log)$/,
  // matchRegExp: /\.(json)|(md)$/,
};

// var fw = filewalker('./test/examples', options);
// var fw = filewalker('.', options);
// var fw = filewalker('..', options);
// var fw = filewalker('../..', options);
var fw = filewalker('/', options);
// var fw = filewalker('c:/', options);

fw.on('dir', function(p, s, fullPath) {
  process.stdout.write('*');
  // process.stdout.write('\n');
  // console.log('dir     ', p);
});

fw.on('file', function(p, s, fullPath) {
  process.stdout.write('.');
  // process.stdout.write('\n');
  // console.log('file    ', p);
});

fw.on('stream', function(rs, p, s, fullPath) {
  process.stdout.write('~');
  // process.stdout.write('\n');
  // console.log(('                '+thousandSeparator(s.size)).slice(-16), p);
});/*  */

fw.on('error', function(err) {
  // process.stdout.write('-');
  process.stdout.write('\n');
  // console.error('ERROR: FW', err.stack||err);
  console.log('error   ', err);
});

fw.on('pause', function() {
  process.stdout.write('P');
  // process.stdout.write('\n');
  // console.log('PAUSE');
  // console.log('%d pending', this.pending);
  // console.log('%d queue-length', this.queue.length);
  
  // process.stdout.write('\n');
  // var duration = Date.now()-started;
  // console.log(formatDuration(duration));
  
  fw.resume();
  
  // setTimeout(function() {
    // fw.resume();
  // }, 1000);
});

fw.on('resume', function() {
  process.stdout.write('R');
  // process.stdout.write('\n');
  // console.log('RESUME');
  
  // process.stdout.write('\n');
  // var duration = Date.now()-started;
  // console.log(formatDuration(duration));
  
  fw.pause();
  
  // setTimeout(function() {
    // fw.pause();
  // }, 3000);
});

fw.on('done', function() {
  process.stdout.write('\n');
  console.log('DONE');
  
  process.stdout.write('\n');
  var duration = Date.now()-started;
  console.log(formatDuration(duration));
  
  // console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
  
  // console.log(fw);
  process.stdout.write('\n');
  console.log('%s', fw.root);
  process.stdout.write('\n');
  console.log('%s pending', formatInt(fw.pending));
  console.log('%s dirs', formatInt(fw.dirs));
  console.log('%s files', formatInt(fw.files));
  console.log('%s total', formatInt(fw.total));
  console.log('%s bytes', formatInt(fw.bytes));
  console.log('%s errors', formatInt(fw.errors));
  process.stdout.write('\n');
  console.log('%s streamed', formatInt(fw.streamed));
  console.log('%s detectedMaxOpen', formatInt(fw.detectedMaxOpen));
  console.log('%s attempts', formatInt(fw.attempts));
  
  process.stdout.write('\n');
  console.dir(fw);
  
  process.stdout.write('\n');
  assert.ok(fw.pending === 0);
  assert.ok(fw.open === 0);
  assert.ok(fw.queue.length === 0);
  
});

fw.walk();
// fw.pause();

process.on('exit', function() {
});

/* 
setInterval(function() {
  console.dir(fw);
}, 1000);
 */

function formatDuration(ms) {
  var h = 0;
  var m = 0;
  var s = 0;
  if(ms>1000) {
    s = Math.floor(ms/1000);
    ms = ms - s * 1000;
    if(s>60) {
      m = Math.floor(s/60);
      s = s - m * 60;
      if(m>60) {
        h = Math.floor(m/60);
        m = m - h * 60;
      }
    }
  }
  return ('00'+h).slice(-2)
          +':'+('00'+m).slice(-2)
          +':'+('00'+s).slice(-2)
          +'.'+(ms+'    ').slice(0,4);
}

function formatInt(n) {
  n = thousandSeparator(n);
  return ('                '+n).slice(-16);
}

function thousandSeparator(n,sep) {
  var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'),
  sValue=n+'';

  if (sep === undefined) {sep=',';}
  while(sRegExp.test(sValue)) {
    sValue = sValue.replace(sRegExp, '$1'+sep+'$2');
  }
  return sValue;
}
