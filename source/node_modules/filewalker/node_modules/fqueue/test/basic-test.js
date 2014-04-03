
var assert = require('assert');
var fqueue = require('..');

function enqueueRandomErrors(calls, jq, cbOk) {
  function fn(cb) {
    var args = arguments;
    setTimeout(function() {
      if(Math.floor(Math.random()*100)%2 === 0) {
        cb(new Error(), args);
      } else {
        cb(null, args);
      }
    }, Math.floor(Math.random()*10));
  }
  for(var i=0; i<calls; i++) {
    jq.enqueue(fn, [function(err, args) {
      if(err) {
        jq.error(err, fn, args, jq);
      }
      err||cbOk();
      jq.done();
    }], jq);
  }
}

function enqueueFails(calls, jq, cbOk) {
  function fn(cb) {
    var args = arguments;
    setTimeout(function() {
      cb(new Error(), args);
    }, Math.floor(Math.random()*10));
  }
  for(var i=0; i<calls; i++) {
    jq.enqueue(fn, [function(err, args) {
      if(err) {
        jq.error(err, fn, args, jq);
      }
      err||cbOk();
      jq.done();
    }], jq);
  }
}

function enqueueSucceeds(calls, jq, cbOk) {
  function fn(cb) {
    var args = arguments;
    setTimeout(function() {
      cb(null, args);
    }, Math.floor(Math.random()*10));
  }
  for(var i=0; i<calls; i++) {
    jq.enqueue(fn, [function(err, args) {
      if(err) {
        jq.error(err, fn, args, jq);
      }
      err||cbOk();
      jq.done();
    }], jq);
  }
}

describe('FunctionQueue', function() {
  describe('Basics', function() {
    it('Exports one function', function() {
      assert.ok(fqueue instanceof Function);
    });
    it('That function creates an instances of a FunctionQueue-class', function() {
      assert.ok(fqueue() instanceof Object);
      assert.ok(fqueue() instanceof fqueue);
    });
  });
  
  describe('Instances of a FunctionQueue-class', function() {
    var jq;
    beforeEach(function() {
      jq = fqueue();
    });
    afterEach(function() {
      jq = null;
    });
    
    it('are instances of events.EventEmitter too', function() {
      assert.ok(jq instanceof require('events').EventEmitter);
    });
    
    // Properties
    it('should have a property .scope <object> this', function() {
      assert.ok(jq.scope!=null);
      assert.strictEqual(typeof jq.scope, 'object');
      assert.strictEqual(jq.scope, jq);
    });
    
    it('should have a property .maxPending <number> -1', function() {
      assert.ok(jq.maxPending!=null);
      assert.strictEqual(typeof jq.maxPending, 'number');
      assert.strictEqual(jq.maxPending, -1);
    });
    
    it('should have a property .maxAttempts <number> 3', function() {
      assert.ok(jq.maxAttempts!=null);
      assert.strictEqual(typeof jq.maxAttempts, 'number');
      assert.strictEqual(jq.maxAttempts, 3);
    });
    
    it('should have a property .attemptTimeout <number> 5000', function() {
      assert.ok(jq.attemptTimeout!=null);
      assert.strictEqual(typeof jq.attemptTimeout, 'number');
      assert.strictEqual(jq.attemptTimeout, 5000);
    });
    
    it('should have a property .running <boolean> false', function() {
      assert.ok(jq.running!=null);
      assert.strictEqual(typeof jq.running, 'boolean');
      assert.strictEqual(jq.running, false);
    });
    
    it('should have a property .paused <boolean> false', function() {
      assert.ok(jq.paused!=null);
      assert.strictEqual(typeof jq.paused, 'boolean');
      assert.strictEqual(jq.paused, false);
    });
    
    it('should have a property .pending <number> 0', function() {
      assert.ok(jq.pending!=null);
      assert.strictEqual(typeof jq.pending, 'number');
      assert.strictEqual(jq.pending, 0);
    });
    
    it('should have a property .dequeued <number> 0', function() {
      assert.ok(jq.dequeued!=null);
      assert.strictEqual(typeof jq.dequeued, 'number');
      assert.strictEqual(jq.dequeued, 0);
    });
    
    it('should have a property .warnings <number> 0', function() {
      assert.ok(jq.warnings!=null);
      assert.strictEqual(typeof jq.warnings, 'number');
      assert.strictEqual(jq.warnings, 0);
    });
    
    it('should have a property .errors <number> 0', function() {
      assert.ok(jq.errors!=null);
      assert.strictEqual(typeof jq.errors, 'number');
      assert.strictEqual(jq.errors, 0);
    });
    
    it('should have a property .attempts <number> 0', function() {
      assert.ok(jq.attempts!=null);
      assert.strictEqual(typeof jq.attempts, 'number');
      assert.strictEqual(jq.attempts, 0);
    });
    
    it('should have a property .queue <array> []', function() {
      assert.ok(jq.queue!=null);
      assert.strictEqual(typeof jq.queue, 'object');
      assert.ok(jq.queue instanceof Array);
      assert.deepEqual(jq.queue, []);
    });
    
    // Methods
    it('should have a method .isEmpty()', function() {
      assert.ok(jq.isEmpty instanceof Function);
    });
    
    it('should have a method .start()', function() {
      assert.ok(jq.start instanceof Function);
    });
    
    it('should have a method .enqueue()', function() {
      assert.ok(jq.enqueue instanceof Function);
    });
    
    it('should have a method .error()', function() {
      assert.ok(jq.error instanceof Function);
    });
    
    it('should have a method .done()', function() {
      assert.ok(jq.done instanceof Function);
    });
    
    it('should have a method .pause()', function() {
      assert.ok(jq.pause instanceof Function);
    });
    
    it('should have a method .resume()', function() {
      assert.ok(jq.resume instanceof Function);
    });
    
    // 
    describe('Usage', function() {
      it('runs', function(done) {
        var calls = 100;
        var num = 0;
        var numOk = 0;
        var numErrors = 0;
        var numAttempts = 0;
        var numPause = 0;
        var numResume = 0;
        
        function fnOk() {
          numOk += 1;
        }
        
        enqueueRandomErrors(calls, jq, fnOk); num += calls;
        enqueueFails(calls, jq, fnOk); num += calls;
        enqueueSucceeds(calls, jq, fnOk); num += calls;
        
        jq.on('pause', function() {
          numPause += 1;
          setTimeout(function() {
            jq.resume();
          }, 1);
        });
        
        jq.on('resume', function() {
          numResume += 1;
          jq.pause();
        });
        
        jq.on('retry', function(err) {
          numAttempts += 1;
        });
        
        jq.on('error', function(err) {
          numErrors += 1;
        });
        
        jq.on('done', function() {
          // assert.strictEqual(num, 100);
          assert.strictEqual(jq.pending, 0);
          assert.strictEqual(jq.queue.length, 0);
          assert.strictEqual(jq.attempts, numAttempts);
          assert.strictEqual(jq.errors, numErrors);
          assert.strictEqual(jq.errors, num-numOk);
          assert.strictEqual(numPause-numResume, 1);
          // console.log('calls %d, num %d, numOk %d, numErrors %d, numAttempts %d, numPause %d, numResume %d', calls, num, numOk, numErrors, numAttempts, numPause, numResume);
          // console.log(jq);
          done();
        });
        
        jq.maxPending = calls;
        jq.maxAttempts = 3;
        jq.attemptTimeout = 5;
        jq._dequeue();
        jq.pause();
      });
    });
    
    
  });
});
