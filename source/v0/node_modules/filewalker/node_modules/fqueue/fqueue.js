
module.exports = FunctionQueue;

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var debug = false;

function JobQueueReattempt(max, timeout) {
  this.max = isNaN(max) ? 3 : max;
  this.timeout = isNaN(timeout) ? 0 : timeout;
  this.attempts = 0;
}

function FunctionQueue(options) {
  if(!(this instanceof FunctionQueue)) return new FunctionQueue(options);
  
  var self = this;
  
  this.scope = this;
  this.maxPending = -1;
  this.maxAttempts = 3;
  this.attemptTimeout = 5000;
  
  options = options || {};
  Object.keys(options).forEach(function(k) {
    if(self.hasOwnProperty(k)) {
      self[k] = options[k];
    }
  });
  
  this._reset();
}
util.inherits(FunctionQueue, EventEmitter);

FunctionQueue.prototype._reset = function() {
  this.running = false;
  this.paused = false;
  this.pending = 0;
  this.dequeued = 0;
  this.warnings = 0;
  this.errors = 0;
  this.attempts = 0;
  this.queue = [];
  return this;
};

FunctionQueue.prototype.isEmpty = function() {
  if(this.queue.length) {
    return false;
  } else {
    return true;
  }
};

FunctionQueue.prototype.error = function(err, func, args, scope, maxAttempts, timeout) {
  debug&&console.log('error', func);
  var r;
  if(args[args.length-1] instanceof JobQueueReattempt) {
    r = args[args.length-1];
    r.attempts += 1;
  } else {
    this.warnings += 1;
    r = new JobQueueReattempt(
      maxAttempts != null ? maxAttempts : this.maxAttempts,
      timeout != null ? timeout : this.attemptTimeout
    );
    args = Array.prototype.slice.call(args, 0);
    args.push(r);
  }
  if(r.attempts === r.max) {
    this.warnings -= 1;
    this.errors += 1;
    this.emit('error', err);
  } else {
    this.attempts += 1;
    this.emit('retry', func, args, err, r, scope);
    this.enqueue(func, args, scope, r.timeout);
  }
  return this;
};

FunctionQueue.prototype.start = function(func, args, scope, timeout) {
  if(this.running) {
    throw new Error('Can not start a running FunctionQueue.');
  }
  this._reset();
  this.running = true;
  this.enqueue(func, args, scope, timeout);
  this._dequeue();
  return this;
};

FunctionQueue.prototype.enqueue = function(func, args, scope, timeout) {
  debug&&console.log('enqueue', func);
  if(timeout) {
    this.queue.push([this._timeout, this, [timeout, func, scope, args]]);
  } else {
    if(typeof func === 'string') { func = (scope||this.scope)[func]; }
    this.queue.push([func, scope||this.scope, args]);
  }
  return this;
};

FunctionQueue.prototype._timeout = function(timeout, func, scope, args) {
  debug&&console.log('_timeout', timeout, func);
  var self = this;
  setTimeout(function() {
    self.enqueue(func, args, scope);
    self.done();
  }, timeout);
};

FunctionQueue.prototype._dequeue = function() {
  debug&&console.log('_dequeue');
  if(this.paused) {
    return;
  }
  
  while(this.maxPending <= 0 || this.pending < this.maxPending) {
    var item = this.queue.shift();
    if(item) {
      this.pending += 1;
      this.dequeued += 1;
      item[0].apply(item[1], item[2]);
    } else {
      break;
    }
  }
};

FunctionQueue.prototype.done = function() {
  debug&&console.log('done');
  this.pending -= 1;
  
  if(this.isEmpty() === false && (this.maxPending <= 0 || this.pending < this.maxPending)) {
    this._dequeue();
  }
  
  if(this.pending === 0) {
    if(this.paused) {
      this.emit('pause');
    } else {
      this.running = false;
      this.emit('done');
    }
  }
  return this;
};

FunctionQueue.prototype.pause = function() {
  this.paused = true;
  return this;
};

FunctionQueue.prototype.resume = function() {
  if(this.paused) {
    this.paused = false;
    if(this.isEmpty()) {
      this.pending = 1;
      this.done();
    } else {
      this._dequeue();
      this.emit('resume');
    }
  }
  return this;
};
