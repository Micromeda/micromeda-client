/**
 * Created by: Lee Bergstrand (2018)
 * Edited by: Santiago Ruiz-Navas (2020)
 * Description: HTML content for the download view of micromeda-viz.
 * Added description: Drawing the genome properties diagram.
 */
function draw_top_navbar(topnavbar_parameters){
    let topnavbar = d3.select("body")
        .append("nav")
        .attr("class","navbar navbar-expand-lg navbar-light bg-light")
        .style("width",topnavbar_parameters['width'])
        .style("z-index",100)
            .append("div").attr("class","container-fluid")
    ;
    //INTERACTIVE TITLE OF THE WEBSITE
    topnavbar.append("img")
        .attr("src",topnavbar_parameters['logo_url'])
        .attr("class","d-inline-block align-top")
    ;
    topnavbar.append("a")
        .attr("href","#")
        .attr("class","navbar-brand")
        .style("margin-left","1rem")
        .text(topnavbar_parameters['tile_text'])
    ;
    //BUTTON TO HIDE THE RESET AND SEARCH BAR WHEN THE SCREEN IS SMALL
    topnavbar.append("button")
        .attr("class","navbar-toggler")
        .attr("type","button")
        .attr("data-toggle","collapse")
        .attr("data-target","#navbarSC")
        .attr("aria-controls","navbarSC")
        .attr("aria-expanded","false")
        .attr("aria-label","Toggle Navigation")
        .append("span")
            .attr("class","navbar-toggler-icon")
    ;

    let topnavbar_elements  = topnavbar.append("div")
        .attr("class","collapse navbar-collapse")
        .attr("id","navbarSC")
        .attr("position","relative")
        .style("z-index",50)
    ;
    // If you want to add cotrols to the navbar add them in topnavbar_elements 
}

function draw_dropzone(){
    let dropzone_form = d3.select("body")
        .append("div")
        .attr("class","container-fluid d-flex justify-content-center")
            .append("div")
            .attr("class","col-md-10 col-md-offset-1")
                .append("div")
                .attr("class","col-md-12")
                    .append("form")
    ;
    let dropzone_area = dropzone_form.append("div")
        .attr("class","row")
        .append("div")
            .attr("class","col-md-12")
                .append("div")
                    .attr("class","dropzone")
    ;
    dropzone_area.append("div")
        .attr("class","dz-default dz-message")
        .text("Drop Micromeda files here or click to upload.")
    ;
    dropzone_area.append("div")
        .attr("class","dropzone-previews")
    ;
    dropzone_form.append("div")
        .attr("class","row")
        .append("div")
            .attr("class","col-md-12")
            .append("div")
                .attr("id","progress_bars")
    ;
}

function draw_footer(footer_parameters){
    let foot = d3.select("body")
        .append("footer")
        .attr("class","footer bg-light")
        .style('position','fixed')
        .style('bottom',footer_parameters['bottom'])
        .style("width",footer_parameters['width'])
        .style("height",footer_parameters['height'])
        .style("z-index",100)
            .append("div")
            .attr("class","fc")
            .style("width","auto")
            .style("text-align","center")
                .append("p")
                .attr("class","pfc")
                .style("color","#777")
                .style("margin","0")
                .text(footer_parameters['footer_text'])
    ;
}



