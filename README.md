## sizeChecker 
---
A file size checker application made by [node-webkit](https://github.com/rogerwang/node-webkit), fully support of Linux/Windows/Mac

### Download links for different OS
* [Linux](http://airbob.github.io/download/sizeChecker-linux.tar.gz)
* [Windows](http://airbob.github.io/download/sizeChecker-win.zip)
* [Mac](http://airbob.github.io/download/sizeChecker-mac.tar.gz)

### How to run
* Linux
````
tar -zxvf sizeChecker-linux.tar.gz
cd sizeChecker
double click sizeChecker
````
Please refer to this [instruction](http://www.exponential.io/blog/install-node-webkit-on-ubuntu-linux) if encounter ```libudev.so.0 error```

### Brief walk through
##### step1: select folder to do the check
![screenshot](screenshot/step1.png)
##### step2: wait for processing if folder contains lots files 
![screenshot](screenshot/step2.png)
##### step3: hover on different color blocks to check detailed information  
![screenshot](screenshot/step3.png)
##### step4: right click to redo the selection or export the file size result as a .csv file 
![screenshot](screenshot/step4.png)

### features
* display foder/file sizes by different color blocks
* hover block to display detailed information (folder/file name, size)
* export sizeChecker results to csv file (all files size info within selected directory)


### node modules used
* [filewalker](https://www.npmjs.org/package/filewalker)
* [json2csv](https://www.npmjs.org/package/json2csv) 

### MIT license
Copyright (c) 2014 air.chenboATgmail.com;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
