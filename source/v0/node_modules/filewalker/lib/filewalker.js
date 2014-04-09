
module.exports = Filewalker;

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    FunctionQueue = require('fqueue');

var lstat = process.platform === 'win32' ? 'stat' : 'lstat';

function Filewalker(root, options) {
  if(!(this instanceof Filewalker)) return new Filewalker(root, options);
  
  FunctionQueue.call(this, options);
  
  var self = this;
  
  this.matchRegExp = null;
  
  this.recursive = true;
  
  options = options || {};
  Object.keys(options).forEach(function(k) {
    if(self.hasOwnProperty(k)) {
      self[k] = options[k];
    }
  });
  
  this.root = path.resolve(root||'.');
}
util.inherits(Filewalker, FunctionQueue);

Filewalker.prototype._path = function(p) {
  if(path.relative) {
    return path.relative(this.root, p).split('\\').join('/');
  } else {
    return p.substr(this.root.length).split('\\').join('/');
  }
};

Filewalker.prototype._emitDir = function(p, s, fullPath) {
  var self = this,
      args = arguments;
  
  this.dirs += 1;
  if(this.dirs) { // skip first directroy
    this.emit('dir', p, s, fullPath);
  }
  
  fs.readdir(fullPath, function(err, files) {
    if(err) {
      self.error(err, self._emitDir, args);
    } else if(self.recursive || !self.dirs) {
      files.forEach(function(file) {
        self.enqueue(self._stat, [path.join(fullPath, file)]);
      });
    }
    self.done();
  });
};

Filewalker.prototype._emitFile = function(p, s, fullPath) {
  var self = this;
  
  this.files += 1;
  this.bytes += s.size;
  this.emit('file', p, s, fullPath);
  
  if(this.listeners('stream').length !== 0) {
    this.enqueue(this._emitStream, [p, s, fullPath]);
  }
  
  process.nextTick(function() {
    self.done();
  });
};

Filewalker.prototype._emitStream = function(p, s, fullPath) {
  var self = this,
      args = arguments;
  
  this.open += 1;
  
  var rs = fs.ReadStream(fullPath);
  
  // retry on any error
  rs.on('error', function(err) {
    // handle "too many open files" error
    if(err.code == 'EMFILE' || (err.code == 'OK' && err.errno === 0)) {
      if(self.open-1>self.detectedMaxOpen) {
        self.detectedMaxOpen = self.open-1;
      }
      
      self.enqueue(self._emitStream, args);
    } else {
      self.error(err, self._emitStream, args);
    }
    
    self.open -= 1;
    self.done();
  });

  rs.on('close', function() {
    self.streamed += 1;
    self.open -= 1;
    self.done();
  });
  
  this.emit('stream', rs, p, s, fullPath);
  
};

Filewalker.prototype._stat = function(p) {
  var self = this,
      args = arguments;
  
  fs[lstat](p, function(err, s) {
    if(err) {
      self.error(err, self._stat, args);
    } else {
      self.total += 1;
      if(s.isDirectory()) {
        self.enqueue(self._emitDir, [self._path(p), s, p]);
      } else {
        if(!self.matchRegExp || self.matchRegExp.test(p)) {
          self.enqueue(self._emitFile, [self._path(p), s, p]);
        }
      }
    }
    self.done();
  });
};

Filewalker.prototype.walk = function() {
  this.dirs = -1;
  this.files = 0;
  this.total = -1;
  this.bytes = 0;
  
  this.streamed = 0;
  this.open = 0;
  this.detectedMaxOpen = -1;
  
  this.queue = [];
  
  this.start(this._stat, [this.root]);
  return this;
};
