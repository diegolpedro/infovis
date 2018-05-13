<script type="text/javascript">

d3.json("https://raw.githubusercontent.com/diegolpedro/infovis/gh-pages/MC2/csv/evolucion_anual.json", function(error, data) {

  // If there's an error, raise it
  if (error) throw error;

  // Define global layout variables
  var margin = {top: 10, right: 40, bottom: 10, left: 50};
  var barHeight = 7;
  var width = 650;

  // Select the chart and set it's size
  var chart = d3.select("#chart svg");
  chart.attr("height", barHeight * data.length + margin.top + margin.bottom)
       .attr("width", width + margin.left + margin.right);

  // Add scales
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.ordinal().rangeRoundBands([0, barHeight * data.length]);

  // Bind data to graphics elements
  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + margin.left + "," + i * barHeight + ")"; })
  ;

  // Append rect elements
  bar.append("rect").attr("height", barHeight - 1);

  // Append text elements
  bar.append("text").attr("y", barHeight / 2).attr("dy", ".35em");

  // Set the Y domain
  var yDomain = data.map(function(d) { return d.name; });
  y.domain(yDomain);

  // Add a Y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0, 0)
  ;

  chart.append("g")
    // .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

  function updateChart(chartData) {

    // Update X domain based on new values
    var xDomain = [0, d3.max(chartData, function(d) { return d.value; })];
    x.domain(xDomain);

    // Update rectangle width and positioning
    chart.selectAll("rect")
      .data(chartData)
      .transition()
      .attr("width", function(d) { return x(d.value) - x(0); })
    ;

    chart.selectAll("text")
      .data(chartData)
      .transition()
      .attr("x", function(d) {
        // Draw text inside the rectangle if rect is more than 50 px wide
        // Otherwise, draw text just right of the rectangle
        if (x(d.value) - x(0) > 50) {
          return x(d.value) - 50;
        } else {
          return x(d.value, 0) + 3;
        }
      })
      .text(function(d) { return d.value.toFixed(2) + "%"; })
    ;
  }

  $("#data-select").on("change", function() {
    var timePeriod = $(this).val();
    var chartData = data.map(function(d) {
      // Create chartData from currently selected time period values
      return { name: d.name, value: d.valores[timePeriod] };
    });
    updateChart(chartData);
  });
  $("#data-select").trigger("change");
});
</script>