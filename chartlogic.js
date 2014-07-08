// Dimensions
// TODO: Investigate using the css margin property instead of this bullshit
var margin = { left: 50, right: 20, top: 20, bottom: 30};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* Scales */
var y = d3.scale.linear()
    .range([height, 0]);

var x = d3.time.scale()
    .range([0,width]);

/* Axes */
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(7) // Move this somewhere else
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

/* Chart frame */
var chart = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var date_parser = d3.time.format("%Y-%m-%d");
var n_data = {date: date_parser.parse("2014-07-29"), value: 0};
var m_data = {date: date_parser.parse("2014-07-30"), value: 0};


// Async call to data.tsv
d3.tsv("data.tsv", function(error, data){
  if (error != null) {
    alert("Something terrible happened: error on console.");
    console.log(error);
    return;
  }

  data.forEach(function(d) {
    d.value = +d.value;
    d.date = new date_parser.parse(d.date);
  });


  var add_data = function (d) {
    data.push(d);
    chart.selectAll(".dataPoint", function(d) { return d.date.toDateString(); })
        .data(data)
      .enter().append("circle")
        .attr("class", "dataPoint")
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

  // Setting domain
  var max_date_data = lambdaMax(data, function(d) {  return d.date.getTime(); });
  var max_date = new Date(max_date_data.date);
  var lower_date = new Date(max_date.getFullYear(), max_date.getMonth(), max_date.getDate() - 5);
  var upper_date = new Date(max_date.getFullYear(), max_date.getMonth(), max_date.getDate() + 2);

  x.domain([lower_date, upper_date]);
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



  add_data(n_data);
  setTimeout(function() { add_data(m_data);}, 3000);

  var lineFunction = d3.svg.line()
                          .x(function(d) { return x(new Date(d.date)); })
                          .y(function(d) { return y(d.value); })
                          .interpolate("linear");

  chart.insert("path", ":first-child")
        .attr("id", "thePath")
        .attr("d", lineFunction(data))
        .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("fill", "none");



  var colors = ["steelblue", "red"];
  var radius = ["4", "6"];
  var colindex = 0;


  setInterval(pulse_last_data, 500);

  firstTime = new Date().getTime() / 1000;

  var update_new_point = function(seconds) {
    var elm = chart.selectAll(".dataPoint")[0].pop();
    if (elm === null) {
      return;
    }

    new_data = data[data.length - 1];
    new_data.value = seconds;
    elm.setAttribute("cy", y(new_data.value));

    d3.select("#thePath")
        .attr("d", lineFunction(data));

  };

  setInterval(function () {
    var cur_time = new Date().getTime() / 1000;
    var time_passed = deepRound(cur_time - firstTime);

    document.getElementById("timerId").textContent = time_passed;
    update_new_point(time_passed);
  }, 10);

});
