
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    FunctionQueue = require('..');

function Diskusage(options) {
  FunctionQueue.call(this, options);
  this.dirs = 0;
  this.files = 0;
  this.bytes = 0;
}
util.inherits(Diskusage, FunctionQueue);

Diskusage.prototype.run = function(dir) {
  this.start(this._stat, [dir]);
  return this;
};

Diskusage.prototype._readdir = function(p) {
  var self = this, args = arguments;
  
  fs.readdir(p, function(err, files) {
    if(err) {
      self.error(err, self._readdir, args);
    } else {
      files.forEach(function(file) {
        self.enqueue(self._stat, [path.join(p, file)]);
      });
    }
    self.done();
  });
};

Diskusage.prototype._stat = function(p) {
  var self = this, args = arguments;
  
  fs.stat(p, function(err, s) {
    if(err) {
      self.error(err, self._stat, args);
    } else {
      if(s.isDirectory()) {
        self.dirs += 1;
        self.enqueue(self._readdir, [p]);
      } else {
        self.files += 1;
        self.bytes += s.size;
      }
    }
    self.done();
  });
};

// Runtime

new Diskusage()
  .on('error', function(err) {
    console.log('error:', err);
  })
  .on('retry', function(func, args) {
    console.log('retry:', args[0]);
  })
  .on('done', function() {
    console.log('');
    console.log('diskusage: %d bytes in %d dirs and %d files.', this.bytes, this.dirs, this.files);
    console.log('           %d unreadable paths.', this.errors);
  })
.run('.');


