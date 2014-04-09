Function Queue
==============

### In-memory, error handling (retry) function queue, with the ability to throttle simultaneous executions.

[![Build Status](https://secure.travis-ci.org/oleics/node-fqueue.png)](http://travis-ci.org/oleics/node-fqueue)

It is the distillate of [node-filewalker](https://github.com/oleics/node-filewalker)

### Installation

```npm install fqueue```

### Usage

Please have a look at the examples.

Class FunctionQueue
-------------------

Inherits from events.EventEmitter

### Options

```scope``` (default: this)

```maxPending``` (default: -1)  
Maximum asynchronous jobs.  
Useful to throttle the number of simultaneous disk-operations.

```maxAttempts``` (default: 3)  
Maximum reattempts on error.  
Set to 0 to disable reattempts.  
Set to -1 for infinite reattempts.

```attemptTimeout``` (default: 5000 ms)  
Minimum time to wait before reattempt. In milliseconds.  
Useful to let network-drives remount, etc.

### Properties

.scope  
.maxPending  
.maxAttempts  
.attemptTimeout

.running  
.paused  
.pending  
.dequeued  
.warnings  
.errors  
.attempts  
.queue

### Methods

this ```.start(func, args [, scope [, timeout]])```  
Starts the function-queue.

this ```.enqueue(func, args [, scope [, timeout]])```  
Enqueues a function for later execution.

this ```.done()```  
Tell the function-queue that the function has done execution.

this ```.error(err, func, args [, scope [, maxAttempts [, timeout]]])```  
Tell the function-queue about an error. This either initiates an  
reattempt or emits the 'error' event.  
*Notice:* You need to call ```.done()``` even if the function  
called ```.error([..])```.

#### General Methods

boolean ```.isEmpty()```  
Returns ```true``` if the queue is empty, otherwise ```false```

this ```.pause()```  
Pauses the execution of functions. Emits the 'pause' event after  
all pending functions completed.

this ```.resume()```  
Resumes the previously paused execution of functions. Immediately  
emits the 'resume' event.

### Events

pause  
resume  
done  
error err  
retry func, args, err, r, scope

## MIT License

Copyright (c) 2012 Oliver Leics <oliver.leics@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
