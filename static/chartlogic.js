// Dimensions
// TODO: Investigate using the css margin property instead of this bullshit
var margin = { left: 50, right: 20, top: 20, bottom: 30};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* Scales */
var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.scale.ordinal()
    .rangePoints([0,width], 0.5);

/* Axes */
var xAxis = d3.svg.axis()
    .scale(x)
    // .ticks(7) // Move this somewhere else
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

/* Chart frame */
var chart = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var date_parser = d3.time.format("%Y-%m-%d");
var n_data = {date: date_parser(new Date()), value: 0};


d3.xhr("/data", function(error, xreq){
  if (error != null) {
    alert("Something terrible happened: error on console.");
    console.log(error);
    return;
  }

  data = JSON.parse(xreq.response);

  data.forEach(function(d) {
    d.value = +d.value / 1000;
    // d.date = new date_parser.parse(d.date);
  });


  var add_data = function (d) {
    data.push(d);
    console.log(data);
    x.domain(data.map(function(d) {return d.date;}));

    d3.select("g.x.axis").transition().call(xAxis);

    chart.selectAll(".dataPoint", function(d) { return d.date; })
        .data(data)
      .enter().append("circle")
        .attr("class", "dataPoint")
        .attr("cx", function(d) { return x(d.date);})
        .attr("cy", function(d) { return y(d.value);})
        .attr("r", "4")
        .attr("fill", "steelblue");

    chart.selectAll("circle.dataPoint", function(d) { return d.date; })
        .transition()
        .attr("cx", function(d) { return x(d.date);})
        .attr("cy", function(d) { return y(d.value);})
        .attr("r", "4")
        .attr("fill", "steelblue");

  }

  function pulse_last_data() {
      colindex = ( colindex + 1 ) % 2;
      var color = colors[colindex];
      var r = radius[colindex];
      var dataPoints = chart.selectAll(".dataPoint")[0]
      var elm = d3.select(dataPoints.pop());

      elm.transition()
          .duration(500)
          .style("fill", color)
          .attr("r", r);
  }

  function stop_pulse (intervalID) {
    clearInterval(intervalID);

    var color = colors[0];
    var r = radius[0];
    var dataPoints = chart.selectAll(".dataPoint")[0]
    var elm = d3.select(dataPoints.pop());

    elm.transition()
        .duration(500)
        .ease("elastic")
        .style("fill", color)
        .attr("r", r);

  }

  x.domain(data.map(function (d) {return d.date;}));
  y.domain([0, Math.max(d3.max(data, function(d) { return d.value; }), 30*60)]);

  // Adding axes
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  yAxis.tickFormat(function(d) {
    seconds = d % 60;
    minutes = Math.floor(d / 60);
    return minutes + ":" + seconds;
  });

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".dataPoint", function(d) { return d.date.toDateString(); })
      .data(data)
    .enter().append("circle")
      .attr("class", "dataPoint")
      .attr("cx", function(d) { return x(d.date);})
      .attr("cy", function(d) { return y(d.value);})
      .attr("r", "4")
      .attr("fill", "steelblue");

  lineFunction = d3.svg.line()
                          .x(function(circ) { return +circ.getAttribute("cx"); })
                          .y(function(circ) { return +circ.getAttribute("cy"); })
                          .interpolate("linear");

  chart.insert("path", ":first-child")
        .attr("id", "thePath")
        .attr("d", lineFunction(d3.selectAll(".dataPoint")[0]))
        .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("fill", "none");



  var colors = ["steelblue", "red"];
  var radius = ["4", "6"];
  var colindex = 0;

  var update_new_point = function(miliseconds) {
    var elm = chart.selectAll(".dataPoint")[0].pop();
    if (elm === null) {
      return;
    }

    var seconds = miliseconds / 1000;
    var new_data = data[data.length - 1];
    new_data.value = seconds;
    elm.setAttribute("cy", y(new_data.value));

    d3.select("#thePath")
        .attr("d", lineFunction(d3.selectAll(".dataPoint")[0]));

  };

  var update_time_text = function(time_passed) {
    var t = parsedTime(time_passed);
    document.getElementById("timeMain").textContent = ""
        + twoDFormat(t.minutes) + ":" + twoDFormat(t.seconds);
    document.getElementById("timeMilis").textContent = "" + t.milisecs;
  }

  startTimer = function () {

    add_data(n_data);

    intervalPulse = setInterval(pulse_last_data, 500);

    firstTime = new Date().getTime();

    intervalTimer = setInterval(function () {
      var cur_time = new Date().getTime();
      var time_passed = cur_time - firstTime;

      update_time_text(time_passed);
      update_new_point(time_passed);
    }, 10);
  }

  stopTimer = function () {

    clearInterval(intervalTimer);
    stop_pulse(intervalPulse);
    var new_data = data[data.length - 1];
    return "Recorded time: " + new_data.value + " miliseconds";
  }

});
