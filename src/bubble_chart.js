/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  // Constants for sizing
  var width = 1000;
  var height = 1000;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var no_mig_ext_Centers = {
    0: { x: width / 3, y: height / 2 },
    1: { x: 2 * width / 3, y: height / 2 }
  };

  // X locations of the year titles.
  var no_mig_ext_TitleX = {
    "Without Migrant": width / 3,
    "With Migrant": 2 * width / 3
  };

  var tipo_familia_Centers = {
    1: { x: width / 2, y: height / 8 },
    2: { x: width / 2, y: height * 2 / 8 },
    3: { x: width / 2, y: height * 3 / 8 },
    5: { x: width / 2, y: height * 4 / 8 },
    8: { x: width / 2, y: height * 5 / 8 },
    9: { x: width / 2, y: height * 6 / 8 },
    10: { x: width / 2, y: height * 7 / 8 }
  };

  var tipo_familia_TitleY = {
    "Biparent": height / 8,
    "Single Parent: Mother": height * 2 / 8,
    "Single Parent: Father": height * 3 / 8,
    "Extensive": height * 4 / 8,
    "Childless Union": height * 5 / 8,
    "Only One Person": height * 6 / 8,
    "Other": height * 7 / 8,
  };

  var education_Centers = {
    1: { x: width / 2, y: height / 8 },
    2: { x: width / 2, y: height * 2 / 8 },
    4: { x: width / 2, y: height * 3 / 8 },
    5: { x: width / 2, y: height * 4 / 8 },
    8: { x: width / 2, y: height * 5 / 8 },
    9: { x: width / 2, y: height * 6 / 8 },
    99: { x: width / 2, y: height * 7 / 8 }
  };

  var education_TitleY = {
    "Without Education": height / 8,
    "Preschool-Primary": height * 2 / 8,
    "Highschool": height * 3 / 8,
    "Technical Training": height * 4 / 8,
    "University Undegrad": height * 5 / 8,
    "University Post Grad": height * 6 / 8,
    "NS/NR": height * 7 / 8,
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.03;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain([ 0, 1])
    .range(['#1A1B41', '#4392F1']);


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    var maxAmount = d3.max(rawData, function (d) { return+ d.hh_size; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
      .exponent(1.5)
      .range([0, 18])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      return {
        id: d.rsp_id,
        radius: radiusScale(+d.hh_size),
        value: +d.hh_size,
        tipo_familia: d.tipo_familia,
        no_mig_ext: d.no_mig_ext,
        education: d.escolaridad_max,
        x: Math.random() * 800,
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });
    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.no_mig_ext); })
      .attr('stroke', "white")
      .attr('stroke-width', .25)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  function nodeNo_mig_extPos(d) {
    return no_mig_ext_Centers[d.no_mig_ext].x;
  }

  function nodeTipo_familiaPos(d) {
    return tipo_familia_Centers[d.tipo_familia].y;
  }

  function nodeEducation_familiaPos(d) {
    return education_Centers[d.education].y;
  }


  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideTitles();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles() {
    showTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles2() {
    showTitles2();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeTipo_familiaPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles3() {
    hideTitles2();
    showTitles3();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeEducation_familiaPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Hides Year title displays.
   */
  function hideTitles() {
    svg.selectAll('.no_mig_ext').remove();
  }

  function hideTitles2() {
    svg.selectAll('.tipo_familia').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var no_mig_extData = d3.keys(no_mig_ext_TitleX);
    var no_mig_ext = svg.selectAll('.no_mig_ext')
      .data(no_mig_extData);

    no_mig_ext.enter().append('text')
      .attr('class', 'labelsx')
      .attr('x', function (d) { return no_mig_ext_TitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

  function showTitles2() {
    var tipo_familiaData = d3.keys(tipo_familia_TitleY);
    var tipo_familia = svg.selectAll('.tipo_familia')
      .data(tipo_familiaData);
    tipo_familia.enter().append('text')
      .attr('class', 'labelsx')
      .attr('x', width/2)
      .attr('y', function (d) { return tipo_familia_TitleY[d] + .5 * height / 8; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }

  function showTitles3() {
    var educationData = d3.keys(education_TitleY);
    var education = svg.selectAll('.education')
      .data(educationData);
    education.enter().append('text')
      .attr('class', 'labelsx')
      .attr('x', width/2)
      .attr('y', function (d) { return education_TitleY[d] + .5 * height / 8; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Household Type: </span><span class="value">' +
                  d.tipo_familia +
                  '</span><br/>' +
                  '<span class="name">Amount: </span><span class="value">$' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">Household Size: </span><span class="value">' +
                  d.value +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'no_mig_ext') {
      splitBubbles();
    }
    else if (displayName === 'tipo_familia') {
      splitBubbles2();
    }
    else if (displayName === 'education') {
      splitBubbles3();
    }
    else {
      groupBubbles();
    }
  };





  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('https://kjj94.github.io/bigdata/data/test8.csv', display);

// setup the buttons.
setupButtons();
