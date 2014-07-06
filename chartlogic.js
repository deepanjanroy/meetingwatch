// Dimensions
// TODO: Investigate using the css margin property instead of this bullshit
var margin = { left: 50, right: 20, top: 20, bottom: 30};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Scales; domains TBD
var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.time.scale()
    .range([0,width]);

// Axes

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Placing charts: Add svg elm, and a g in inside it
var chart = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Async call to data.tsv
d3.tsv("data.tsv", function(error, data){
  if (error != null) {
    alert("Something terrible happened: error on console.");
    console.log(error);
    return;
  }

  data.forEach(function(d) {
    d.date = +d.date;
    d.value = +d.value;
  });

  // Setting domain
  x.domain([20, d3.max(data, function(d) { return d.date; })]);
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  // Adding axes
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".dataPoint")
      .data(data)
    .enter().append("circle")
      .attr("cx", function(d) { return x(d.date);})
      .attr("cy", function(d) { return y(d.value);})
      .attr("r", "4")
      .attr("fill", "steelblue");

  chart.selectAll(".newPoint")
      .data([{date: 26, value: 0}])
    .enter().append("circle")
      .attr("class", "newPoint")
      .attr("id", "newPointId")
      .attr("cx", function(d) { return x(d.date);})
      .attr("cy", function(d) { return y(d.value);})
      .attr("r", "4")
      // .attr("fill", "steelblue");


  var motion_interval = 10; //ms
  setInterval(function() {
    var elm = document.getElementById("newPointId");
    var new_cy = y(y.invert(elm.getAttribute("cy")) + motion_interval / 1000);
    elm.setAttribute("cy", new_cy);
  }, motion_interval);

  var colors = ["steelblue", "red"];
  var radius = ["4", "6"];
  var colindex = 0;

  function transy() {
      colindex = ( colindex + 1 ) % 2;
      var color = colors[colindex];
      var r = radius[colindex];
      var elm = d3.select("g .newPoint");
      elm.transition()
          .duration(500)
          // .ease("linear")
          .style("fill", color)
          .attr("r", r);
      // console.log("hello");
  }

  setInterval(transy, 500);

});
