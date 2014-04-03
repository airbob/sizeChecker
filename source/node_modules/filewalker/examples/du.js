
var started = Date.now();

var filewalker = require('..');

var options = {
  maxPending: -1,
  maxAttempts: 3,
  attemptTimeout: 3000,
  // matchRegExp: /\.(log)$/,
  // matchRegExp: /\.(json)|(md)$/,
};

filewalker('/', options)
  .on('error', function(err) {
    console.error(err);
  })
  .on('retry', function(func, args, err, r, scope) {
    console.log('retry %d / %d %s', r.attempts+1, r.max, args[0]);
  })
  .on('done', function() {
    var duration = Date.now()-started;
    console.log('%d ms', duration);
    console.log('%d dirs, %d files, %d bytes, %d errors', this.dirs, this.files, this.bytes, this.errors);
  })
.walk();
