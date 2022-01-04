/**
 * Created by: Lee Bergstrand (2018)
 * Edited by: Santiago Ruiz-Navas (2020)
 * Description: An object for representing the genome properties tree.
 * Added description: Functions interacting with the genome properties JSON data.
 */
// Initialize JSON object and internal variables
// Get parent path to expand when using the searchbar2. 
// Create pathway filter
// Create metapathway filter
// Expand all 
// Reset
// Filter Unique
// functions to interact with the JSON object/Aka the tree

/**
 * Collapses a Json object to its root
 *
 * @param {object} d the JSON object.
 * 
 */
function collapse(d) {
  if(d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}
/**
 * Expands a Json object to its last leaf
 *
 * @param {object} d the JSON object.
 * 
 */
function expand(d) {
  if(d._children) {
    d.children = d._children;
    d._children.forEach(expand);
    d._children = null;
  }
}

/**
 * Follows a node, and expands all its parents. 
 *
 * @param {object} d the JSON object.
 */
function expandAllParents(d){
    if(d._children){

        d.children = d._children;
        d._children = null;
    }else{

    }
    if(d.parent){
        expandAllParents(d.parent);
    }else{

    }
}

/**
 * Searchs for a target node, finds it and expands all its parents. 
 *
 * @param {object} d the JSON object.
 * @returns {object} the target node
 */
let o;
let tofind;
function getFilteredData(d) {
    //if(d.data.name.toLowerCase().replace(/\s+/g, '').replace(/[^\w\s]/gi, '') === tofind.toLowerCase().replace(/\s+/g, '').replace(/[^\w\s]/gi, '')){
    if(d.idx === tofind){
        //console.log("match");
        o = d;
        expandAllParents(o);
    }else{
       // console.log("did not find it search children");
        if(d._children){
            d._children.forEach(getFilteredData);

        }else{

        }

    }
    return o;
}


/**
 * Follows a node, finds all its parents and creates a path line to their parents. 
 *
 * @param {object} d the JSON object.
 * @param {logic} ptp flog to stop the search of the last parent of the node. 
 * @returns {object} output a line that can be drawn using a svg object. 
 */
let ptp = false;
function get_path_to_parent(d) {
    if(ptp ===false){
        output = "M" + (d.yLinkScaledLenght) + "," + (d.nodeY-1) +" L"+ (d.yLinkScaledLenght) + "," + d.nodeY;
        ptp = true;
    }
    if(d.parent) {
      //create the path there
        output = output + " L" + d.parent.yLinkScaledLenght + "," + d.nodeY
                        + " L" + d.parent.yLinkScaledLenght + "," + d.parent.nodeY; 
        output = output + get_path_to_parent(d.parent);
    }else{
        ptp = false;
    }

  return(output);
}

/**
 * Expands or collapses the children of a node and updates graph after that. 
 *
 * @param {object} d the JSON object.
 */
function click(d) {
  if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

  updateGraph(d);
}

/**
 * Set of functions that manage the cursor appearance when exploring the functions in the heatmap. 
 *
 * @param {object} d the JSON object containing the annotated tree information.
 */
function OnMouseOverExpand(d){
    d3.select(this).style("cursor", "zoom-in"); 
}
function OnMouseOverCollapse(d){
    d3.select(this).style("cursor", "zoom-out"); 
}
function OnMouseOverNoMore(d){
    d3.select(this).style("cursor", "not-allowed"); 
}

/**
 * Set of functions that use the fitler method from a javascript object to filter the tree contents. 
 *
 * @param {object} element the JSON object containing the annotated tree information.
 * @param {object} index the JSON object containing the annotated tree information.
 * @param {object} array the JSON object containing the annotated tree information.
 * @return {object} a node of the JSON annotated tree.
 */
function filter_partial_y(element, index, array) {
    return element === "YES";
}
function filter_partial_p(element, index, array) {
    return element === "PARTIAL";
}
function filter_partial_n(element, index, array) {
    return element === "NO";
}
function filter_partial_yp(element, index, array) {
    return (element === "YES" || element === "PARTIAL");
}
function filter_partial_yn(element, index, array) {
    return (element === "YES" || element === "NO");
}
function filter_partial_pn(element, index, array) {
    return (element === "PARTIAL" || element === "NO");
}
function filter_partial_ypn(element, index, array) {
    return (element === "PARTIAL" || element === "NO" || element === "YES");
}
function filter_partial_special(element, index, array) {
    return (element !== array[0]);//you have at least one different result
}
/**
 * When the JSON does not have the type of each node, this function will initialize them.
 *
 * @param {object} d the tree data JSON object to initialize
 * @param {object} global_parameters global parameters coming from the config file.
 */
function initJson(d, global_parameters){
    if (d.property_id){

        let o = global_parameters['meta-pathways_genprop'].filter(function(x){
            return x===d.property_id;
        });
        if(o.length>0){
            d.type = "metapathway";
        }else{
            //check if the 
            o = global_parameters['pathways_genprop'].filter(function(x){
                return x===d.property_id;
            });
            if(o.length>0){
                d.type = "pathway";
            }else{
                // try guild
                d.type = "all";
            }

        }
    }else{
    }
    if (d.children) d.children.forEach(function(d) { initJson(d,global_parameters); });
    return(d);
}
/**
 * Function that filters the nodes by its type e.g., "all","pathway", "metapathway"
 *
 * @param {object} d the tree data JSON object to initialize
 * @param {object} t type of node one wants to filter, "all","pathway", "metapathway"
 * @param {object} v vector that collects the filtered nodes
 * @param {object} filter_function filter function to use
 */
function filterType(d,t,v,filter_function){
    if(d.type){
        if (d.type===t){
            // check if the node follows the partial, no and yes filter. 
            if(filter_function ===filter_partial_special){

                if (d.result.some(filter_function)){
                    v.push(d);
                }else{

                }
            }else{
                if (d.result.every(filter_function)){
                    v.push(d);
                }else{

                }
            }

        }else{

        }
    }else{

    }
    if (d.children) d.children.forEach(function(d) { filterType(d,t,v,filter_function); });
}                    
/**
 * a wrapper function for the filter function 
 *
 * @param {object} d the tree data JSON object to initialize
 * @param {object} t type of node one wants to filter, "all","pathway", "metapathway"
 * @param {object} filter_function filter function to use
 */
function filterTypeW(d,t,filter_function){//add a call to the special filter function. 
    let met_vector = [];
    filterType(d,t,met_vector,filter_function);
    return(met_vector);
}
/**
 * Borrowed function,  get unique elements of an array.
 *
 * @param {object} arr  array of elements to process
 * @param {object} comp property of the elements to use as a guide to eliminate repeated elements
 * @return {vector} unique elements of an array 
  */
function getUnique(arr, comp) {
    // store the comparison  values in array
    const unique =  arr.map(e => e[comp])

    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);

    return unique;
}

/**
 * Initializing custom variables for each node in the Json data tree.
 *
 * @param {object} d  JSON tree data object
 * @param {object} y0 depth of the JSON tree data object (the size of the longest tree branch) 
 * @param {object} k  The size of the space in-between the center of each square in the heatmap
 * @return {object} modified d JSON tree data object
  */
function initCustomVars(d, y0, k) {
    let parent_string = "root";
    if(d.parent){
        parent_string = d.parent.data.property_id;
    }else{
        parent_string = "root";
    }
    let h = d.data.property_id?d.data.property_id:d.data.step_id;// the name, lowecase and with no spaces.
    d.yLinkScaledLenght = (y0= (1+d.depth)) * k; //like an X distribution of the links in the Y axis network
    d.idx               = "idx"+d.data.name.toLowerCase().replace(/\s+/g, '').replace(/[^\w\s]/gi, '')+h+parent_string;
    if (d.children) d.children.forEach(function(d) { initCustomVars(d, y0, k); });
    return(d);
}

/**
 * Animation of a gradually change of color
 *
 * @param {object} target_color  the final color
 * @param {object} target_object the d3 select object which the color will be changed
   */
function borderTween(target_color,target_object) {
    return function() {
    let ip = d3.interpolateRgb(target_object.style("fill"),target_color);
    return function(t) { 
        target_object.style("fill",ip(t));
    };
  };
} 
/**
 * Animating the movement of the screen to a target object
 * @param {object} offset  the final color
*/
function scrollTween(offset) {
  return function() {
    let ip = d3.interpolateNumber(d3.select(".mct").property("offsetTop"), offset);
    return function(t) { d3.select(".mct").node().scrollTo(0, ip(t)); };
  };
}

function is_node_downloadable(d){
    return(d.data.step_id && !d.data.result.every(d =>d==="NO"));
}
//@param {object} rawJson the JSON tree data
//@param {object} general_parameters config file parameters
//@return {object} selected_data the tree to play with for the next steps
function initHeatmapData (){
    //init the colors from the legends objects
    //init the data from the checkboxes
    let heatmap_parameters = diagram_all_parameters.general_content.heatmap;
    let margin_parameters  = diagram_all_parameters.margins;
    let filter_mode        = Number(d3.select(".fry").property("checked")).toString() + Number(d3.select(".frp").property("checked")).toString() + Number(d3.select(".frn").property("checked")).toString()+ Number(d3.select(".frs").property("checked")).toString();//testing the glo
    let filter_function    = filter_partial_ypn;
    initJson(raw_data,diagram_all_parameters.global);

    
    switch(filter_mode) {
        case "0010":
            //Get only NO
            filter_function = filter_partial_n;
        break;
        case "0100":
            //Get only PARTIAL
            filter_function = filter_partial_p;
        break;
        case "0110":
            //Get PARTIAL OR NO
            filter_function = filter_partial_pn;
        break
        case "1000":
            //Get only YES
            filter_function = filter_partial_y;
        break
        case "1010":
            //Get YES OR NO
            filter_function = filter_partial_yn;
        break
        case "1100":
            //Get YES OR PARTIAL
            filter_function = filter_partial_yp;
        break
        case "1110":
            ////Get YES OR PARTIAL OR NO (all)
            filter_function = filter_partial_ypn;
        break
        case "0001":
            ////Get special
            filter_function = filter_partial_special;
        break
        default:
          // code block
          console.log("whaaaat?");
    }
    let metapathways_vector        = filterTypeW(raw_data,"metapathway",filter_function);
    let pathways_vector            = filterTypeW(raw_data,"pathway",filter_function);

    let metapathways_vector_unique = getUnique(metapathways_vector,'name');
    let pathways_vector_unique     = getUnique(pathways_vector,'name');
    
    //******************************************************
    //**     TRANSFORMING TO D3 HIERARCHY OBJECT JSON     **
    //******************************************************
    let all_data         = d3.hierarchy(raw_data,function(d){return d.children;});
    let metapathway_data = d3.hierarchy({"children":metapathways_vector_unique,"enabled":false,"name":"meta-pathways","property_id":"GenProp_metapaths","result":raw_data.result},function(d){return d.children;});
    let pathway_data     = d3.hierarchy({"children":pathways_vector_unique,"enabled":false,"name":"pathways","property_id":"GenProp_paths","result":raw_data.result},function(d){return d.children;});

    initCustomVars(all_data, all_data.depth, heatmap_parameters.Y_link_lenght / all_data.height);

    initCustomVars(metapathway_data, metapathway_data.depth, heatmap_parameters.Y_link_lenght / metapathway_data.height);
    initCustomVars(pathway_data, pathway_data.depth, heatmap_parameters.Y_link_lenght / pathway_data.height);
    
    let counter = 0;
    all_data.eachBefore(function(d){
        d.or = counter;//or stands for order
        counter++;
        return(d.or);
    });
    counter = 0;
    metapathway_data.eachBefore(function(d){
        d.or = counter;//or stands for order
        counter++;
        return(d.or);
    });
    counter = 0;
    pathway_data.eachBefore(function(d){
        d.or = counter;//or stands for order
        counter++;
        return(d.or);
    });
    counter = 0;
    
    //######################################################################
    //##                 FILTERING PATH, METAPATH AND ALL                 ##
    //######################################################################
    let place_holder_text = "Search all functions here";
    selected_data         = all_data;
    
    switch(d3.select(".fms").attr("data-filter")) {
        case "all":
            //console.log("all");
            selected_data     = all_data;
            selected_data.descendants().slice(1).forEach(expand);
            place_holder_text = "Search all functions here";
	    d3.select(".fry").attr("disabled","true");
            d3.select(".frp").attr("disabled","true");
            d3.select(".frn").attr("disabled","true");
            d3.select(".frs").attr("disabled","true");
        break;
        case "path":
            selected_data     = pathway_data;
            selected_data.descendants().slice(1).forEach(expand);
            place_holder_text = "Search for pathways here";
        break;
        case "mpath":
            selected_data     = metapathway_data;
            selected_data.descendants().slice(1).forEach(expand);
            place_holder_text = "Search for metapathways here";
        break
        default:
          console.log("whaaaat?");
    }

    //######################################################################
    //##                 INITIALIZING THE SELECT2 or SEARCH               ##
    //######################################################################
    $('.ndfs').select2({
        placeholder: place_holder_text,
        width: 'resolve',
        minimumInputLength: 3
    }).on("select2:select", function(evt){
            //Conecting the select to the hierarchical dataset
            o="";
            tofind = evt.params.data.id;
            selected_data.descendants().forEach(getFilteredData);
            

            let tar = d3.selectAll("."+o.idx)
                .select(".y-node")
                .style("fill", "blue")
            ;
            d3.transition()
                .duration(1000)
                .tween("scroll", scrollTween(o.nodeY*(d3.select(".chart").attr("scale"))))
                /*.transition()
                    .duration(5000)
                    .tween("selected_text", borderTween("black",tar))*/
            ;
            updateGraph();
        }
    );
    
    //######################################################################
    //##          INITIALIZING THE OPTIONS TO SHOW IN THE SEARCH2         ##
    //######################################################################        
    let opt_Enter = d3.select(".ndfso_names").selectAll(".ndfso_names_options")
        .data(selected_data.descendants(),function(d) {
               return d.idx;
           });
    opt_Enter.join(
        function (enter){
            let optEnter = enter.append("option")
                .attr("class","ndfso_names_options")
                .attr("value",function(d){
                        return d.idx;
                    }
                )
                .text(function(d){
                        return d.data.name;
                    }
                );
            return(optEnter);
        },
        function(update){
            let optUpdate = update;
            optUpdate.select("option.ndfso_names_options")
                .attr("value",function(d){
                            return d.idx;
                        }
                    )
                    .text(function(d){
                        return d.data.name;
                    }
                );
        },
        function(exit){
            let optExit = exit.remove();
            return(optExit);
        }
    );
    selected_data.descendants().slice(1).forEach(collapse);
    //**************************************************************
    //**                    ZOOM                                  **
    //**************************************************************
    const window_width  = window.innerWidth - margin_parameters.left - margin_parameters.right;
    const window_height = window.innerHeight - margin_parameters.top - margin_parameters.bottom;
    let zoomv =  d3.zoom()
        .on("zoom", function () {
            //UPDATE ZOOM BAR
            const scrollRatio = d3.select(".mct").property("scrollTop")/d3.select(".mct").property("scrollHeight");

            d3.select(".chart").transition()
                .duration(1000)
                .attr("transform", " translate("+0+ ","+0+")  scale(" + d3.event.transform.k+")")
                .attr("scale",d3.event.transform.k)
            ;

            //SCALING THE SVG, SO EVEN IF I ZOOM, I CAN STILL EXPLORE THE WHOLE OBJECT
            //updateGraph();
            d3.select(".div_svg").transition()
                .duration(1000)
                .attr("width", (window_width + margin_parameters.left + margin_parameters.right)*d3.event.transform.k)
                .attr("height", (heatmap_parameters.nodeSpaceY*(selected_data.descendants().length)+heatmap_parameters.sample_name_height+20)*d3.event.transform.k)
                .attr("viewBox", [0,0, (window_width + margin_parameters.left + margin_parameters.right)*d3.event.transform.k, (heatmap_parameters.nodeSpaceY*(selected_data.descendants().length)+heatmap_parameters.sample_name_height+20)*d3.event.transform.k])
            ;
            setTimeout(() => {  updateGraph(); }, 1100);
            //
            //SCALING THE Y POSITION OF THE SCROLL BAR TO KEEP THE SCREEN ORIGINAL COORDINATE. BEFORE ZOOMING. 
            //d3.select(".mct").node().scrollTo(0, scrollRatio*d3.select(".mct").property("scrollHeight"));
        })
        .scaleExtent([minZoom, maxZoom])
    ;

    d3.select(".chart").call(zoomv)
        .on("dblclick.zoom", null)
        .on("wheel.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null)
    ;
    d3.select(".zcc").property("value",  80);
    d3.select(".chart").call(zoomv.transform,d3.zoomIdentity.translate(0,0).scale(zScale(d3.select(".zcc").property("value"))));

    d3.select(".chart")
        .attr("transform","scale("+zScale(d3.select(".zcc").property("value"))+")")
        .attr("scale",zScale(d3.select(".zcc").property("value")))
    ;
    //d3.select(".xn").attr('transform', 'translate(' + (heatmap_parameters.Y_link_lenght + heatmap_parameters.link_margin) + ',' + (d3.select(".mct").property("scrollTop")*(1/d3.select(".chart").attr("scale"))) + ')');
    
    d3.select(".xn").attr('transform', 'translate(' + (d3.select(".xn").attr('data-x_position')*1) + ',' + (d3.select(".mct").property("scrollTop")*(1/d3.select(".chart").attr("scale"))) + ')');
    
    d3.select(".zcc").on("input", function(d){
        zoomv.scaleTo(d3.select(".chart"),zScale(d3.select(".zcc").property("value")));
    });
    updateGraph();
}

/*
 * Function to truncate strings
 * Source: https://medium.com/@DylanAttal/truncate-a-string-in-javascript-41f33171d5a8
 * @param {type} str
 * @param {type} num
 * @returns {String}
 */
function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...';
}
/*
 * @param {object} d a d3 object to change its opacity
 * @param {int}    n an integer between 0-1 t indicate the new opacity value
 * @return{void}
 */
function switch_opacity(d,n){
    d.style("opacity",n);
}

function switch_opacity_dim(d){
    d3.select(this).attr("opacity",0.5);
}
function switch_opacity_on(d){
    d3.select(this).attr("opacity",1);
}

function viz_ligths_out(){//it will loop by all the elements of the zoom chart and will lower their opacity. 
    d3.selectAll(".y-node").style("opacity",0);//get all labels
    d3.selectAll(".heatmap_square").style("opacity",0.5);//get all rows and columns of squares
    d3.selectAll(".metadata_icon").style("opacity",0);//get all metadata icons
    d3.selectAll(".download_icon").style("opacity",0);//get all download icons
    d3.selectAll(".heatmap_col").style("opacity",0);//get all cols of squares and sample names
}
function viz_ligths_dim(){//it will loop by all the elements of the zoom chart and will lower their opacity. 
    d3.selectAll(".y-node").style("opacity",0.5);//get all labels
    d3.selectAll(".heatmap_square").style("opacity",0.5);//get all rows of squares
    d3.selectAll(".metadata_icon").style("opacity",0.5);//get all rows of squares
    d3.selectAll(".download_icon").style("opacity",0.5);//get all rows of squares
    d3.selectAll(".heatmap_col").style("opacity",0.5);//get all cols of squares and sample names
}
function viz_ligths_on(){//it will loop by all the elements of the zoom chart and will lower their opacity. 
    d3.selectAll(".y-node").style("opacity",1);//get all labels
    d3.selectAll(".heatmap_square").style("opacity",1);//get all rows of squares
    d3.selectAll(".metadata_icon").style("opacity",1);//get all rows of squares
    d3.selectAll(".download_icon").style("opacity",1);//get all rows of squares
    d3.selectAll(".heatmap_col").style("opacity",1);//get all cols of squares and sample names
}

function onmouseover_function_labels(d){//Changing the cursor appearance 
    //switch everyone's opacity low, ligths out, with animation. 
    viz_ligths_on();
    //viz_ligths_dim();
    
    let tooltip = d3.select(".toolt");
    tooltip.attr("data-class",d3.select(this).attr("class"));

    if(d.data.property_id){

        generate_property_tooltip_html_content(tooltip, d);
    }else{

        generate_step_tooltip_html_content(tooltip, d);
    }
    
    // turn on the ligts for this row only
    //d3.select(this).attr("opacity",1);
    d3.selectAll("."+String(d.idx)).style("opacity",1);
    //d3.selectAll(String(d.idx)).style("opacity",1);
    //switch_opacity(d3.selectAll("."+d.idx),0.5);
    if(d.children){
        d3.select(this).style("cursor", "zoom-out");
    }else{
        d3.select(this).style("cursor", "zoom-in");
    }
    if(d.height === 0){
        d3.select(this)
            .style("cursor", "not-allowed");
    }
}
function onmouseout_function_labels(d){
    //switch_opacity(d3.select(this),1);
    //d3.selectAll("."+d.idx).style("opacity",1);
    viz_ligths_on();
}

function onmouseover_heatmap_squares(d,i){//Changing the cursor appearance 
    //switch everyone's opacity low, ligths out, with animation. 
    viz_ligths_on();
    viz_ligths_dim();
    //d3.selectAll("."+String(d.idx)).style("opacity",1);//rows
    //Rows on
    //console.log("checking if you can get to the this parent to access its class");
    //console.log(d3.select(this.parentNode).data()[0].idx);
    d3.selectAll("."+String(d3.select(this.parentNode).data()[0].idx)).style("opacity",1);//rows
    //Columns on
    d3.selectAll(".heatmap_col"+i).style("opacity",1);//cols
    d3.selectAll(".x-node"+i).attr("font-size", 18);
    //Make the tool tips visble and load the texts
    // Make the tool tips visible
    // Are the tool tips close to the bottom border?
    let ygap_functions = 20;
    let ygap_values    = 60;
    let ygap_samples   = 40;
    
    let xgap_functions = 20;
    let xgap_values    = 20;
    let xgap_samples   = -50;
    const tt_bottom_position           = d3.select(".mct").node().getBoundingClientRect().height - d3.select(this).node().getBoundingClientRect().top;
    const tt_bottom_position_threshold = ygap_values+parseInt(d3.select(".value_tt").style("height"));
    //need the width of the sample name tt
    //need the top position of the mouse
    // check difference and set value for the gaps. 
    if(tt_bottom_position<=tt_bottom_position_threshold){
        //console.log("it is minor than the threshold");
        ygap_functions = -20;
        ygap_values    = -60;
        ygap_samples   = -40;
        
        xgap_functions = 20;
        xgap_values    = 20;
        xgap_samples   = -50;
    }else{
        ygap_functions = 20;
        ygap_values    = 60;
        ygap_samples   = 40;
        
        xgap_functions = 20;
        xgap_values    = 20;
        xgap_samples   = -50;
    }
    d3.select(".function_name_tt")
        .style("visibility","visible")
        .style("left",(d3.select(this).node().getBoundingClientRect().left+xgap_functions)+"px")
        .style("top",(d3.select(this).node().getBoundingClientRect().top+ygap_functions)+"px")
        .text(d3.select(this.parentNode).data()[0].data.name)
    ;
    
    d3.select(".value_tt")
        .style("visibility","visible")
        .style("left",(d3.select(this).node().getBoundingClientRect().left+xgap_values)+"px")
        .style("top",(d3.select(this).node().getBoundingClientRect().top+ygap_values)+"px")
        .text(d3.select(this).data())
    ;
    
    d3.select(".sample_name_tt")
        .style("visibility","visible")
        .style("left",(d3.select(this).node().getBoundingClientRect().left+xgap_samples)+"px")
        .style("top",(d3.select(this).node().getBoundingClientRect().top+ygap_samples)+"px")
        .text(d3.select(".x-node"+i).text())
    ;
    
    
}
function onmouseout_heatmap_squares(d,i){
    //switch_opacity(d3.select(this),1);
    //d3.selectAll("."+d.idx).style("opacity",1);
    d3.selectAll(".x-node"+i).attr("font-size", 12)
    viz_ligths_on();
    //Make the tool tips invisble. 
    d3.select(".value_tt").style("visibility","hidden");
    d3.select(".sample_name_tt").style("visibility","hidden");
    d3.select(".function_name_tt").style("visibility","hidden");
}
//array function from https://www.w3resource.com/javascript-exercises/javascript-function-exercise-19.php
function BiggerElements(val){
    return function(evalue, index, array){
        return (evalue >= val);
    };
}

function InbetweenElements(x,y){
    return function(evalue, index, array){
        //console.log("evalue");
        //console.log(evalue);
        return (parseInt(evalue.nodeY) >= x && parseInt(evalue.nodeY) <=y);
    };
}
//@param {object} selected_data the JSON tree filtered data
//@return {void}  draws the interactive heatmap elements
function updateGraph (){
    
    let heatColor = d3.scaleOrdinal()
        .domain(['YES','PARTIAL','NO'])
        .range([d3.select(".rect0").style("fill"),d3.select(".rect1").style("fill"),d3.select(".rect2").style("fill")]);//takes them from the legend objects
    ;
    //NODE manipulation
    let pre_filter_nodes             = selected_data.descendants().slice(1);//the slice is used to avoid showing the first node
    const scale                      = zScale(d3.select(".zcc").property("value"));
    d3.select(".div_svg")
        .attr("width", (window.innerWidth)*scale)
        .attr("height", (parseInt(d3.select(".div_svg").attr("data-nodeSpaceY"))*pre_filter_nodes.length + parseInt(d3.select(".div_svg").attr("data-sample_name_height")) + 20)*scale)
        .attr("viewBox", [0, 0, (window.innerWidth)*scale, parseInt(d3.select(".div_svg").attr("data-nodeSpaceY")*pre_filter_nodes.length + parseInt(d3.select(".div_svg").attr("data-sample_name_height")) + 20)*scale])
    ;
    const downloadable_steps              = [];
    const svg_height_min                  = (parseInt(d3.select(".div_svg").attr("data-nodeSpaceY"))*pre_filter_nodes.length + parseInt(d3.select(".div_svg").attr("data-sample_name_height")) + 20)*minZoom;
    const set_of_screens_in_onepage       = 3;
    const mct_height                      = d3.select(".mct").node().getBoundingClientRect().height;
    const page_number                     = Math.ceil(svg_height_min/mct_height);
    //console.log("comparing the sizes of the svg");
    //console.log(Math.round(parseInt(d3.select(".div_svg").attr("height"))*(1/scale)*minZoom));
    //console.log(svg_height_min);

    const current_mct_scroll_top          = d3.select(".mct").property("scrollTop");
    let   i                               = 0;
    let visible_node_min_threshold_vector = [];
    let visible_node_max_threshold_vector = [];
    while(i < page_number){
      visible_node_min_threshold_vector.push(Math.floor(i*(1/minZoom)*mct_height*(scale)));
      if(i+1===page_number){
          //fill the last element with the maximum size possible 
          visible_node_max_threshold_vector.push(svg_height_min*(1/minZoom)*(scale));
      }else{
          visible_node_max_threshold_vector.push(Math.floor((i+1)*(1/minZoom)*mct_height*(scale)));
      }
      i++;
    }
    
    let visible_node_min_threshold = 0;
    let visible_node_max_threshold = 0;
    let scroll_top_current_page    = 0;
    
    pre_filter_nodes.sort(function(a, b){return a.or - b.or;});
    update_genome_properties_info(pre_filter_nodes.map(d => d.data.property_id));
    counter       = 0;
    pre_filter_nodes.forEach(function(d){
        d.id    = counter;
        d.nodeY = ((d3.select(".div_svg").attr("data-nodeSpaceY"))*(d.id+1)) - (d3.select(".div_svg").attr("data-nodeSpaceY")/2);
        counter++;
        return(d.id);
    });
    counter      = 0;
    let nodes       = [];
    // if to decide what nodes to print
    if(page_number<=set_of_screens_in_onepage){
        //print all
        console.log("one set of 3 screens!");
        //one division
        //set thresholds
        //minthreshold to 0 
        scroll_top_current_page    = visible_node_max_threshold_vector.findIndex(BiggerElements(current_mct_scroll_top));
        visible_node_min_threshold = visible_node_min_threshold_vector[0];
        //max threshold to maximum svg size with scale
        visible_node_max_threshold = visible_node_max_threshold_vector[page_number-1];
        //nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold,visible_node_max_threshold));
        nodes                      = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold*(1/scale),visible_node_max_threshold*(1/scale)));
        
        
    }else{
        //define pages and their thresholds 
        //gets the page where my scroll top is at 
        scroll_top_current_page = visible_node_max_threshold_vector.findIndex(BiggerElements(current_mct_scroll_top));
        // define the set of three pages to show 
        // define the threshold of the pages to show
        switch(scroll_top_current_page){
            case 0:
                //first page so, show the 0, 1 and 2 pages
                //console.log("I am scrolling in the first page!");
                //let nodes       = selected_data.descendants().slice(1);//the slice is used to avoid showing the first node
                visible_node_min_threshold = visible_node_min_threshold_vector[(scroll_top_current_page)];
                visible_node_max_threshold = visible_node_max_threshold_vector[(scroll_top_current_page+2)];
                //nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold,visible_node_max_threshold));
                nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold*(1/scale),visible_node_max_threshold*(1/scale)));
                break;
            case page_number:
                //la ultima so, show last, last -1 and last -2
                /*console.log("I am scrolling in the last page!");
                visible_node_min_threshold = visible_node_min_threshold_vector[(scroll_top_current_page-2)];
                visible_node_max_threshold = visible_node_max_threshold_vector[(scroll_top_current_page)];
                console.log("visible_node_min_threshold");
                console.log(visible_node_min_threshold);
                console.log("visible_node_max_threshold");
                console.log(visible_node_max_threshold);
                console.log("visible_node_min_threshold without scale");
                console.log(visible_node_min_threshold*(1/scale));
                console.log("visible_node_max_threshold without scale");
                console.log(visible_node_max_threshold*(1/scale));*/
                //nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold,visible_node_max_threshold));
                nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold*(1/scale),visible_node_max_threshold*(1/scale)));
                //let nodes       = selected_data.descendants().slice(1);//the slice is used to avoid showing the first node
                break;
            default:
                // the other cases, so center in the scroll top current page +1 and -1
                //console.log("I am scrolling a page that is not the first nor the last");
                visible_node_min_threshold = visible_node_min_threshold_vector[(scroll_top_current_page-1)];
                visible_node_max_threshold = visible_node_max_threshold_vector[(scroll_top_current_page+1)];
                //nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold,visible_node_max_threshold));
                nodes = pre_filter_nodes.filter(InbetweenElements(visible_node_min_threshold*(1/scale),visible_node_max_threshold*(1/scale)));
                //let nodes       = selected_data.descendants().slice(1);//the slice is used to avoid showing the first node
                break;
        }
    }
    //save the page in a global object, mct. 
    d3.select(".mct").attr("data-scroll_top_current_page",scroll_top_current_page);
    //console.log("the global mct scroll top");
    //console.log(d3.select(".mct").attr("data-scroll_top_current_page"));
    //End NODE manipulation
    //##################################################################
    //##                     DRAWING THE NETWORK                      ##
    //##################################################################
    
    let GyNodes = d3.select(".yn");
    // For about this background square see bellow. 
    
    GyNodes
        .append("rect")
        .attr("class","yn_background")
        .style("display","block")
        .style("fill","white")
        .style("opacity",0.7)
    ;
    let yNode = d3.select(".yn").selectAll('g.y-node')
            .data(nodes,function(d) {
                return d.idx;
            });
        yNode.join(
            function(enter){
                let yNodeEnter = enter
                        .append("g")
                        //.transition()
                        .attr('class',function(d) {
                            return 'y-node '+ d.idx;}
                        );
                    yNodeEnter.append("text")
                        .attr('class',function(d) {
                            return 'y-node '+ d.idx;}
                        )
                        .attr('transform', function(d) { 
                            return 'translate(' + d.yLinkScaledLenght + ',' + (d.nodeY+3) + ')'; 
                        })
                        .style('fill', "white")
                        .attr("font-family", " Arial, sans-serif")
                        .attr("font-size", function(d){
                                console.log("d");
                                console.log(d);
                                return (15-(d.depth)*1.2);
                            }
                        )
                        .text(d => d.data.name)
                        .style("font-weight", function(d) {
                            let fw = "normal";
                            if(d.height ===0){
                                fw = "normal";
                            }else{
                                fw = (d.children || d._children) ? "bold": "normal";
                            }
                            return (fw);
                        })
                        .on('mouseover', onmouseover_function_labels)
                        .on('mouseout', onmouseout_function_labels)
                        .on('click', click)
                        .transition()
                            .duration(d3.select(".yn").attr("data-intro_animation_time"))
                            .style('fill', "black")
                ;
                return(yNodeEnter);
            },
            function(update){
                let yNodeUpdate = update
                ;
                    yNodeUpdate.select("text")
                        .style("font-weight", function(d) {
                            let fw = "normal";
                            if(d.height ===0){
                                fw = "normal";
                            }else{
                                fw = (d.children || d._children) ? "bold": "normal";
                            }
                            return (fw);
                        })
                        .text(d => d.data.name)
                        .on('mouseover', onmouseover_function_labels)
                        .on('mouseout', onmouseout_function_labels)
                        .attr('transform', function(d) { return 'translate(' + d.yLinkScaledLenght + ',' + (d.nodeY+3) + ')'; })
                        .transition()
                            .duration(d3.select(".yn").attr("data-intro_animation_time"))
                            .style("fill","black")
                ;
                return(yNodeUpdate);
            },
            function(exit){
                let yNodeExit = exit;
                    yNodeExit.select("text.y-node") 
                            .transition()
                            .duration(d3.select(".yn").attr("data-intro_animation_time"))
                            .style("fill","white")
                            
                    ;
                    yNodeExit.remove();
                return(yNodeExit);
            }
        );
        //set the dimensions of the opaque square for the function names
        // To avoid the function names disapear to the right when we have lots of samples, we can limit its translate of the yn
        // to limit the translate of the yn we can use the heatmap size and the yn widht. 
        // 
        // if yn data-x_position - d3.select(".yn").node().getBBox().width*1 > d3.select(".div_svg").attr("width") 
        // then set the yn data-x_position to d3.select(".div_svg").attr("width") - d3.select(".yn").node().getBBox().width*1
        
        d3.select(".yn_background")
                .attr("width",d3.select(".yn").node().getBBox().width*1)
                .attr("height",d3.select(".yn").node().getBBox().height*1)
        ;
        const yn_x_position      = d3.select(".yn").attr("data-position_x")*1;
        const yn_total_width     = d3.select(".yn").node().getBBox().width*1;
        const yn_container_width = d3.select(".div_svg").attr("width")*1
        
        if(yn_x_position - yn_total_width > yn_container_width){
            console.log("I enter to correct yn's x position");
            d3.select(".yn").attr("data-position_x",yn_x_position - yn_total_width);
            d3.select(".yn").attr("transform","translate(" + (yn_x_position - yn_total_width) + "," + (0) + ")");
        }else{
            console.log("no need to correct yn's x position");
        }
        
        
    //##################################################################
    //##                 END DRAWING THE NETWORK                      ##
    //##################################################################

    //##################################################################
    //##                     DRAWING THE BOXES                        ##
    //##################################################################
    // we can use the width of yn as reference to locate the cells 
    // set the new location of the heatmap table. 
    /*console.log("yn widht");
    console.log((d3.select(".yn").node().getBBox().width+3)*scale);
    console.log("yn x pos");
    console.log((d3.select(".yn").attr("data-x_position"))*scale);*/
    //it would be yn widht plus all teh movement yn has...
    
    //d3.select(".table").attr('transform', 'translate(' + (d3.select(".yn").node().getBBox().width + d3.select(".yn").attr("data-x_position")*1 + 30) + ',' + (0) + ')');
    //d3.select(".xn").attr('transform', 'translate(' + (d3.select(".yn").node().getBBox().width + d3.select(".yn").attr("data-x_position")*1 + 30) + ',' + (0) + ')');
    //d3.select(".xn").attr("data-x_position",d3.select(".yn").node().getBBox().width + d3.select(".yn").attr("data-x_position")*1 + 30)
    let nCols = d3.select(".table").attr("data-sample_names_length");
    let bandX = d3.scaleBand()
        .domain(d3.range(nCols))
        .range([0, d3.select(".table").attr("data-heatmapWidth")]);

    let rows = d3.select(".table").selectAll('.row')
        .data(nodes,function(d) {
            return d.idx;
        });
    rows.join(
        function(enter){
            let rowEnter = enter.append('g')
                .attr('class',function(d) {return 'row '+ d.idx;})
                .style('opacity', 0)
                .attr('transform', function(d, i) {

                    return 'translate(0, ' + (d.nodeY- (d3.select(".div_svg").attr("data-nodeSpaceY")/2)) + ')';
                });  
            let rowEnterRect = rowEnter
                .selectAll('rect')
                .data(function(d) {
                    return(d.data.result);
                });
            rowEnterRect
                .join(
                    function(enter){
                        let rowEnterRect = enter.append('rect')
                            .attr("class",function (d,i) {return "heatmap_square heatmap_col heatmap_col"+i+" "+d3.select(this.parentNode).data()[0].idx ;})//assigning to the rects their column row indexes
                            .style('fill', function (d) {return heatColor(d);})
                            .style('opacity', 1)
                            .attr('x', function(d, i) {return bandX(i);})
                            .style('stroke', '#000')
                            .style('stroke-width', 1)
                            .attr('width', bandX.bandwidth())
                            .attr('height', d3.select(".div_svg").attr("data-nodeSpaceY"))
                            .on('mouseover', onmouseover_heatmap_squares)
                            .on('mouseout', onmouseout_heatmap_squares)
                        return(rowEnterRect);
                    }
                );
            rowEnter.transition()
                .duration(d3.select(".yn").attr("data-intro_animation_time"))
                    .style('opacity', 1)
            ;
            return(rowEnter);
        },
        function(update){
            let rowUpdate = update;
                rowUpdate
                    .transition()
                        .duration(1500)
                        .attr('transform', function(d, i) {
                            return 'translate(0, ' + (d.nodeY- (d3.select(".div_svg").attr("data-nodeSpaceY")/2)) + ')';
                        })
                        .style('opacity', 1)
                        ;
                rowUpdate.selectAll('rect')
                    .style('fill', function (d) {
                            return heatColor(d);
                        })
                    .style('opacity', 1)
                    .attr('x', function(d, i) {return bandX(i);})
                    .style('stroke', '#000')
                    .style('stroke-width', 1)
                    .attr('width', bandX.bandwidth())
                    .attr('height', d3.select(".div_svg").attr("data-nodeSpaceY"));

            return(rowUpdate);
        },
        function(exit){
            let rowExit = exit.remove();
            return(rowExit);
        }
    );
    // ADD for each node an icon that will activate the extended metadata. 

    
    if (!loaded_micromeda_file){
        console.log("no micromeda file loaded, can not download properties");
    }else{
        console.log("I loaded a micromeda file, check if we have to draw the download icons");
        downloadable_steps.push(nodes.filter(is_node_downloadable));
		console.log("downloadable_steps");
		console.log(downloadable_steps);

        let d_icon = d3.select(".download_icon_holder").selectAll('.download_icon')
            .data(downloadable_steps[0],function(d) {
                return d.idx;
            });
        d_icon.join(
            function(enter){
                let iconEnter = enter.append('g')
                    .style('opacity', 1)
                    .attr('class',function(d) {return 'download_icon '+ d.idx;})
                    .attr('transform', function(d, i) {
                        //return 'translate(0, ' + ((d.nodeY)+ (d3.select(".div_svg").attr("data-nodeSpaceY")/2)) + ')';
                        return 'translate(0, ' + ((d.nodeY) - (d3.select(".div_svg").attr("data-nodeSpaceY")/2))+ ')';
                    })
                    .on("click", function (hovered_tree_node) {
                            //Activating the text
                        let tooltip = d3.select(".download_protein_tt");
                        d3.select(this)
                                //.text(function(d) { return '\uf019' ;})
                                .style("cursor","pointer")
                        ;
                        if(tooltip.style("visibility")==="hidden"){
                            tooltip.attr("data-class",d3.select(this).attr("class"));
                            generate_download_tooltip_html_content(tooltip, hovered_tree_node);
                            console.log("size of the download tool tip");
                            console.log(d3.select(this).node().getBoundingClientRect());
                            tooltip
                                .style("visibility","visible")
                                .style("left",(d3.select(this).node().getBoundingClientRect().left+10)+"px")
                                .style("top",(d3.select(this).node().getBoundingClientRect().top)+"px")

                            ;
                        }else{
                            tooltip.style("visibility","hidden");
                        }


                      })
                    .append("image")
                    .attr("xlink:href","./assets/firefox_download.png")
                    .attr("width", 15)
                    .attr("height", 21)
                    
                ;  
                iconEnter.transition()
                    .duration(d3.select(".yn").attr("data-intro_animation_time"))
                        .style('opacity', 1)
                ;
                return(iconEnter);
            },
            function(update){
                let iconUpdate = update;
                    iconUpdate
                        .transition()
                            .duration(1500)
                            .attr('transform', function(d, i) {
                                //return 'translate(0, ' + (d.nodeY + (d3.select(".div_svg").attr("data-nodeSpaceY")/2)) + ')';
                                return 'translate(0, ' + ((d.nodeY) - (d3.select(".div_svg").attr("data-nodeSpaceY")/2))+ ')';
                            })
                            .style('opacity', 1)
                            ;

                return(iconUpdate);
            },
            function(exit){
                let iconExit = exit.remove();
                return(iconExit);
            }
        );
    }
};
//@param {array} genome_proprety_ids, is an array of all the genpropids of the visible nodes
//@return {void} sets in localforage the additional metadata for the set of ids received. 
function update_genome_properties_info(genome_property_ids)
{
    for (let id_index in genome_property_ids)
    {
        let current_id = genome_property_ids[id_index];

        localforage.getItem(current_id).then(function (local_genome_properties_data) {
            /*console.log("current_id");
            console.log(current_id);
            console.log("local_genome_properties");
            console.log(local_genome_properties_data);*/
            if (local_genome_properties_data === null)
            {
                let data_url = back_end_url + 'genome_properties/' + current_id;
                //if I am remote ask for the things, if not then no...
                if(loaded_micromeda_file){
                    jQuery.getJSON(data_url, function (remote_genome_properties_data) {
                    localforage.setItem(current_id, remote_genome_properties_data).then(function () {
                        
                    }).catch(function (err) {
                        console.log(err);
                    });
                    });
                }
                
            }
        }).catch(function (err) {
            console.log(err);
        });
    }
}