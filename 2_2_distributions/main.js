/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */
const yScale = d3.scaleLinear()
  .domain([1100, 0])
  .range([margin.top, height - margin.bottom]);

const xScale = d3.scaleLinear()
  .domain([0, 400])
  .range([margin.left, width - margin.right]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);


    /* HTML ELEMENTS */
    //svg
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    // axis scales
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
    
    // circles
  const dot = svg
  .selectAll("circle")
  .data(data, d => d.BioID) // second argument is the unique key for that row
  .join("circle")
  .attr("cx", d => xScale(d.Width))
  .attr("cy", d => yScale(d.Length))
  .attr("r", 2)
 // .attr("fill", d => colorScale(d.Party))

  });