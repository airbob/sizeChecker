var filewalker = require('filewalker');
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i]; 
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

var result = {};
var details = [];  //save as json file
function scan(inputPath) {
  /* reset result */
  result = {};
  details = [];
  var options = {
  maxPending: -1,
  maxAttempts: 3,
  attemptTimeout: 3000
  };

  //to show the animation
  document.title = 'size checker';
  $(".selectFolder").css("display", "none");
  $(".spinner").css("display", "block");
  
filewalker(inputPath,options)
  .on('dir', function(p) {
    //console.log('dir:  %s', p);
  })
  .on('file', function(p, s) {
    //console.log('file: %s, %d bytes and %s', p, s.size, bytesToSize(s.size));
    details.push({"name":p,"size":bytesToSize(s.size)});
    if (p.indexOf('/') > 0 ){
        if (result[p.substring(0,p.indexOf('/'))]){
            result[p.substring(0,p.indexOf('/'))] +=s.size
        }
        else {
            result[p.substring(0,p.indexOf('/'))] = s.size
        }
    }
    else {
            result[p] = s.size
    }
  })
  .on('error', function(err) {
    console.error(err);
  })
  .on('done', function() {
    console.log('%d dirs, %d files, %d bytes and %s', this.dirs, this.files, this.bytes, bytesToSize(this.bytes));
    var newTitle = this.dirs + ' dirs, '+ this.files + ' files, total size of ' + bytesToSize(this.bytes);
    document.title = newTitle;
    var totalSize = this.bytes;
    var index = 1;
    var preWidth = 100;
    var preHeight = 100;
    for (var x in result){
          var divPercent = result[x] / totalSize * 100 ;
          var divColor = (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5) ;
          var idName = '#'+index;
          if (index % 2 != 0){
            $(idName).append('<div id="' + (index+1) + '"style="float:left;width:'+ preWidth +'%;height:' + preHeight +'%; "><div class="usageblock" style="float:left;background-color:'+ divColor + '; width:' + divPercent +'%;height:100%" ><span style="display:none">' + x + ' &nbsp &nbsp <b>' + bytesToSize(result[x]) +'</b> </span></div></div>');
            preWidth = 100 - divPercent;
            preHeight = 100 ;
          }
          else {
            $(idName).append('<div id="' + (index+1) + '"style="float:right;width:'+ preWidth +'%;height:' + preHeight +'%; "><div  class="usageblock" style="float:right;background-color:'+ divColor + '; height:' + divPercent +'%;width:100%" ><span style="display:none">' + x +' &nbsp &nbsp <b>' + bytesToSize(result[x]) + '</b></span></div></div>');
            preHeight = 100 - divPercent;
            preWidth = 100 ;
          }
          index += 1;
          totalSize -= result[x];
    }
    
    //done 
    $(".spinner").css("display", "none");
    $(".usagesection").css("display", "block");
    $(".usageblock").hover(function(){
    var rhtml = $(this).find("span").html();
    $("#usageInfo").html(rhtml);
      });
  })
.walk();
}
