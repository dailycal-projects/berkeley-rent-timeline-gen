var d3 = require('d3');
var WIDTH, HEIGHT;

if (window.innerWidth < 380) {
    WIDTH = 300;
    HEIGHT = 500; 
} else if (window.innerWidth < 450) {
    WIDTH = 400;
    HEIGHT = 500; 
} else if (window.innerWidth < 800) {
    WIDTH = 600;
    HEIGHT = 500;
} else {
    WIDTH = 900;
    HEIGHT = 600;
}

var margin = {top: 20, right: 20, bottom: 25, left: 50};

/* selection.node() -- returns the first (non-null) element in this selection. */
var body = d3.select('body').node();
var container = d3.select('#container');
var content = d3.select('#content');
    
/* .getBoundingClientRect() -- returns the size of an element and its position relative to the viewport. */
var SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;

var svg = d3.select("#sticky").append("svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand().rangeRound([0, WIDTH - margin.left]).paddingInner(0.1);
var yScale = d3.scaleLinear().rangeRound([HEIGHT - margin.bottom, -margin.bottom]);

d3.csv("../data/data.csv", function(d) {
  return d;
}, function(error, data) {
  if (error) throw error;

  var line = d3.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.rent2); })

  xScale.domain(data.map(function(d) { return d.year; })).range([0, WIDTH - 2 * margin.right]);
  yScale.domain([0, 1800]).range([HEIGHT - 2 * margin.bottom, 0]);

  var years = [1978, 1983, 1988, 1993, 1998, 2003, 2008, 2013];
  var x = d3.axisBottom(xScale).tickValues(years);

  var xAxis = g.append("g")
    .attr("transform", "translate(" + (-5) + "," + (HEIGHT - 2 * margin.bottom) + ")")
    .attr("class", "axis")
    .call(x)
    .call(g => g.select(".domain").remove());

  var yAxis = g.append("g")
    .attr("transform", "translate(" + (0.15 * margin.left) + "," + (1.5 * margin.bottom) + ")")
    .attr("class", "axis")
    .call(d3.axisLeft(yScale).tickFormat((d, i) => (i == 9) ? d3.format("($,.2r")(d) : d3.format(",.2r")(d))) 
    .call(g => g.select(".domain").remove());

  var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -(HEIGHT / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-family", "BentonSans")
    .text("Median Rent (in Dollars)"); 

  var path = g.append("path")
    .attr("d",line(data))
    .attr("transform", "translate(" + 0 + "," + 2 * margin.top + ")")
    .attr("class","line")
    .style("fill", "none")
    .style("stroke-opacity", .8)
    .style("stroke", "#c06014")
    .style("stroke-width", 4)
    .style("stroke-dasharray", function(d) {
      var l = d3.select(this).node().getTotalLength();
      return l + "px, " + l + "px";
      })
    .style("stroke-dashoffset", function(d) {
      return d3.select(this).node().getTotalLength() + "px";
      });

  var pathScale = d3.scaleLinear()
    .domain([6 * HEIGHT, SCROLL_LENGTH - HEIGHT])
    .range([0, path.node().getTotalLength()])
    .clamp(true);  

  var scrollTop = 0
  var newScrollTop = 0

  /* Event handler that records scroll position. */
  /* scrollTop -- a measurement of the distance from the element's top to its topmost visible content. */
  container
    .on("scroll.scroller", function() {
      newScrollTop = container.node().scrollTop
    });

  var setDimensions = function() {
    var isMobile = window.innerWidth < 850 ? true : false;

    WIDTH = isMobile ? window.innerWidth : 900;
    HEIGHT = isMobile ? 500 : 600;
    
    SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;
    console.log(SCROLL_LENGTH);

    svg
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
    
    xScale.range([0, WIDTH - 2 * margin.right]);
    yScale.range([HEIGHT - 2 * margin.bottom, 0]);

    xAxis
      .attr("transform", "translate(" + (-5) + "," + (HEIGHT - 2 * margin.bottom) + ")")
      .attr("class", "axis")
      .call(x)
      .call(g => g.select(".domain").remove());

    yAxis
      .attr("transform", "translate(" + (0.15 * margin.left) + "," + (1.5 * margin.bottom) + ")")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .call(g => g.select(".domain").remove());

    yLabel
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", -(HEIGHT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Rent (in Dollars)");

    pathScale
      .domain([6 * HEIGHT, SCROLL_LENGTH - HEIGHT])
      .range([0, path.node().getTotalLength()]);

    path
      .attr("d", line(data))
      .style("stroke-dasharray", function(d) {
        console.log(d3.select(this));
        var l = d3.select(this).node().getTotalLength();
        return l + "px, " + l + "px";
      })
      .style("stroke-dashoffset", function(d) {
        return d3.select(this).node().getTotalLength() - pathScale(scrollTop) + "px";
      });
}

/* Checks (~60/sec) if newScrollTop is different from scrollTop. If different, update graphics accordingly. */
/* window.requestAnimationFrame() -- tells the browser that you wish to perform an animation and requests
that the browser call a specified function to update an animation before the next repaint. 
The method takes a callback as an argument to be invoked before the repaint. */
var render = function() {
  if (scrollTop !== newScrollTop) {
    scrollTop = newScrollTop
    
    if (scrollTop > (1 * window.innerHeight)) {
        d3.select("#sticky")
          .style("display", "block");
    } else {
        d3.select("#sticky")
          .style("display", "none");
    }

    path
      .style("stroke-dashoffset", function(d) {
        return (path.node().getTotalLength() - pathScale(scrollTop) + "px");
      });
  }

  /* Your callback routine must itself call requestAnimationFrame()
  if you want to animate another frame at the next repaint. */
  window.requestAnimationFrame(render)
}

window.requestAnimationFrame(render)

window.onresize = setDimensions
});