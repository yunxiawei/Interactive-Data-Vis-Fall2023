/* CONSTANTS AND GLOBALS, add a margin to avoid the Y-axis from being cut off */
const margin = { top: 30, right: 20, bottom: 40, left: 60 };
const width = window.innerWidth * 0.7 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data);

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Count)]) // Horizontal scale
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.Nationality)) // Vertical scale
      .range([0, height])
      .padding(0.3);

  // Color scale (ordinal scale)
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    /* HTML ELEMENTS */

    // svg: also add margins to the SVG container(avoid cutoff yAxis)
    const svg = d3.select("#container")
      .append("svg")
     // .attr("height", height)
     // .attr("width", width)
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .style("background-color", "aliceblue")
     .style("overflow", "visible")
     .append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // bars
      const bars = svg.selectAll("rect.bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.Nationality)) //change xScale to yScale
      .attr("width", d => xScale(d.Count)) // Use xScale for width
      .attr("height", yScale.bandwidth()) // Use yScale for height
      .attr("x", 0) // Bars start from the left
      .style("fill", d => colorScale(d.Nationality)); // Apply color based on Nationality

    //bars: way two, use enter and append
    // const bars = svg.selectAll("rect.bar")
    // .data(data)
    // .enter()
    // .append("rect")
    // .attr("class", "bar")
    // .attr("x", d => xScale(d.Nationality))
    // .attr("width", xScale.bandwidth())
    // .attr("height", d => height - yScale(d.Count))
    // .attr("y", d => yScale(d.Count));

// Labels for each bar
bars.each(function (d) {
  const bar = d3.select(this);
  const barColor = bar.style("fill"); //  Get the color of the bar
  console.log("Bar color:", barColor); // Log the bar color
  svg.append("text")
    .text(d.Count)
    .attr("x", xScale(d.Count) + 5) // Adjust the label's x position
    .attr("y", yScale(d.Nationality) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em") // Center the text vertically
    .style("fill", barColor); // Use the same color as the bar
});


    const xAxisGroup = svg.append("g");
    const yAxisGroup = svg.append("g");

    yAxisGroup
      .call(d3.axisLeft(yScale));

    xAxisGroup
      .style("transform", `translate(0, ${height}px)`)
      .call(d3.axisBottom(xScale))


  });
