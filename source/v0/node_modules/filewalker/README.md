
Node Filewalker
===============

### Fast and rock-solid asynchronous traversing of directories and files for node.js

[![Build Status](https://secure.travis-ci.org/oleics/node-filewalker.png)](http://travis-ci.org/oleics/node-filewalker)

The filewalker-module for node is designed to provide maximum  
reliance paired with maximum throughput/performance and the  
ability to throttle that throughput/performance.

### Installation

```npm install filewalker```

### Run the tests

```sh
$ npm test
```

### Usage

Simple directory listing and disk-usage report:

```js
var filewalker = require('filewalker');

filewalker('.')
  .on('dir', function(p) {
    console.log('dir:  %s', p);
  })
  .on('file', function(p, s) {
    console.log('file: %s, %d bytes', p, s.size);
  })
  .on('error', function(err) {
    console.error(err);
  })
  .on('done', function() {
    console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);
  })
.walk();
```

Calculate md5-hash for every file:

```js
var started = Date.now();

var createHash = require('crypto').createHash,
    filewalker = require('./lib/filewalker');

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
```

Class Filewalker
----------------

Inherits from [node-fqueue](https://github.com/oleics/node-fqueue)

### Options

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

```matchRegExp``` (default: null)  
A RegExp-instance the path to a file must match in order to  
emit a "file" event. Set to ```null``` to emit all paths.

```recursive``` (default: true)  
Traverse in a recursive manner.  
In case you wish to target only the current directory,  
disable this.

### Properties

maxPending  
maxAttempts  
attemptTimeout  
matchRegExp

pending  
dirs  
files  
total  
bytes  
errors  
attempts  
streamed  
open  
detectedMaxOpen

### Methods

walk()  
pause()  
resume()

### Events

* file
  * relative path
  * fs.Stats instance
  * absolute path
* dir
  * relative path
  * fs.Stats instance
  * absolute path
* stream
  * fs.ReadStream instance
  * relative path
  * fs.Stats instance
  * absolute path
* pause
* resume
* done
* error
  * instance of Error

Notice: There will be no fs.ReadStream created if no listener  
listens to the 'stream'-event.

MIT License
-----------

Copyright (c) Oliver Leics <oliver.leics@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
