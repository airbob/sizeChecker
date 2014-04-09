
var started = Date.now();

var createHash = require('crypto').createHash,
    filewalker = require('..');

var options = {
  maxPending: 10, // throttle handles
};

filewalker('/', options)
  .on('stream', function(rs, p, s, fullPath) {
    var hash = createHash('md5');
    rs.on('data', function(data) {
      hash.update(data);
    });
    rs.on('end', function(data) {
      console.log(hash.digest('hex'), ('                '+s.size).slice(-16), p);
    });
  })
  .on('error', function(err) {
    console.error(err);
  })
  .on('done', function() {
    var duration = Date.now()-started;
    console.log('%d ms', duration);
    console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
  })
.walk();
