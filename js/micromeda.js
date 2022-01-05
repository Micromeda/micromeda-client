/**
 * Created by: Lee Bergstrand (2018)
 * Edited by: Santiago Ruiz-Navas (2020)
 * Description: Functions for drawing the genome properties diagram.
 * Added description: Drawing the genome properties diagram.
 */


let raw_data;      //global container for the JSON data tree object
let selected_data;      //global container for the JSON data tree object
let diagram_all_parameters; //global container for the diagram config file
let loaded_micromeda_file = false; //global container for the diagram config file
let back_end_url          = "";
const minZoom             = 0.5;
const maxZoom             = 1.2;
const zScale                = d3.scaleLinear()
    .domain([0,100])
    .range([minZoom,maxZoom])
;
/**
 * Initialize the connection to the back-end and loads micromeda data
 *
 * 
 * 
 */

$(document).ready(function () {
    
    $.getJSON('./configs/application_configuration.json', function (config) {
        back_end_url = config['back_end_url'];

        localforage.config({name: 'micromeda', storeName: 'micromeda_data'});
        localforage.getItem('micromeda-result-key').then(function (result_key) {
            if (result_key === null)
            {
                // here the application speaks to the back-end (server), but it answers that there is no tree. So, I will pass it a Json tree inside the data folder. 
                //get_diagram_data("./data/gp_assignments.json");
                get_diagram_data("./data/Json_output_e.json");
            }
            else
            {
                get_diagram_data(back_end_url + "genome_properties_tree" + '?result_key=' + result_key);
                loaded_micromeda_file = true;
            }
        }).catch(function (err) {
            console.log(err);
        });
    });
});

function get_diagram_data(backend_tree_url)
{
    $.getJSON(backend_tree_url, function (genome_properties_data) {
        $.getJSON("./configs/diagram_configuration.json", function (diagram_parameters) {
            //initialize global variables
            diagram_all_parameters = diagram_parameters;
            raw_data               = genome_properties_data.property_tree;
            draw_top_navbar(diagram_parameters['topnavbar']);
            draw_content_container(diagram_parameters);
            draw_heatmap(diagram_parameters,genome_properties_data.sample_names);
            //FOLLOWup with sample names
            draw_tool_tips(diagram_parameters['general_content']);
            draw_footer(diagram_parameters['footer']);
            setup_object_actions(diagram_parameters);
            draw_sample_names(genome_properties_data.sample_names,diagram_parameters);
            initHeatmapData(genome_properties_data.property_tree,diagram_parameters);
        });
    });
}
