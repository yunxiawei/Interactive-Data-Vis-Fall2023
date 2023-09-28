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
    const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Width))
    .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Length))
    .range([height - margin.bottom, margin.top]);
  
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
    .call(selection => selection.call(xAxis))
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(selection => selection.call(yAxis))
    

    // Identify the smallest and largest data points
    const smallestDataPoint = data.reduce((min, current) => (current.Length < min.Length ? current : min), data[0]);
    const largestDataPoint = data.reduce((max, current) => (current.Length > max.Length ? current : max), data[0]);
    
    // Create labels for the smallest and largest data points
    const labels = svg
    .selectAll("text.label")
    .data([smallestDataPoint, largestDataPoint]) // Create data array for only the smallest and largest data points
    .join("text")
    .attr("class", "label")
    .text(d => d.Title) 
    .attr("transform", d => `translate(${xScale(d.Width)}, ${yScale(d.Length)})`)
    .attr("dy", -2) // Adjust labels position
    .style("text-anchor", "below");

    // Create circles for all data points
    const dots = svg
    .selectAll("circle.senator")
    .data(data, d => d.ArtistLifespan)
    .join("circle")
    .attr("class", "senator")
    .attr("cx", d => xScale(d.Width))
    .attr("cy", d => yScale(d.Length))
    .transition()
    .duration(1000)
    .delay((d, i) => d.Width * 100)
    .attr("r", 2)
    .attr("fill", "purple");

  });