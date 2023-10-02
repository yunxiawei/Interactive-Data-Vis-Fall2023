/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 60 }

const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
const formatDate = d3.timeFormat("%Y")

/* LOAD DATA */
d3.csv('../data/Firearm_Mortality_by_State.csv', d => {
  // use custom initializer to reformat the data the way we want it
  // ref: https://github.com/d3/d3-fetch#dsv
  return {
    year: new Date(+d.Year, 0, 1),
    state: d.State,
    death: +d.Deaths
  }
}).then(data => {
  console.log('data :>> ', data);

  // + SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.year))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.death)]) 
    .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
    .ticks(6) // limit the number of tick marks showing -- note: this is approximate

  const xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    .text("Year")

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(formatBillions)

  const yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis)

  yAxisGroup.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("Death")

  // AREA GENERATOR FUNCTION
  const areaGen = d3.area()
    .x(d => xScale(d.year))
    .y0(height - margin.bottom)
    .y1(d => yScale(d.death))

  const groupedData = d3.groups(data, d => d.state)

  // DRAW AREA CHART
  svg.selectAll(".area")
    .data(groupedData)
    .join("path")
    .attr("class", 'area')
    .attr("fill", "lightblue")
    .attr("opacity", 0.6)
    .attr("d", ([state, data]) => areaGen(data))
    .attr("class", ([state, data]) => state)
});
