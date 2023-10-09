// CONSTANTS AND GLOBALS
const width = window.innerWidth * 0.9;
const height = window.innerHeight * 0.7;
const margin = { top: 20, bottom: 50, left: 60, right: 40 };


// Load the data
Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  // Create a set of countries from the nationalities dataset
  const countriesFromNationalities = new Set(nationalities.map((d) => d.Country));

  // Create a map from country name to nationality
  const countryToNationality = new Map();
  nationalities.forEach((d) => {
    countryToNationality.set(d.Country, d.Nationality);
  });

  // Initialize the SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lightpurple"); 

  // Create the projection
  const projection = d3.geoNaturalEarth1().fitSize([width, height], geojson);

  // Create the path generator
  const pathGen = d3.geoPath().projection(projection);

  // Create the map
  const countries = svg
    .selectAll("path.country")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", (d) => pathGen(d))
    .attr("stroke", "black")
    .attr("fill", (d) => {
      const countryName = d.properties.name;
      return countriesFromNationalities.has(countryName) ? "lightblue" : "transparent"; 
    });

  // Create and append legend
  const legend = svg
    .selectAll(".legend")
    .data(legendValues)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width - 100}, ${margin.top + i * 50}`);

  // Legend Circles
  legend
    .append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", (d) => d)
    .attr("fill", "rgba(0, 0, 10, 0)")
    .attr("stroke", "black");

  // Legend Labels
  legend
    .append("text")
    .attr("x", 40)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .attr("font-size", "12px")
    .text((d) => d);

  // Add a title to the graph
  svg
    .append("text")
    .attr("x", margin.left)
    .attr("y", height - margin.bottom)
    .attr("text-anchor", "start")
    .attr("font-size", "20px")
    .text("MoMA Nationalities");
});
