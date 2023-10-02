/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 60 }

/*
this extrapolated function allows us to replace the "G" with "B" in the case of billions.
we cannot do this in the .tickFormat() because we need to pass a function as an argument,
and replace needs to act on the text (result of the function).
*/
const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
const formatDate = d3.timeFormat("%Y")

/* LOAD DATA */
d3.csv('../data/Firearm_Mortality_byState.csv', d => {
  // use custom initializer to reformat the data the way we want it
  // ref: https://github.com/d3/d3-fetch#dsv
  return {
    year: new Date(+d.Year, 0, 1),
    state: d.State,
    death: +d.Deaths
  }
}).then(data => {
  console.log('data :>> ', data);

  // SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.year))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.death)) 
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
    .text("GDP")


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
      .attr("fill", "darkred") 
      .attr("opacity", 0.7) 
      .attr("d", ([state, data]) => areaGen(data))
      .attr("class", ([state, data]) => state)
  });
  
//   // LINE GENERATOR FUNCTION
//   const lineGen = d3.line()
//     .x(d => xScale(d.year))
//     .y(d => yScale(d.death)) 

//   const groupedData = d3.groups(data, d => d.state)

//   // DRAW LINE
//   svg.selectAll(".line")
//     .data(groupedData) // one array for every state
//     .join("path")
//     .attr("class", 'line')
//     .attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("d", ([state, data]) => lineGen(data))
//     .attr("class", ([state, data]) => state)

    
// });