/**
 * Created by: Lee Bergstrand (2018)
 * Description: Functions for drawing the genome properties diagram.
 */

/**
 * Calculates the width that the genome properties heatmap should take up.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} heatmap_parameters: Heatmap settings from the server.
 * @return {number} The width that the heatmap should be in the genome properties visualisation.
 */
function calculate_heatmap_width(genome_properties_tree, heatmap_parameters)
{
    let number_of_organisms = genome_properties_tree.sample_names.length;
    let heatmap_cell_width = heatmap_parameters['cell_width'];
    let heatmap_column_spacer = heatmap_parameters['column_spacer'];

    let axes = heatmap_parameters['axes'];
    let y_axis_label_offset = axes['y_axis_label_offset'];
    let y_axis_label_width = axes['y_axis_label_width'];

    return ((heatmap_cell_width + heatmap_column_spacer) * (number_of_organisms)) +
        y_axis_label_offset + y_axis_label_width;
}

/**
 * Calculates the width that the genome properties tree should take up.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} tree_parameters: Tree settings from the server.
 * @return {number} The width that the tree should be in the genome properties visualisation.
 */
function calculate_tree_width(genome_properties_tree, tree_parameters)
{
    let max_number_of_nodes_to_leaf = genome_properties_tree.max_nodes_to_leaf();
    let tree_cell_width = tree_parameters['cell_width'];
    let tree_column_spacer = tree_parameters['column_spacer'];

    return (tree_column_spacer + tree_cell_width) * (max_number_of_nodes_to_leaf + 1);
}

/**
 * Calculates the height that the genome properties tree should take up.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} global_parameters: Tree settings from the server.
 * @return {number} The height that the tree should be in the genome properties visualisation.
 */
function calculate_tree_height(genome_properties_tree, global_parameters)
{
    let number_leaf_nodes = genome_properties_tree.number_of_leaves();
    let row_spacer = global_parameters['row_spacer'];
    let row_height = global_parameters['row_height'];

    return (row_height * number_leaf_nodes) + (row_spacer * (number_leaf_nodes - 1))
}

/**
 * Calculates the height that the genome properties visualisation should take up.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} global_parameters: Settings from the server.
 * @return {number} The height that the tree should be in the genome properties visualisation.
 */
function calculate_diagram_height(genome_properties_tree, global_parameters)
{
    let row_spacer = global_parameters['row_spacer'];
    let top_offset = global_parameters['top_offset'];
    let tree_height = calculate_tree_height(genome_properties_tree, global_parameters);

    return tree_height + top_offset + row_spacer;
}

/**
 * Draws the heatmap portion of the genome properties visualisation.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} global_parameters: Settings from the server.
 * @param {object} heatmap_parameters: Heatmap settings from the server.
 * @param {g} heatmap_svg_group: The SVG group to which contain the heatmap portion of the visualisation.
 */
function draw_heatmap(genome_properties_tree, global_parameters, heatmap_parameters, heatmap_svg_group, diagram_header_svg, heatmap_left_offset)
{
    let heatmap_cell_width = heatmap_parameters['cell_width'];
    let heatmap_column_spacer = heatmap_parameters['column_spacer'];
    let row_height = global_parameters['row_height'];
    let row_spacer = global_parameters['row_spacer'];
    let diagram_top_offset = global_parameters['top_offset'];

    let axes_parameters = heatmap_parameters['axes'];
    let y_axis_label_offset = axes_parameters['y_axis_label_offset'];
    let x_axis_label_axis_offset = axes_parameters['x_axis_label_offset'];

    let heatmap_data = genome_properties_tree.leaf_data();

    let x_elements = d3.set(heatmap_data.map(function (item) {
        return item.genome;
    })).values();

    let y_elements = deduplicated_y_elements(heatmap_data, x_elements);

    let total_heatmap_width = x_elements.length * (heatmap_cell_width + heatmap_column_spacer);

    let xScale = d3.scale.ordinal()
                   .domain(x_elements)
                   .rangeBands([0, total_heatmap_width]);

    let xAxis = d3.svg.axis()
                  .scale(xScale)
                  .tickFormat(function (d) {
                      return d;
                  })
                  .orient("top");

    let yScale = d3.scale.ordinal()
                   .domain(y_elements)
                   .rangeBands([0, y_elements.length * (row_height + row_spacer)]);

    let yAxis = d3.svg.axis()
                  .scale(yScale)
                  .tickFormat(function (node_id) {
                      return genome_properties_tree.node_index[node_id].name
                  })
                  .orient("right");

    let colorScale = d3.scale.ordinal()
                       .domain(['NO', 'PARTIAL', 'YES'])
                       .range(["#f7f7f7", "#c2a5cf", "#7b3294"]);

    /* Create heatmap cells. */
    heatmap_svg_group.selectAll('rect')
                     .data(heatmap_data)
                     .enter().append('g').append('rect')
                     .attr('class', 'cell')
                     .attr('width', heatmap_cell_width)
                     .attr('height', row_height)
                     .attr('y', function (heatmap_data_point) {
                         return yScale(heatmap_data_point.node_id);
                     })
                     .attr('x', function (heatmap_data_point) {
                         return xScale(heatmap_data_point.genome);
                     })
                     .attr('fill', function (heatmap_data_point) {
                         return colorScale(heatmap_data_point.propertyStatus);
                     });


    /* Append the y axis of the heatmap. */
    heatmap_svg_group.append("g")
                     .attr("class", "y-axis")
                     .call(yAxis)
                     .attr("transform", function () {
                         return "translate(" + (total_heatmap_width + y_axis_label_offset) + ")";
                     })
                     .selectAll('text')
                     .attr('font-weight', 'normal');

    /* Append the x axis of the heatmap. */
    diagram_header_svg.append("g")
                      .attr("transform",
                            "translate(" + heatmap_left_offset + "," + (diagram_top_offset + x_axis_label_axis_offset) + ")")
                      .attr("class", "x-axis")
                      .call(xAxis)
                      .selectAll('text')
                      .attr('font-weight', 'normal')
                      .style("text-anchor", "start")
                      .attr("dx", ".8em")
                      .attr("dy", ".5em")
                      .attr("transform", function () {
                          return "rotate(-65)";
                      });
}

/**
 * Since it is possible to have repeated genome properties on cousin branches of the tree we cannot
 * return just set set of y elements.
 *
 * @param {array} heatmap_data: A list of per cell heatmap.
 * @param {array} x_elements: The x_elements representing columns of the heatmap.
 * @return {array} The y elements with successive .
 */
function deduplicated_y_elements(heatmap_data, x_elements)
{
    const number_of_samples = x_elements.length;

    return d3.map(heatmap_data.map(function (item) {
        return item.node_id;
    })).values().filter(function (value, index) {
        return index % number_of_samples === 0;
    });
}

/**
 * Takes the clicked tree node and creates a new tab with information on
 * the EBI website about the genome property for which the node represents.
 *
 * @param hovered_tree_node: The tree node that was hovered.
 */
function generate_tooltip_html_content(hovered_tree_node)
{
    let header = "<h6>" + hovered_tree_node.property_id + "</h6>";
    let name = "<p>" + hovered_tree_node.name + "</p>";
    let desc = "<p>" + "This is a mock property description it can be long." + "</p>";
    let out_links = '<p>Links</p>';
    let ebi_url = "https://www.ebi.ac.uk/interpro/genomeproperties/#" + hovered_tree_node.property_id;
    let ebi_link = '<a target="_blank" rel="noopener noreferrer" href="' + ebi_url + '">EBI</a>';

    return header + name + desc + out_links + ebi_link
}

/**
 * Determines if a leaf node should be filtered.
 *
 * @param leaf_tree_node: The tree node.
 * @param leaf_ids Ids of valid leaf nodes that should be filtered.
 * @return {boolean} Should the node be filtered?
 */
function should_node_be_filtered(leaf_tree_node, leaf_ids)
{
    let keep_node = false;
    if ($.inArray(leaf_tree_node.node_id, leaf_ids) < 0)
    {
        keep_node = true
    }
    return keep_node
}

/**
 * Draws the heatmap portion of the genome properties visualisation.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} diagram_parameters: The global parameters for the diagram from the server.
 * @param {object} global_parameters: Settings from the server.
 * @param {object} tree_parameters: Heatmap settings from the server.
 * @param {group} tree_svg_group: The SVG group to which contain the heatmap portion of the visualisation.
 * @param {object} tooltip: The tooltip object.
 */
function draw_tree(genome_properties_tree, diagram_parameters, global_parameters,
                   tree_parameters, tree_svg_group, tooltip)
{
    const tree_height = calculate_tree_height(genome_properties_tree, global_parameters);
    const tree_width = calculate_tree_width(genome_properties_tree, tree_parameters);

    const virtual_leaf_ids = genome_properties_tree.leafs().map(function (leaf) {
        return leaf.node_id
    });
    const real_leaf_ids = genome_properties_tree.leafs(false).map(function (leaf) {
        return leaf.node_id
    });

    let partition = d3.layout.partition()
                      .size([tree_height, tree_width])
                      .value(function (leaf_tree_node) {
                          let leaf_node_in_global_tree = genome_properties_tree.node_index[leaf_tree_node.node_id];

                          let number_of_childs = 1;
                          if (leaf_node_in_global_tree.enabled && leaf_node_in_global_tree.children)
                          {
                              number_of_childs = leaf_node_in_global_tree.children.length;
                          }

                          return number_of_childs;
                      })
                      .sort(null);

    let nodes = partition.nodes(genome_properties_tree.pruned_tree());

    /* Create tree cells. */
    tree_svg_group.selectAll(".node")
                  .data(nodes)
                  .enter().append("rect")
                  .attr("class", function (leaf_tree_node) {
                      if ($.inArray(leaf_tree_node.node_id, real_leaf_ids) < 0)
                      {
                          return 'node'
                      }
                      else
                      {
                          return 'node node-terminal'
                      }
                  })
                  .attr("x", function (d) {
                      return d.y + tree_parameters['column_spacer'];
                  })
                  .attr("y", function (leaf_tree_node) {
                      return leaf_tree_node.x;
                  })
                  .attr("width", function () {
                      return tree_parameters['cell_width'];
                  })
                  .attr("height", function (leaf_tree_node) {
                      return (leaf_tree_node.dx - global_parameters['row_spacer']);
                  })
                  .attr("id", function (leaf_tree_node) {
                      return (leaf_tree_node.node_id);
                  })
                  .on("click", function (clicked_tree_node) {
                      if ($.inArray(clicked_tree_node.node_id, real_leaf_ids) < 0)
                      {
                          draw_diagram_updated(genome_properties_tree, diagram_parameters, clicked_tree_node);
                      }
                  });

    /* Add tree cell labels. */
    tree_svg_group.selectAll(".label")
                  .data(nodes.filter(function (leaf_tree_node) {
                      return should_node_be_filtered(leaf_tree_node, virtual_leaf_ids);
                  }))
                  .enter().append("text")
                  .attr("class", "label")
                  .attr("dy", ".35em")
                  .attr("transform", function (leaf_tree_node) {
                      return "translate(" + (leaf_tree_node.y + leaf_tree_node.dy / 2) + "," +
                          (leaf_tree_node.x + leaf_tree_node.dx / 2) +
                          ")rotate(270)";
                  })
                  .text(function (leaf_tree_node) {
                      return leaf_tree_node.name;
                  });

    /* Create tree out-link boxes. */
    tree_svg_group.selectAll(".link_out")
                  .data(nodes.filter(function (leaf_tree_node) {
                      return should_node_be_filtered(leaf_tree_node, real_leaf_ids);
                  }))
                  .enter().append("image")
                  .attr("class", "link_out")
                  .attr("xlink:href", "assets/external.svg")
                  .attr("x", function (leaf_tree_node) {
                      return leaf_tree_node.y + tree_parameters['column_spacer'];
                  })
                  .attr("y", function (leaf_tree_node) {
                      return leaf_tree_node.x + leaf_tree_node.dx - tree_parameters['link_out_height'];
                  })
                  .attr("width", function () {
                      return tree_parameters['cell_width'];
                  })
                  .attr("height", function () {
                      return (tree_parameters['link_out_height'] - global_parameters['row_spacer']);
                  })
                  .on("mouseover", function (hovered_tree_node) {
                      let tooltip_width = 120;

                      tooltip.transition()
                             .duration(500)
                             .style("opacity", .9)
                             .style("width", tooltip_width + "px")
                             .style("display", 'block');

                      let html = generate_tooltip_html_content(hovered_tree_node);

                      tooltip.html(html)
                             .style("left", (d3.event.pageX - (tooltip_width / 2)) + "px")
                             .style("top", (d3.event.pageY) + "px");

                      tooltip
                          .on("mouseover", function () {
                              tooltip.transition()
                                     .duration(0)
                                     .style("opacity", .9)
                                     .style("display", 'block');
                          })
                          .on("mouseout", function () {
                              tooltip.transition()
                                     .duration(500)
                                     .style("opacity", 0)
                                     .style("display", 'none');
                          })
                  })
                  .on("mouseout", function () {
                      tooltip.transition()
                             .duration(500)
                             .style("opacity", 0)
                             .style("display", 'none');
                  });
}

/**
 * Draws the genome properties diagram.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} diagram_parameters: The global parameters for the diagram from the server.
 */
function draw_diagram(genome_properties_tree, diagram_parameters)
{
    let margin_parameters = diagram_parameters['margins'];
    let global_parameters = diagram_parameters['global'];
    let heatmap_parameters = diagram_parameters['heatmap'];
    let tree_parameters = diagram_parameters['tree'];
    let top_offset = global_parameters['top_offset'];
    let x_axis_offset = heatmap_parameters['axes']['x_axis_label_offset'];

    let left_margin = margin_parameters['left'];
    let right_margin = margin_parameters['right'];
    let top_margin = margin_parameters['top'];
    let bottom_margin = margin_parameters['bottom'];

    let diagram_height = calculate_diagram_height(genome_properties_tree, global_parameters);
    let tree_width = calculate_tree_width(genome_properties_tree, tree_parameters);
    let heatmap_width = calculate_heatmap_width(genome_properties_tree, heatmap_parameters);

    let diagram_width = tree_width + heatmap_width;

    let svg_height = diagram_height + top_margin + bottom_margin;
    let svg_width = diagram_width + left_margin + right_margin;

    let tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

    let diagram_header = d3.select('.visualization')
                           .append('div')
                           .attr("class", 'row vis_row')
                           .append("svg")
                           .attr("class", "diagram_header")
                           .attr("width", svg_width)
                           .attr("height", top_offset + x_axis_offset);

    let diagram_core = d3.select('.visualization')
                         .append('div')
                         .attr("class", 'row vis_row')
                         .append("svg")
                         .attr("class", "diagram")
                         .attr("width", svg_width)
                         .attr("height", svg_height);

    let diagram_top_offset = (margin_parameters.top + global_parameters['top_offset']);
    let heatmap_left_offset = margin_parameters.left + tree_width + (heatmap_parameters['cell_width'] / 2);

    let heatmap = diagram_core.append("g")
                              .attr("transform", "translate(" + heatmap_left_offset + "," + diagram_top_offset + ")");

    let tree = diagram_core.append("g")
                           .attr("transform", "translate(" + (margin_parameters.left) + "," + diagram_top_offset + ")");

    draw_heatmap(genome_properties_tree, global_parameters, heatmap_parameters, heatmap, diagram_header,
                 heatmap_left_offset);
    draw_tree(genome_properties_tree, diagram_parameters, global_parameters, tree_parameters, tree, tooltip);

    update_genome_properties_info(genome_properties_tree.visible_properties());
}

/**
 * Once a node in the tree is clicked. Change the state of the tree nodes children on or off and redraw the diagram.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} diagram_parameters: The global parameters for the diagram from the server.
 * @param {object} clicked_tree_node: The tree node that was clicked.
 */
function draw_diagram_updated(genome_properties_tree, diagram_parameters, clicked_tree_node)
{
    d3.event.stopPropagation();
    let leaf_node_id = clicked_tree_node.node_id;
    genome_properties_tree.switch_node_enabled_state(leaf_node_id);

    delete_existing_diagram();
    draw_diagram(genome_properties_tree, diagram_parameters);
    scroll_diagram_to_tree_node(leaf_node_id);
}

/**
 * Draws a version of genome properties diagram which displays just the top level properties.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} diagram_parameters: The global parameters for the diagram from the server.
 */
function draw_diagram_reset(genome_properties_tree, diagram_parameters)
{
    genome_properties_tree.reset();
    let root_node_id = genome_properties_tree.root.node_id;

    delete_existing_diagram();
    draw_diagram(genome_properties_tree, diagram_parameters);
    scroll_diagram_to_tree_node(root_node_id);
}

/**
 * Draws diagram expanded to a specific genome property in the genome properties tree.
 *
 * @param {object} genome_properties_tree: A genome properties tree object from the server.
 * @param {object} diagram_parameters: The global parameters for the diagram from the server.
 * @param {string} genome_property_id: The genome property id (e.g. GenProp0178) of the
 */
function draw_diagram_expanded_to_property(genome_properties_tree, diagram_parameters, genome_property_id)
{
    genome_properties_tree.reset();
    let first_node_id = genome_properties_tree.genome_property_id_to_node_id_index[genome_property_id][0];
    genome_properties_tree.create_path_to_node(first_node_id);

    delete_existing_diagram();
    draw_diagram(genome_properties_tree, diagram_parameters);
    scroll_diagram_to_tree_node(first_node_id);
}

/**
 * Deletes the existing diagram so we can draw a new one.
 */
function delete_existing_diagram()
{
    $('.vis_row').remove();
    $('.tooltip').remove();
}

/**
 * Scrolls the page to line up with a given node in the diagram.
 *
 * @param {number} tree_node_id: The node identifier of the node to scroll to.
 */
function scroll_diagram_to_tree_node(tree_node_id)
{
    let scroll_point = get_element_top_offset(String(tree_node_id)) - $('.diagram_header').height();
    $([document.documentElement, document.body]).animate({scrollTop: scroll_point}, 1000);
}

/**
 * Find the offset from the top of a html element to the top of a page.
 *
 * @param {string} element_id: The id of the html element to find a top of.
 * @return {number} The top offset.
 */
function get_element_top_offset(element_id)
{
    let html_element = document.getElementById(element_id);
    let body_rectangle = document.body.getBoundingClientRect();
    let element_rectangle = html_element.getBoundingClientRect();
    return element_rectangle.top - body_rectangle.top;
}
