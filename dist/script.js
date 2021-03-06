const url =
"https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800,
height = 400,
padding = 20;

const svgContainer = d3.
select("#dataVis").
append("svg").
attr("width", width + padding * 3).
attr("height", height + padding * 2);

const tooltip = d3.
select("#dataVis").
append("div").
attr("id", "tooltip").
style("opacity", 0);

const overlay = d3.
select("#dataVis").
append("div").
attr("id", "overlay").
style("opacity", 0);

const colorRange = ["#D72847", "#28d7b8"];

const color = d3.scaleOrdinal(colorRange);

d3.json(url, function (e, data) {
  svgContainer.
  append("text").
  attr("class", "y-legend").
  attr("transform", "rotate(-90)").
  attr("x", -180).
  attr("y", 80).
  text("Time in Minutes");

  svgContainer.
  append("text").
  attr("class", "x-legend").
  attr("x", 800).
  attr("y", 390).
  text("Year");

  const years = data.map((val, i) => {
    return val.Year;
  });

  const time = data.map((val, i) => {
    let parsedTime = val.Time.split(":");
    return new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  const yScaleMax = () => {
    const yMax = d3.max(data.map((val, i) => val.Time));
    let parsedTime = yMax.split(":");
    return new Date(
    Date.UTC(1970, 0, 1, 0, parsedTime[0], parseInt(parsedTime[1]) + 10));

  };

  const yScaleMin = () => {
    const yMin = d3.min(data.map((val, i) => val.Time));
    let parsedTime = yMin.split(":");
    return new Date(
    Date.UTC(1970, 0, 1, 0, parsedTime[0], parseInt(parsedTime[1]) - 10));

  };

  const xScale = d3.
  scaleLinear().
  domain([d3.min(years) - 1, d3.max(years) + 1]).
  range([0, width - 20]);

  const yScale = d3.
  scaleTime().
  domain([yScaleMin(), yScaleMax()]).
  range([0, height]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svgContainer.
  selectAll(".dot").
  data(data).
  enter().
  append("circle").
  attr("data-xvalue", (d, i) => {
    return data[i].Year;
  }).
  attr("data-yvalue", (d, i) => {
    return time[i];
  }).
  attr("cx", (d, i) => padding * 3 + xScale(d.Year)).
  attr("cy", (d, i) => yScale(time[i])).
  attr("r", d => 6).

  attr("class", "dot").
  style("fill", (d, i) => {
    return color(d.Doping !== "");
  }).
  on("mouseover", function (d, i) {
    overlay.
    transition().
    duration(0).
    style("opacity", 1).
    style("left", xScale(d.Year) + "px").
    style("bottom", height - padding - yScale(time[i]) + "px").
    style("transform", "translate(78px, -72px)");

    tooltip.transition().duration(100).style("opacity", 0.9);

    tooltip.
    attr("data-year", d.Year).
    style("bottom", height - padding - yScale(time[i]) + "px").
    style("left", xScale(d.Year) + "px").
    style("transform", "translate(100px, -72px)").
    html(
    "<p>" +
    d.Name +
    ", " +
    d.Nationality +
    "</p><p>Year: " +
    d.Year +
    ", Time: " +
    d.Time +
    "</p>" + (
    d.Doping ? "<br><p>" + d.Doping + "</p>" : ""));

  }).
  on("mouseout", function (d, i) {
    overlay.transition().duration(100).style("opacity", 0);

    tooltip.transition().duration(100).style("opacity", 0);
  });

  svgContainer.
  append("g").
  attr("transform", "translate(" + padding * 3 + ", " + height + ")").
  attr("y", height).
  attr("x", padding).
  attr("id", "x-axis").
  call(xAxis);

  svgContainer.
  append("g").
  attr("transform", "translate(" + padding * 3 + ", 0)").
  attr("y", 0).
  attr("x", 0).
  attr("id", "y-axis").
  call(yAxis);

  const legendContainer = svgContainer.append("g").attr("id", "legend");

  const legend = legendContainer.
  selectAll("#legend").
  data(color.domain()).
  enter().
  append("g").
  attr("class", "legend-label").
  attr("transform", function (d, i) {
    return "translate(40," + (height / 3 - i * 20) + ")";
  });

  legend.
  append("rect").
  attr("x", width - 15).
  attr("y", 3).
  attr("width", 15).
  attr("height", 15).
  style("fill", color);

  legend.
  append("text").
  attr("x", width - 24).
  attr("y", 9).
  attr("dy", ".35em").
  text(function (d) {
    if (d) {
      return "Riders with doping allegations";
    } else {
      return "No doping allegations";
    }
  });
});