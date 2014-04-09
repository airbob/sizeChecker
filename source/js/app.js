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
    var root = {"name": "root", "children": []};

    filewalker(inputPath,options)
        .on('dir', function(p) {
            //console.log('dir:  %s', p);
        })
        .on('file', function(p, s) {
            //console.log('file: %s, %d bytes and %s', p, s.size, bytesToSize(s.size));
            details.push({"name":p,"size":bytesToSize(s.size)});
            var sequence = p;
            var size = +s.size;
            var parts = sequence.split("/");
            var currentNode = root;
            for (var j = 0; j < parts.length; j++) {
                var children = currentNode["children"];
                var nodeName = parts[j];
                var childNode;
                if (j + 1 < parts.length) {
                    // Not yet at the end of the sequence; move down the tree.
                    var foundChild = false;
                    for (var k = 0; k < children.length; k++) {
                        if (children[k]["name"] == nodeName) {
                            childNode = children[k];
                            foundChild = true;
                            break;
                        }
                    }
                    // If we don't already have a child node for this branch, create it.
                    //var type = (nodeName.indexOf('.') > 0)?nodeName.split('.').pop():"dir";

                    if (!foundChild) {
                        childNode = {"name": nodeName, "type": "dir", "children": []};
                        children.push(childNode);
                    }
                    currentNode = childNode;
                } else {
                    // Reached the end of the sequence; create a leaf node.
                    var filetype = nodeName.split('.').pop();
                    if (filetype.length < 7) {
                        if (filetype in result) {
                            result[filetype] += size;
                        }
                        else {
                            result[filetype] = size;
                        }
                    }
                    childNode = {"name": nodeName, "type": filetype, "size": size};
                    children.push(childNode);
                }
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

            //console.log(JSON.stringify(root));
            //done
            $(".spinner").css("display", "none");
            $(".tabs").show();
            // Total size of all segments; we set this later, after loading the data.
            var totalSize = this.bytes;


            createChart1(root);
            var filetypeJSON = [];
            for (var x in result){
                var tempF = result[x]/totalSize;
                if (tempF < 0.001){continue;}
                var tempN = bytesToSize(result[x])+'/'+bytesToSize(totalSize);
                var temp = {filetype:x, "usage":tempF, "detail":tempN};
                filetypeJSON.push(temp);
            }
            createChart2(filetypeJSON);
        })
        .walk();
}


