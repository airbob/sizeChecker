
// begins first chart, modified, credit goes to kerryrodden from https://gist.github.com/kerryrodden/7090426,
var width = 750;
var height = 500;
var radius = Math.min(width, height) / 2;
var result = {};
var overallSize = 0;
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};
// Mapping of file formats to colors, in beta version I tried random color for files, but it looks not that good.
var colors = {
    "dir": "#5687d1",
    /*pictures same color*/
    "jpeg":"#9b59b6",
    "jpg":"#9b59b6",
    "png":"#9b59b6",
    "gif":"#9b59b6",
    "psd":"#9b59b6",
    /*audios same color*/
    "mp3":"#3498db",
    "wav":"#3498db",
    "wma":"#3498db",
    /*videos same color*/
    "wmv":"#2ecc71",
    "3gp":"#2ecc71",
    "mp4":"#2ecc71",
    "plv":"#2ecc71",
    "mpg":"#2ecc71",
    "mpeg":"#2ecc71",
    "mkv":"#2ecc71",
    "rm":"#2ecc71",
    "rmvb":"#2ecc71",
    "mov":"#2ecc71",
    /*office products same color*/
    "doc":"#1abc9c",
    "xls":"#1abc9c",
    "ppt":"#1abc9c",
    "docx":"#1abc9c",
    "xlsx":"#1abc9c",
    "pptx":"#1abc9c",
    /*mac products same color*/
    "pages":"#e74c3c",
    "key":"#e74c3c",
    "numbers":"#e74c3c",

    "pdf": "#7b615c",
    "epub": "#7b615c",
    /*programming langs*/
    "c":"#f1c40f",
    "cpp":"#f1c40f",
    "h":"#f1c40f",
    "html":"#f1c40f",
    "js":"#f1c40f",
    "css":"#f1c40f",
    "pl":"#f1c40f",
    "py":"#f1c40f",
    "php":"#f1c40f",
    "sql":"#f1c40f",
    "csv":"#de783b",
    "odp":"#de783b",
    /*zip files*/
    "gz":"#6ab975",
    "tar":"#6ab975",
    "rar":"#6ab975",
    "zip":"#6ab975",
    "7z":"#6ab975",
    "default": "#34495e"
};

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart1").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("data/result.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(csv);
  createChart1(json);
    var filetypeJSON = [];
    for (var x in result){
        var tempF = result[x]/overallSize;
        if (tempF < 0.001){continue;}
        var tempN = bytesToSize(result[x])+'/'+bytesToSize(overallSize);
        var temp = {filetype:x, "usage":tempF, "detail":tempN};
        filetypeJSON.push(temp);
    }
    createChart2(filetypeJSON);
});

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
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
        if (!foundChild) {
            childNode = {"name": nodeName, "type": "dir", "children": []};
            children.push(childNode);
        }
        currentNode = childNode;
      } else {
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
            overallSize += size;
            children.push(childNode);
      }
    }
  }
  return root;
};
// Main function to draw and set up the visualization, once we have the data.
function createChart1(json) {
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
        .filter(function(d) {
            return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) { return colors[d.type]?colors[d.type]:colors["default"]; })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node().__data__.value;
};

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
        percentageString = "< 0.1%";
    }
    var percentageDetail = bytesToSize(d.value) + '/' + bytesToSize(totalSize);

    d3.select("#percentage")
        .text(percentageString);
    d3.select("#percentageDetail")
        .text(percentageDetail);

    d3.select("#explanation")
        .style("visibility", "");

    var sequenceArray = getAncestors(d);
    //updateBreadcrumbs(sequenceArray, percentageString);
    var arrayLength = sequenceArray.length;
    var htmlString = '';
    //$("#sequence2").html(htmlString);
    for (var i = 0; i < arrayLength; i++) {
        var nodeType = sequenceArray[i].type;
        if (nodeType == 'dir'){
            htmlString+='<span style="color:'+colors[nodeType]+'">' + sequenceArray[i].name +'/</span>';
        }
        else {
            htmlString+='<span style="color:'+colors[nodeType]+'">' + sequenceArray[i].name +'</span>';
        }
        //Do something
    }
    //htmlString+= '&nbsp &nbsp &nbsp &nbsp <b>'+percentageString + '</b>';
    $("#detailInfo").html(htmlString);


    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .each("end", function() {
            d3.select(this).on("mouseover", mouseover);
        });

    d3.select("#explanation")
        .transition()
        .duration(1000)
        .style("visibility", "hidden");
    $("#detailInfo").html("");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current);
        current = current.parent;
    }
    return path;
}


/* begins chart2,modified, credit goes to G3n1k http://g3n1k.wordpress.com/2014/01/28/bar-chart-complete-code-d3-js/ */

var margin = {top: 20, right: 20, bottom: 30, left: 40};
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select("#chart2")
    .attr("width", width + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
function createChart2(inputJson) {

    var data = inputJson;
    x.domain(inputJson.map(function(d) {return d.filetype; }));

    y.domain([0, d3.max(inputJson, function(d) { return d.usage; })]);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".bar")
        .data(inputJson)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return 'bar'+d.filetype;})
        .attr("x", function(d) { return x(d.filetype); })
        .attr("y", function(d) { return y(d.usage); })
        .attr("height", function(d) { return height - y(d.usage); })
        .attr("width", x.rangeBand())
        .attr("fill", function(d) { return colors[d.filetype]?colors[d.filetype]:colors["default"]; })
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(50)
                .attr("fill", "#7f8c8d");

//Get this bar's x/y values, then augment for the tooltip
            var xPosition = parseFloat(d3.select(this).attr("x")) + x.rangeBand() / 2;
            var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

            var usageString = parseFloat(d.usage * 100).toFixed(2) + '%('+ d.filetype +')';
//Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#chart2Per2")
                .text(d.detail);

            d3.select("#chart2Per1")
                .text(usageString);

//Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })

        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .delay(100)
                .duration(250)
                .attr("fill", function(d) { return colors[d.filetype]?colors[d.filetype]:colors["default"]; })

//Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);

        });
}

