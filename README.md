## sizeChecker 
---
A file size checker application made by [node-webkit](https://github.com/rogerwang/node-webkit), fully support of Linux/Windows/Mac

### Download links for different OS
* [Linux](http://airbob.github.io/download/sizeChecker-linux.tar.gz)
* [Windows](http://airbob.github.io/download/sizeChecker-win.zip)
* [Mac](http://airbob.github.io/download/sizeChecker-mac.tar.gz)

### How to run
* Linux
````bash
tar -zxvf sizeChecker-linux.tar.gz
cd sizeChecker
double click sizeChecker to run
````
Please refer to this [instruction](http://www.exponential.io/blog/install-node-webkit-on-ubuntu-linux) if encounter ```libudev.so.0 error``` problem on ubuntu
* windows
````
unzip sizeChecker-win.zip
double click sizeChecker.exe to run
````
* mac
````bash
tar -zxvf sizeChecker-mac.tar.gz
double click sizeChecker.app to run
````
Please right click sizeChecker.app and select open to run sizeChecker if you encounter 'an unidentified developer' problem

### Features
##### overall: select folder to do the file size usage check
![screenshot](screenshot/overall.png)
##### hover to check corresponding percentages 
![screenshot](screenshot/overall-hover.png)
##### click by Type to check the usage report by file types
![screenshot](screenshot/bytype.png)
##### right click to export all file sizes report to a csv


### change history
[log.md](log.md)

### Thanks
* [node-webkit](https://github.com/rogerwang/node-webkit)
* [d3.js](http://d3js.org/)
* [filewalker](https://www.npmjs.org/package/filewalker)
* [json2csv](https://www.npmjs.org/package/json2csv) 
* [kerryrodden's gist](https://gist.github.com/kerryrodden/7090426)
* [G3n1k's blog](http://g3n1k.wordpress.com/2014/01/28/bar-chart-complete-code-d3-js/)
* [disc inventory x](http://www.derlien.com/)

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
