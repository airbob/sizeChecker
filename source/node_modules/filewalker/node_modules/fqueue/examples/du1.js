
var fs = require('fs'),
    path = require('path'),
    FunctionQueue = require('..');

function Diskusage(p, cb, options) {
  var self = this;
  
  var fqueue = new FunctionQueue(options);
  var dirs = 0;
  var files = 0;
  var bytes = 0;
  
  function readdir(p) {
    var args = arguments;
    
    fs.readdir(p, function(err, files) {
      if(err) {
        fqueue.error(err, readdir, args);
      } else {
        files.forEach(function(file) {
          fqueue.enqueue(stat, [path.join(p, file)]);
        });
      }
      fqueue.done();
    });
  }
  
  function stat(p) {
    var args = arguments;
    
    fs.stat(p, function(err, s) {
      if(err) {
        fqueue.error(err, stat, args);
      } else {
        if(s.isDirectory()) {
          dirs += 1;
          fqueue.enqueue(readdir, [p]);
        } else {
          files += 1;
          bytes += s.size;
        }
      }
      fqueue.done();
    });
  }
  
  fqueue.on('error', function(err) {
    console.log('error:', err);
  });
  
  fqueue.on('retry', function(func, args) {
    console.log('retry:', args[0]);
  });
  
  fqueue.on('done', function() {
    cb(bytes, dirs, files, fqueue.errors);
  });
  
  fqueue.start(stat, [p], this);
}

// Runtime

Diskusage('.', function(bytes, dirs, files, errors) {
  console.log('');
  console.log('diskusage: %d bytes in %d dirs and %d files.', bytes, dirs, files);
  console.log('           %d unreadable paths.', errors);
});
