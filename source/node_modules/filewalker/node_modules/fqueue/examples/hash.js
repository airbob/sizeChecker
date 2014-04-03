
var started = Date.now();

var path = require('path'),
    fs = require('fs'),
    createHash = require('crypto').createHash,
    HASH_ALGO = 'md5',
    fqueue = require('..')({
      maxPending: 1
    });
    dirs = 0,
    files = 0,
    bytes = 0,
    hashstack = {};

fqueue.on('error', function(err) {
  console.log('error:', err);
});

fqueue.on('retry', function(func, args) {
  console.log('retry:', args[0]);
});

fqueue.on('done', function() {
  console.log('');
  var duration = Date.now()-started;
  console.log('%d ms', duration);
  console.log('%d dirs, %d files, %d bytes, %d errors', dirs, files, bytes, this.errors);
  
  var hash = createHash(HASH_ALGO),
      keys = Object.keys(hashstack);
  keys.sort();
  keys.forEach(function(p) {
    hash.update(hashstack[p]);
  });
  console.log('');
  console.log(hash.digest('hex'));
});

fqueue.start(stat, ['.']);

function readfile(p, s) {
  var args = arguments,
      rs, hash = createHash(HASH_ALGO);
  rs = fs.createReadStream(p)
    .on('error', function(err) {
      fqueue.error(err, readfile, args);
      fqueue.done();
    })
    .on('data', function(data) {
      hash.update(data);
    })
    rs.on('end', function(data) {
      hash = hash.digest('binary');
      hashstack[p] = hash;
      // console.log(new Buffer(hash, 'binary').toString('hex'), ('                '+s.size).slice(-16), p);
      console.log(new Buffer(hash, 'binary').toString('hex'), p);
    })
    rs.on('close', function(data) {
      fqueue.done();
    })
  ;
}

function readdir(p, s) {
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
        fqueue.enqueue(readdir, [p, s]);
      } else {
        files += 1;
        bytes += s.size;
        fqueue.enqueue(readfile, [p, s]);
      }
    }
    fqueue.done();
  });
}
