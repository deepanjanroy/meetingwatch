var svg = d3.select("svg");
var circle  = svg.selectAll("circle");
circle.style("fill", "steelblue");

circle = circle.data([32, 57, 112, 293]);
circle.attr("r", function(d) { return Math.sqrt(d);});
circle.attr("cx", function(d, i) { return i * 100 + 30; });

var circleEnter = circle.enter().append("circle");
circleEnter.attr("r", function(d) { return Math.sqrt(d);})
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("cy", "60")
    .style("fill", "steelblue");

var linefunction = d3.svg.line()
    .x(function(d, i) { return i * 100 + 30;})
    .y(function(d) { return 60;});

svg.append("path").datum([32, 57, 112, 293]).attr("class", "line").attr("d", linefunction);

// circle.data([32,57]).exit().transition().duration(1000).delay(100).style("opacity", "0").remove();
