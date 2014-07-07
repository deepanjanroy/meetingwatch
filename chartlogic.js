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
    .ticks(7) // Move this somewhere else
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

var date_parser = d3.time.format("%Y-%m-%d");
var new_data = {date: date_parser.parse("2014-07-29"), value: 0};

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

  var lambdaMax = function(arr, lambda) {
    if (arr.length === 0 || arr === undefined || arr === null) {
      throw "Invalid argument";
    }

    if (lambda === null || lambda === undefined) {
      lambda = function (key) { return key; };
    }

    var max_index = 0;
    var cur_max = lambda(arr[max_index]);

    arr.forEach(function (val, i) {
      if (lambda(val) > cur_max) {
        max_index = i;
      }
    })

    return arr[max_index];
  }

  // Setting domain
  var max_date_data = lambdaMax(data, function(d) {  return new Date(d.date).getTime(); });
  var max_date = new Date(max_date_data.date);
  var lower_date = new Date(max_date.getUTCFullYear(), max_date.getUTCMonth(), max_date.getUTCDate() - 5);
  var upper_date = new Date(max_date.getUTCFullYear(), max_date.getUTCMonth(), max_date.getUTCDate() + 1);

  x.domain([lower_date, upper_date]);
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
      .data([new_data])
    .enter().append("circle")
      .attr("class", "newPoint dataPoint")
      .attr("id", "newPointId")
      .attr("cx", function(d) { return x(d.date);})
      .attr("cy", function(d) { return y(d.value);})
      .attr("r", "4")
      // .attr("fill", "steelblue");


  var lineFunction = d3.svg.line()
                          .x(function(d) { return x(new Date(d.date)); })
                          .y(function(d) { return y(d.value); })
                          .interpolate("linear");

  chart.insert("path", ":first-child")
        .attr("id", "thePath")
        .attr("d", lineFunction(data.concat([new_data])))
        .attr("stroke", "steelblue")
       .attr("stroke-width", 2)
       .attr("fill", "none");



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


  // Timer stuff

  firstTime = new Date().getTime() / 1000;

  var deepRound = function (num, decimalPlaces) {
    if (decimalPlaces === undefined) {
      decimalPlaces = 2;
    }
    var factor = Math.pow(10, decimalPlaces);
    num = num * factor;
    num = Math.round(num);
    num = num / factor;

    return num;
  }

  var update_new_point = function(seconds) {
    var elm = document.getElementById("newPointId");
    if (elm === null) {
      return;
    }

    new_data.value = seconds;
    elm.setAttribute("cy", y(new_data.value));

    d3.select("#thePath")
        .attr("d", lineFunction(data.concat(new_data)));


  };

  setInterval(function () {
    var cur_time = new Date().getTime() / 1000;
    var time_passed = deepRound(cur_time - firstTime);

    document.getElementById("timerId").textContent = time_passed;
    update_new_point(time_passed);
  }, 10);

});
