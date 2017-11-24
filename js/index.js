$(window).on('load', function () {
    $.getJSON('data/test_organism_gen_props.json', function (genome_properties_tree) {
        console.log(genome_properties_tree);
        var root_genome_property = genome_properties_tree.root;

        var genome_properties_names = create_genome_property_name_list(root_genome_property);
        console.log(genome_properties_names);

        fill_drop_down_menu(genome_properties_names);

        var cell_diagram_container = $("#cell-diagram");

        var diagram_width = cell_diagram_container.width();
        var diagram_height = cell_diagram_container.height();

        var cell_diagram_root = d3.select("#cell-diagram").append("svg")
                                  .attr("width", diagram_width)
                                  .attr("height", diagram_height);

        render_cell(root_genome_property, cell_diagram_root)
    })
});

function fill_drop_down_menu(genome_properties_names)
{
    var gen_prop_drop_down_div = $('#genprop_drop');

    for (var index in genome_properties_names)
    {
        var name = genome_properties_names[index];

        gen_prop_drop_down_div.append('<p>' + name + '</p>')
    }
}

function create_genome_property_name_list(root_genome_property)
{
    var genome_properties_names = [];
    var children = root_genome_property.children;

    for (var index in children)
    {
        var child = children[index];

        genome_properties_names.push(child.name);

        if (child.children !== null)
        {
            var grand_child_names = create_genome_property_name_list(child);
            genome_properties_names = genome_properties_names.concat(grand_child_names)
        }
    }

    return genome_properties_names
}

function render_cell(root_genome_property, diagram_root)
{
    var root_node = diagram_root.node().getBoundingClientRect();
    var diagram_width = root_node.width;
    var diagram_height = root_node.height;

    console.log(root_node);

    var cell_width = 0.6 * diagram_width;
    var cell_height = 0.38 * cell_width;

    console.log(cell_height);
    console.log(cell_width);

    var cell_start_vertical = (diagram_height - cell_height) / 2;
    var cell_stop_vertical = (cell_start_vertical + cell_height);

    var cell_start_horizontal = (diagram_width - cell_width) / 2;
    var cell_stop_horizontal = (cell_start_horizontal + cell_width);

    var circle_data = [
        [cell_start_horizontal, cell_start_vertical],
        [cell_stop_horizontal, cell_start_vertical],
        [cell_stop_horizontal, cell_stop_vertical],
        [cell_start_horizontal, cell_stop_vertical]
    ];

    var cell_membrane = diagram_root.append("path")
                                    .data([circle_data])
                                    .attr("d", d3.line().curve(d3.curveCardinalClosed))
                                    .attr("stroke", "grey")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none");

    var properties_to_draw = select_properties_to_draw(root_genome_property);
    console.log(properties_to_draw);

    var membrane_path = cell_membrane.node();
    var membrane_length = membrane_path.getTotalLength();

    var slice_length = membrane_length / (properties_to_draw.length);

    var membrane_path_positions = [];
    var current_position = 0;

    while (current_position < membrane_length)
    {
        membrane_path_positions.push(current_position);
        current_position += slice_length
    }

    console.log(membrane_path_positions);

    var placement_coordinates = [];
    for (var index_two in membrane_path_positions)
    {
        var primary_position = membrane_path_positions[index_two];
        var secondary_position = primary_position + 1;

        if (secondary_position >= membrane_length)
        {
            secondary_position = primary_position - 1;
        }

        var primary_svg_point = membrane_path.getPointAtLength(primary_position);
        var secondary_svg_point = membrane_path.getPointAtLength(secondary_position);

        // Cross platform compatible path point angle calculation.
        var rotation = Math.round(Math.atan2(primary_svg_point.y - secondary_svg_point.y, primary_svg_point.x - secondary_svg_point.x) * (180 / Math.PI)) + 180;
        var x_coordinate = Math.round(primary_svg_point.x);
        var y_coordinate = Math.round(primary_svg_point.y);


        var coordinates = [x_coordinate, y_coordinate, rotation];
        placement_coordinates.push(coordinates)
    }

    console.log(placement_coordinates);

    for (var index in placement_coordinates)
    {
        var element_placement_position = placement_coordinates[index];

        var integral_component_url = "data/singe_transporter.svg";

        var width = 100;
        var height = 100;
        var angle = element_placement_position[2];
        var width_offset = (width / 2);
        var height_offset = (height / 2);

        var final_position = [(element_placement_position[0] - width_offset), (element_placement_position[1] - height_offset)];
        var rotation_position = [angle, width_offset, height_offset];

        var img = diagram_root.append("svg:image")
                              .attr("xlink:href", integral_component_url)
                              .attr("width", width)
                              .attr("height", height)
                              .attr("transform", "translate(" + final_position + ")rotate(" + rotation_position + ")");
    }
}

function select_properties_to_draw(root_genome_property)
{
    var genome_properties_to_draw = [];
    var children = root_genome_property.children;

    for (var index in children)
    {
        var child = children[index];

        if (child.artwork === true)
        {
            genome_properties_to_draw.push(child);
        }

        if (child.children !== null)
        {
            var grand_child_names = select_properties_to_draw(child);
            genome_properties_to_draw = genome_properties_to_draw.concat(grand_child_names)
        }
    }

    return genome_properties_to_draw
}

