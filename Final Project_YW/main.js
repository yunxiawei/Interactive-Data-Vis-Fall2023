/* 1_Nationalities By gender */
const margin = { top: 30, right: 20, bottom: 60, left: 60 }; 
const width = window.innerWidth * 0.7 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// LOAD DATA 
d3.csv('../data/Artists.csv', d3.autoType)
  .then(artistsData => {
    console.log("data", artistsData);

// SCALES 
  const genderCounts = d3.rollups(
      artistsData,
      v => v.length,
      d => d.Gender
    );

  const filteredGenderCounts = genderCounts.filter(([gender, count]) => gender !== '' && gender !== undefined);
  const pieData = filteredGenderCounts.map(([gender, count]) => ({ gender, count }));

    const xScale = d3.scaleBand()
      .domain(pieData.map(d => d.gender))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(pieData, d => d.count)])
      .nice()
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // HTML ELEMENTS 
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "aliceblue")
    .style("overflow", "visible")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxisGroup = svg.append("g")
    .attr("transform", `translate(0, ${height})`); // Move x-axis to the bottom
    const yAxisGroup = svg.append("g");

    // Populate nationality filter 
    const uniqueNationalities = Array.from(new Set(artistsData.map(d => d.Nationality)));
    const nationalityFilterSelect = document.getElementById('nationality-filter');
    uniqueNationalities.forEach(nationality => {
      const option = document.createElement('option');
      option.value = nationality;
      option.textContent = nationality;
      nationalityFilterSelect.appendChild(option);
    });

    // Event listener for nationality filter change 
    nationalityFilterSelect.addEventListener('change', function(event) {
      const selectedNationality = event.target.value;
      updateVisualization(selectedNationality); 
    });

    // Function to update visualization based on nationality filter 
    function updateVisualization(selectedNationality) {
      let filteredData;

      if (selectedNationality === '') {
        filteredData = artistsData; 
      } else {
        filteredData = artistsData.filter(d => d.Nationality === selectedNationality);
      }

      // Update the visualization based on the filtered data  
      const filteredGenderCounts = d3.rollups(
        filteredData,
        v => v.length,
        d => d.Gender
      ).filter(([gender, count]) => gender !== '' && gender !== undefined);

      const updatedPieData = filteredGenderCounts.map(([gender, count]) => ({ gender, count }));

      xScale.domain(updatedPieData.map(d => d.gender));
      yScale.domain([0, d3.max(updatedPieData, d => d.count)]);

      const bars = svg.selectAll("rect.bar")
        .data(updatedPieData);

      bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.gender))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.count))
        .style("fill", d => colorScale(d.gender));

      bars.exit().remove();

      const labels = svg.selectAll("text.label")
        .data(updatedPieData);

      labels.enter()
        .append("text")
        .attr("class", "label")
        .merge(labels)
        .transition()
        .duration(500)
        .text(d => d.count)
        .attr("x", d => xScale(d.gender) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.count) - 5)
        .attr("text-anchor", "middle")
        .style("fill", d => colorScale(d.gender));

      labels.exit().remove();

      xAxisGroup.call(d3.axisBottom(xScale));
      yAxisGroup.call(d3.axisLeft(yScale));
    }

    // Call the updateVisualization function to initialize the visualization 
    updateVisualization(""); 
  })
  .catch(error => {
    console.error('Error loading the data', error);
  });


 /* 2_Treemap by Nationalities and filter By gender */
// Constants for visualization
const treemapWidth = 800;
const treemapHeight = 600;

// Load the CSV file containing artist data
d3.csv('../data/Artists.csv', d3.autoType)
  .then(artistsData => {
    console.log("data", artistsData);

    // Function to create treemap based on gender filter
    function createTreemap(genderFilter) {
      // Filter the data by gender if a filter is applied
      const filteredData = genderFilter && genderFilter !== 'All'
        ? artistsData.filter(d => d.Gender.toLowerCase() === genderFilter.toLowerCase())
        : artistsData;

      // Group filtered data by Nationality and count ConstituentID for each nationality
      const nestedData = d3.rollup(
        filteredData,
        v => v.length,
        d => d.Nationality
      );

      // Convert nested data to an array of objects
      const nestedArray = Array.from(nestedData, ([key, value]) => ({ Nationality: key, Count: value }));

      // Create hierarchy for treemap
      const root = d3.hierarchy({ children: nestedArray })
        .sum(d => d.Count)
        .sort((a, b) => b.value - a.value);

      // Define the treemap layout
      const treemapLayout = d3.treemap()
        .size([treemapWidth, treemapHeight])
        .padding(1)
        .round(true);

      // Generate treemap layout based on hierarchy
      treemapLayout(root);

      // Clear previous SVG content
      d3.select('#container2').selectAll('*').remove();

      // Append SVG for treemap
      const svg = d3.select('#container2')
        .append('svg')
        .attr('width', treemapWidth)
        .attr('height', treemapHeight)
        .style('border', '1px solid #ddd');

      // Append treemap rectangles
      svg.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', (d, i) => getColorForNationality(d.data.Nationality))
        .attr('stroke', 'white');

    // Function to define color based on nationality
    function getColorForNationality(nationality) {
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([...new Set(artistsData.map(d => d.Nationality))]);
    return colorScale(nationality);
  }

      // Append labels
      svg.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('x', d => d.x0 + 5)
        .attr('y', d => d.y0 + 20)
        .text(d => `${d.data.Nationality} (${d.data.Count})`)
        .attr('font-size', '12px')
        .attr('fill', 'white');
    }

    // Initial treemap creation with no gender filter
    createTreemap(null);

    // Add event listener for gender filter change
    const genderFilterSelect = document.getElementById('gender-filter');
    genderFilterSelect.addEventListener('change', function(event) {
      const selectedGender = event.target.value;
      createTreemap(selectedGender === 'All' ? null : selectedGender);
    });
  })
  .catch(error => {
    console.error('Error loading the data', error);
  });



/* 3_Artworks by department */
const deptMargin = { top: 30, right: 20, bottom: 40, left: 60 };
const deptChartWidth = window.innerWidth * 0.7 - deptMargin.left - deptMargin.right;
const deptChartHeight = 500 - deptMargin.top - deptMargin.bottom;

// LOAD DATA 
d3.csv('../data/Artworks.csv', d3.autoType).then((artworksData) => {
  // Extracting unique departments and counts
  const deptCounts = d3.rollups(
    artworksData,
    v => v.length,
    d => d.Department
  );

  // Filtering out empty or undefined departments
  const filteredDeptCounts = deptCounts.filter(([department, count]) => department !== '' && department !== undefined);

  // Creating an array of objects with department and count properties
  const deptData = filteredDeptCounts.map(([department, count]) => ({ department, count }));

  // Set up scales for the bar chart by departments
  const xDeptScale = d3.scaleBand()
    .domain(deptData.map(d => d.department))
    .range([0, deptChartWidth])
    .padding(0.1);

  const yDeptScale = d3.scaleLinear()
    .domain([0, d3.max(deptData, d => d.count)])
    .nice()
    .range([deptChartHeight, 0]);

  // Setting up the SVG for department chart
  const deptSvg = d3.select('#container1')
    .append('svg')
    .attr('width', deptChartWidth + deptMargin.left + deptMargin.right)
    .attr('height', deptChartHeight + deptMargin.top + deptMargin.bottom)
    .append('g')
    .attr('transform', `translate(${deptMargin.left}, ${deptMargin.top})`);

  // Draw x-axis for departments
  deptSvg.append('g')
    .attr('transform', `translate(0, ${deptChartHeight})`)
    .call(d3.axisBottom(xDeptScale))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-10)')
    .style('font-size', '10px');

  // Draw y-axis for departments
  deptSvg.append('g')
    .call(d3.axisLeft(yDeptScale));

// Find the most and least represented departments
const sortedDeptData = deptData.slice().sort((a, b) => a.count - b.count);
const mostRepresented = sortedDeptData[sortedDeptData.length - 1]; // Most represented department
const leastRepresented = sortedDeptData[0]; // Least represented department

// Draw bars for departments with light blue color
deptSvg.selectAll('.deptBar')
  .data(deptData)
  .enter()
  .append('rect')
  .attr('class', 'deptBar')
  .attr('x', d => xDeptScale(d.department))
  .attr('y', d => yDeptScale(d.count))
  .attr('width', xDeptScale.bandwidth())
  .attr('height', d => deptChartHeight - yDeptScale(d.count))
  .attr('fill', d => {
    if (d.department === mostRepresented.department) {
      return 'green'; // Highlight most represented department with green
    } else if (d.department === leastRepresented.department) {
      return 'red'; // Highlight least represented department with red
    } else {
      return 'lightblue'; // Default color for other departments
    }
  });

  // Add labels to the bars for departments
  deptSvg.selectAll('.deptLabel')
    .data(deptData)
    .enter()
    .append('text')
    .attr('class', 'deptLabel')
    .attr('x', d => xDeptScale(d.department) + xDeptScale.bandwidth() / 2)
    .attr('y', d => yDeptScale(d.count) - 5)
    .attr('text-anchor', 'middle')
    .text(d => d.count);
});
