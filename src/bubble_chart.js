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

  var width = 800;
  var height = 600;
  var h = 1500
  var margin = {top: 30, bottom: 30, right: 30, left: 30};

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('sf_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.

  var center = { x: (width + margin.left*3.8) / 2, y: height / 2 + margin.top*2.5};

  var country_Centers = {
    "SLV": { x: (width + margin.left*3.8) / 4, y: height/2},
    "GT": { x: (width + margin.left*3.8) / 2, y: height/2},
    "HND": { x: (width + margin.left*3.8) *3 / 4, y: height/2},
  };

  var country_TitleX = {
    "El Salvador":  (width + margin.left*3.8) / 4,
    "Guatemala": (width + margin.left*3.8) / 2,
    "Honduras": (width + margin.left*3.8)* 3 / 4,
  };

  var no_mig_ext_Centers = {
    0: { x: (width + margin.left*3.8) / 3, y: height / 2},
    1: { x: (width + margin.left*3.8) * 2 / 3, y: height / 2}
  };

  var no_mig_ext_TitleX = {
    "Without Migrant": (width + margin.left*3.8) / 3,
    "With Migrant": (width + margin.left*3.8) * 2 / 3,
  };

  var tipo_familia_Centers = {
  1: {y: (height-margin.top*2)*1/7.5 + margin.top*2.5},
  2: {y: (height-margin.top*2)*2/7.5 + margin.top*2.5},
  3: {y: (height-margin.top*2)*3/7.5 + margin.top*2.5},
  5: {y: (height-margin.top*2)*4/7.5 + margin.top*2.5},
  8: {y: (height-margin.top*2)*5/7.5 + margin.top*2.5},
  9: {y: (height-margin.top*2)*6/7.5 + margin.top*2.5},
  10: {y: (height-margin.top*2)*7/7.5 + margin.top*2.5}
  };

  var tipo_familia_TitleY = {
    "Biparent": (height-margin.top*2)*1/7,
    "Single Parent: Mother": (height-margin.top*2)*2/7,
    "Single Parent: Father": (height-margin.top*2)*3/7,
    "Extensive": (height-margin.top*2)*4/7,
    "Childless Union": (height-margin.top*2)*5/7,
    "Only One Person": (height-margin.top*2)*6/7,
    "Other": (height-margin.top*2)*7/7,
  };

  var education_Centers = {
    1: {y: (height-margin.top*2)*1/7.5 + margin.top*2.5},
    2: {y: (height-margin.top*2)*2/7.5 + margin.top*2.5},
    4: {y: (height-margin.top*2)*3/7.5 + margin.top*2.5},
    5: {y: (height-margin.top*2)*4/7.5 + margin.top*2.5},
    8: {y: (height-margin.top*2)*5/7.5 + margin.top*2.5},
    9: {y: (height-margin.top*2)*6/7.5 + margin.top*2.5},
    99: {y: (height-margin.top*2)*7/7.5 + margin.top*2.5}
  };

  var education_TitleY = {
    "Without Education": (height-margin.top*2)*1/7,
    "Preschool-Primary": (height-margin.top*2)*2/7,
    "Highschool": (height-margin.top*2)*3/7,
    "Technical Training": (height-margin.top*2)*4/7,
    "University Undegrad": (height-margin.top*2)*5/7,
    "University Post Grad": (height-margin.top*2)*6/7,
    "NS/NR": (height-margin.top*2)*7/7,
  };

  var income_Centers = {
    1: {y: (height-margin.top*2.5) / 6.5 + margin.top*2.5},
    2: {y: (height-margin.top*2.5) * 2 / 6.5 + margin.top*2.5},
    3: {y: (height-margin.top*2.5) * 3 / 6.5 + margin.top*2.5},
    4: {y: (height-margin.top*2.5) * 4 / 6.5 + margin.top*2.5},
    5: {y: (height-margin.top*2.5) * 5 / 6.5 + margin.top*2.5},
    99: { x: width / 2, y: (height-margin.top*2.5) * 6 / 6.5 + margin.top*2.5},
  };

  var income_TitleY = {
    "Enough": (height-margin.top*2.5) / 6,
    "Almost Enough": (height-margin.top*2.5) * 2 / 6,
    "Sometimes Enough": (height-margin.top*2.5) * 3 / 6,
    "Rarely Enough": (height-margin.top*2.5) * 4 / 6,
    "Insufficient": (height-margin.top*2.5) * 5 / 6,
    "NS/NR": (height-margin.top*2.5) * 6 / 6,
  };

  var income_Centers = {
    1: {y: (height-margin.top*2.5) / 6.5 + margin.top*2.5},
    2: {y: (height-margin.top*2.5) * 2 / 6.5 + margin.top*2.5},
    3: {y: (height-margin.top*2.5) * 3 / 6.5 + margin.top*2.5},
    4: {y: (height-margin.top*2.5) * 4 / 6.5 + margin.top*2.5},
    5: {y: (height-margin.top*2.5) * 5 / 6.5 + margin.top*2.5},
    99: { x: width / 2, y: (height-margin.top*2.5) * 6 / 6.5 + margin.top*2.5},
  };

  var income_TitleY = {
    "Enough": (height-margin.top*2.5) / 6,
    "Almost Enough": (height-margin.top*2.5) * 2 / 6,
    "Sometimes Enough": (height-margin.top*2.5) * 3 / 6,
    "Rarely Enough": (height-margin.top*2.5) * 4 / 6,
    "Insufficient": (height-margin.top*2.5) * 5 / 6,
    "NS/NR": (height-margin.top*2.5) * 6 / 6,
  };

  var remittances_Centers = {
    0: {y: (height-margin.top*2.5) / 3.5 + margin.top*2.5},
    1: {y: (height-margin.top*2.5) * 2 / 3.5 + margin.top*2.5},
    99: {y: (height-margin.top*2.5) * 3 / 3.5 + margin.top*2.5},

  };

  var remittances_TitleY = {
    "No": (height-margin.top*2.5) / 3,
    "Yes": (height-margin.top*2.5) * 2 / 3,
    "NS/NR": (height-margin.top*2.5) * 3 / 3,
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
    .force('collision', d3.forceCollide().radius(d => d.radius))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain([ 0, 1])
    .range(['#1A1B41', '#4392F1']);

    var countrycolor = d3.scaleOrdinal()
      .domain([ "SLV", "GT", "HND"])
      .range(['#BAFF29', '#16DB93', '#FF784F']);



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
      .range([0, 8])
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
        country: d.country,
        income: d.income_sufficiency_6m,
        remittances: d.remittances_yn,
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
    svg = d3.select('#vis')
      .append('svg')
      .attr("viewBox", [0, 0, width, h]);

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
      .attr('stroke-width', 0.25)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);


      svg.append('line')
      .style("stroke", "#baff29")
      .style("stroke-width", 3)
      .style("stroke-dasharray", "2,2")
      .attr("x1", margin.left*3.8)
      .attr("y1", 0)
      .attr("x2", margin.left*3.8)
      .attr("y2", h);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(1000)
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

  function countryPos(d) {
    return country_Centers[d.country].x;
  }


  function nodeNo_mig_extPos(d) {
    return no_mig_ext_Centers[d.no_mig_ext].x;
  }


  function nodeTipo_familiaPos(d) {
    return tipo_familia_Centers[d.tipo_familia].y;
  }

  function nodeEducationPos(d) {
    return education_Centers[d.education].y;
  }

  function nodeIncomePos(d) {
    return income_Centers[d.income].y;
  }

  function nodeRemittancesPos(d) {
    return remittances_Centers[d.remittances].y;
  }


  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideTitles_country();
    hideTitles_no_mig_ext();
    hideTitles_tipo_familia();
    hideTitles_education();
    hideTitles_income();
    hideTitles_remittances();

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Sets visualization in "split by mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * xCenter.
   */

   function splitBubbles_country() {
     hideTitles_no_mig_ext();
     hideTitles_tipo_familia();
     hideTitles_education();
     hideTitles_income();
     hideTitles_remittances();
     showTitles_country();

     // @v4 Reset the 'x' force to draw the bubbles to their year centers
     simulation.force('x', d3.forceX().strength(forceStrength).x(countryPos));

     // @v4 We can reset the alpha value and restart the simulation
     simulation.alpha(1).restart();
   }

  function splitBubbles_no_mig_ext() {
    hideTitles_country();
    hideTitles_tipo_familia();
    hideTitles_education();
    hideTitles_income();
    hideTitles_remittances();
    showTitles_no_mig_ext();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles_tipo_familia() {
    hideTitles_country();
    hideTitles_education();
    hideTitles_income();
    hideTitles_remittances();
    showTitles_tipo_familia();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength*2).y(nodeTipo_familiaPos));
    simulation.force('x', d3.forceX().strength(forceStrength*2).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles_education() {
    hideTitles_country();
    hideTitles_tipo_familia();
    hideTitles_income();
    hideTitles_remittances();
    showTitles_education();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength*2).y(nodeEducationPos));
    simulation.force('x', d3.forceX().strength(forceStrength*2).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles_income() {
    hideTitles_country();
    hideTitles_tipo_familia();
    hideTitles_education();
    hideTitles_remittances();
    showTitles_income();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeIncomePos));
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitBubbles_remittances() {
    hideTitles_country();
    hideTitles_tipo_familia();
    hideTitles_education();
    hideTitles_income();
    showTitles_remittances();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('y', d3.forceY().strength(forceStrength).y(nodeRemittancesPos));
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeNo_mig_extPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }


  /*
   * Hides Year title displays.
   */
  function hideTitles_no_mig_ext() {
    svg.selectAll('.label_no_mig_ext').remove();
  }

  function hideTitles_country() {
    svg.selectAll('.label_country').remove();
  }

  function hideTitles_tipo_familia() {
    svg.selectAll('.label_tipo_familia').remove();
  }

  function hideTitles_education() {
    svg.selectAll('.label_education').remove();
  }

  function hideTitles_income() {
    svg.selectAll('.label_income').remove();
  }

  function hideTitles_remittances() {
    svg.selectAll('.label_remittances').remove();
    svg.selectAll('.label_remittances_Q').remove();
  }


  /*
   * Shows Year title displays.
   */


   function showTitles_country() {
     var country_Data = d3.keys(country_TitleX);
     var country = svg.selectAll('.country')
       .data(country_Data);

     country.enter().append('text')
       .attr('class', 'label_country')
       .attr('x', function (d) { return country_TitleX[d]; })
       .attr('y', margin.top*2)
       .attr('text-anchor', 'middle')
       .style("text-decoration", "underline")
       .style("text-decoration-color", "#baff29")
       .text(function (d) { return d; });

  }

  function showTitles_no_mig_ext() {
    var no_mig_extData = d3.keys(no_mig_ext_TitleX);
    var no_mig_ext = svg.selectAll('.no_mig_ext')
      .data(no_mig_extData);

    no_mig_ext.enter().append('text')
      .attr('class', 'label_no_mig_ext')
      .attr('x', function (d) { return no_mig_ext_TitleX[d]; })
      .attr('y', margin.top*2)
      .attr('text-anchor', 'middle')
      .style("text-decoration", "underline")
      .style("text-decoration-color", "#baff29")
      .text(function (d) { return d; });
  }

  function showTitles_tipo_familia() {
    var tipo_familiaData = d3.keys(tipo_familia_TitleY);
    var tipo_familia = svg.selectAll('.tipo_familia')
      .data(tipo_familiaData);
    tipo_familia.enter().append('text')
      .attr('class', 'label_tipo_familia')
      .attr('x', margin.left*3.5)
      .attr('y', function (d) { return tipo_familia_TitleY[d] + margin.top*2; })
      .attr('text-anchor', 'end')
      .text(function (d) { return d; });
  }

  function showTitles_education() {
    var educationData = d3.keys(education_TitleY);
    var education = svg.selectAll('.education')
      .data(educationData);
    education.enter().append('text')
      .attr('class', 'label_education')
      .attr('x', margin.left*3.5)
      .attr('y', function (d) { return education_TitleY[d] + margin.top*2; })
      .attr('text-anchor', 'end')
      .text(function (d) { return d; });
  }

  function showTitles_income() {
    var incomeData = d3.keys(income_TitleY);
    var income = svg.selectAll('.education')
      .data(incomeData);
    income.enter().append('text')
      .attr('class', 'label_income')
      .attr('x', margin.left*3.5)
      .attr('y', function (d) { return income_TitleY[d] + margin.top*2; })
      .attr('text-anchor', 'end')
      .text(function (d) { return d; });
  }

  function showTitles_remittances() {
    var remittancesData = d3.keys(remittances_TitleY);
    var remittances = svg.selectAll('.remittances')
      .data(remittancesData);
    remittances.enter().append('text')
      .attr('class', 'label_remittances')
      .attr('x', margin.left*3.5)
      .attr('y', function (d) { return remittances_TitleY[d] + margin.top*1; })
      .attr('text-anchor', 'end')
      .text(function (d) { return d; });
    svg.append("text")
        .attr("x", (width + margin.left*3.8) / 2)
        .attr("y", height + margin.bottom)
        .attr('class', 'label_remittances_Q')
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("In the last 12 months, has your household received financial aid from abroad?");
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Country: </span><span class="value">' +
                  d.country +
                  '</span><br/>' +
                  '<span class="name">Household size: </span><span class="value">' +
                  addCommas(d.value) +
                  '</span><br/>' +
                  '<span class="name">Household type: </span><span class="value">' +
                  d.tipo_familia +
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', "white");

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
    if (displayName === 'country') {
      splitBubbles_country();
    }
    else if (displayName === 'no_mig_ext') {
      splitBubbles_no_mig_ext();
    }
    else if (displayName === 'tipo_familia') {
      splitBubbles_tipo_familia();
    }
    else if (displayName === 'education') {
      splitBubbles_education();
    }
    else if (displayName === 'income') {
      splitBubbles_income();
    }
    else {
      groupBubbles();
    }
  };

  let activationFunctions = [
      groupBubbles,
      splitBubbles_country,
      splitBubbles_no_mig_ext,
      splitBubbles_tipo_familia,
      splitBubbles_education,
      splitBubbles_income,
      splitBubbles_remittances,
      groupBubbles,
  ]

  //All the scrolling function
  //Will draw a new graph based on the index provided by the scroll


  let scroll = scroller()
      .container(d3.select('#vis'))
  scroll()

  let lastIndex, activeIndex = 0

  scroll.on('active', function(index){
      d3.selectAll('.step')
          .transition().duration(0)
          .style('opacity', function (d, i) {return i === index ? 1 : 0.5;});


      activeIndex = index
      let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
      let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
      scrolledSections.forEach(i => {
          activationFunctions[i]();
      })
      lastIndex = activeIndex;

  })

  scroll.on('progress', function(index, progress){
      if (index == 2 & progress > 0.7){

      }
  })






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
