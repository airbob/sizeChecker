var gui = require('nw.gui');
gui.Window.get().show();

var menu2 = new gui.Menu();
menu2.append(new gui.MenuItem({ label: 'Re-select' }));
menu2.append(new gui.MenuItem({ label: 'Export Result' }));
menu2.append(new gui.MenuItem({ type: 'separator' }));
var info_item = new gui.MenuItem({ label: 'Project Page' });
menu2.append(info_item);
var bodyElems = document . getElementsByTagName( "body" ) ; 
var body = bodyElems[ 0 ] ;
function reSelect() {
    location.reload();
   $(".spinner").css("display", "none");
    //var htmlString = '<div id="sequence"></div><div id="chart"><div id="explanation" style="visibility: hidden;"><span id="percentage"></span><br/>of visits begin with this sequence of pages</div></div>';
    //$("#main").html(htmlString);
    $(".tabs").hide();
    $(".selectFolder").css("display", "block");
   document.title = 'size checker';
}

function exportReport(){
  if(!details.length) { alert('result empty, please select a folder to do analysis first!');
  return;}
    LZADialog.saveFileAs({filename:'result.csv'}, function(file){
            var fs = require('fs')
            var json2csv = require('json2csv');
            json2csv({data: details, fields: ['name', 'size']}, function(err, csv) {
              if (err) console.log(err);
              fs.writeFile(file.path, csv, function(err) {
                if (err) throw err;
                console.log('file saved');
              });
            });
        }
    );
}

function projectPage() {
   gui.Shell.openExternal("https://github.com/airbob/sizeChecker")
}
menu2.items[0].click = reSelect;
menu2.items[1].click = exportReport;
menu2.items[3].click = projectPage;

body.addEventListener('contextmenu', function(ev) { 
  ev.preventDefault();
  menu2.popup(ev.x, ev.y);
  return false;
});


