/**
 * Created by: Lee Bergstrand (2018)
 * Description: Functions for drawing the genome properties diagram.
 */

const back_end_url = 'http://0.0.0.0:5000/';

$.ajaxSetup({
                xhrFields: {
                    withCredentials: true
                }
            });

$.getJSON(back_end_url + "genome_properties_tree", function (genome_properties_data) {
    $.getJSON("configs/diagram_configuration.json", function (diagram_parameters) {
        let genome_properties_tree = new Genome_Properties_Tree(genome_properties_data);
        genome_properties_tree.reset();

        draw_diagram(genome_properties_tree, diagram_parameters);

        update_genome_properties_info(genome_properties_tree.visible_properties());

        $(document).ready(function () {
            $('.property_selection').select2(
                {
                    placeholder: 'Search for properties',
                    theme: "bootstrap4",
                    data: genome_properties_tree.select_data
                });
        });

        $('.property_selection').on('select2:select', function (event) {
            event.preventDefault();
            let data = event.params.data;
            let genome_property_id = data.id.split('-')[1];
            draw_diagram_expanded_to_property(genome_properties_tree, diagram_parameters, genome_property_id)
        });

        $('.reset').on('click', function () {
            draw_diagram_reset(genome_properties_tree, diagram_parameters)
        })
    });
});


function update_genome_properties_info(genome_property_ids)
{
    for (let id_index in genome_property_ids)
    {
        let current_id = genome_property_ids[id_index];

        localforage.getItem(current_id).then(function (local_genome_properties_data) {
            if (local_genome_properties_data === null)
            {
                let data_url = back_end_url + 'genome_properties/' + current_id;
                jQuery.getJSON(data_url, function (remote_genome_properties_data) {
                    localforage.setItem(current_id, remote_genome_properties_data).then(function () {

                    }).catch(function (err) {
                        console.log(err);
                    });
                })
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}

