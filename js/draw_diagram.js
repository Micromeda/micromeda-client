/**
 * Created by: Lee Bergstrand (2018)
 * Edited by: Santiago Ruiz-Navas (2020)
 * Description: Functions for drawing the genome properties diagram.
 */

//draw navbar.
/**
 * Draws the top navbar
 *
 * @param {object} topnavbar_parameters The configuration parameters for topnavbar.
 * 
 */

function draw_top_navbar(topnavbar_parameters){
    let topnavbar = d3.select("body")
        .append("nav")
        .attr("class","navbar navbar-expand-lg navbar-light bg-light")
        .style('position','fixed')
        .style('top',topnavbar_parameters['top'])
        .style("width",topnavbar_parameters['width'])
        .style("z-index",100)
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
    topnavbar_elements.append("ul")
        .attr("class","navbar-nav mr-auto")
        .append("li")
            .attr("class","nav-item active")
            .append("a")
                .attr("class","nav-link")
                .attr("href","./html/upload_view.html")
                //.attr("href","#")
                .text("Upload")
    ;
    // If you want to add controls to the navbar add here appened to topnavbar elements
}

/**
 * Draws the general container
 *
 * @param {object} general_parameters The configuration parameters for the general container and its elements.
 * 
 */
function draw_content_container(general_parameters){
    let general_content_container_parameters = general_parameters["general_content"];
    let content_container_parameters         = general_content_container_parameters['general_container'];
    let sidebar_parameters                   = general_content_container_parameters['sidebar'];
    let general_content_container            = d3.select("body")
        .append("div")
            .attr("class","gcc")
            .style("display","flex")
            .style("align-items","stretch")
            .style("position","fixed")
            .style("width",content_container_parameters['width'])
            .style("top",content_container_parameters['top'])
            .style("bottom",content_container_parameters['bottom'])
            .style("margin-bottom",content_container_parameters['margin-bottom']+"px")
            .style("margin-top",content_container_parameters['margin-top']+"px")
        ;
    
    //Drawing the left sidebar
    let sidebar = general_content_container
        .append("div")
        .attr("class","sdb collapse show")
        .attr("id","sidebar")
        .style("width",sidebar_parameters['width'])
        .style("min-width",sidebar_parameters['min-width'])
        .style("height",sidebar_parameters['height'])
        .style("padding",sidebar_parameters['padding'])
        .style("padding-bottom",sidebar_parameters['padding-bottom'])
        .style("border-right-width",sidebar_parameters['border-right-width'])
        .style("border-right-style",sidebar_parameters['border-right-style'])
        .style("border-right-color",sidebar_parameters['border-right-color'])
        .style("overflow-y","scroll")
        .style("overflow-x","hidden")
    ;
    //Adding the selection filter to the sidebar
    let sidebar_form = sidebar.append("form")
    ;

    let sidebar_form_group = sidebar_form.append("div")
        .attr("class","form-group")
    ;
    sidebar_form_group.append("label")
        .attr("for","fs1")//filter menu select filter select
        .text("Filter Content")
    ;
    let sidebar_form_group_select = sidebar_form_group.append("select")
        .attr("id","fs1")
        .attr("class","fms form-control")//filter menu select
        .attr("name","filter")
        .attr("data-filter","all")
    ;
    sidebar_form_group_select.append("option")
        .attr("class","fmdo")//option
        .attr("value","all")
		.attr("selected","true")
        .text("All")
    ;
    sidebar_form_group_select.append("option")
        .attr("class","fmdo")//options
        .attr("value","path")
        .text("Pathways")
    ;
    sidebar_form_group_select.append("option")
        .attr("class","fmdo")//options
        .attr("value","mpath")
        .text("Meta-Pathways")
    ;
    //Checkboxes
    let fitler_checkboxes_parameters = sidebar_parameters['checkboxes'];
    let filter_checkboxes = sidebar_form_group.append("div")
        .attr("class","form-group text-center")
        .style("margin-top","1rem")
    ;
    let checkbox_Yes = filter_checkboxes.append("div")
        .attr("class","form-check form-check-inline")
    ;
    checkbox_Yes.append("input")
        .attr("type","checkbox")
        .attr("class","fry form-check-input")
        .attr("value","Y")
        .attr("id","fr_y")
        .property("checked",fitler_checkboxes_parameters['check'][0])
    ;
    checkbox_Yes.append("label")
        .attr("class","form-check-label")
        .attr("for","fr_y")
        .text("YES")
    ;
    let checkbox_Partial = filter_checkboxes.append("div")
        .attr("class","form-check form-check-inline")
    ;
    checkbox_Partial.append("input")
        .attr("type","checkbox")
        .attr("class","frp form-check-input")
        .attr("value","P")
        .attr("id","fr_p")
        .property("checked",fitler_checkboxes_parameters['check'][1])
    ;
    checkbox_Partial.append("label")
        .attr("class","form-check-label")
        .attr("for","fr_p")
        .text("PARTIAL")
    ;
    let checkbox_No = filter_checkboxes.append("div")
            .attr("class","form-check form-check-inline")
    ;
    checkbox_No.append("input")
        .attr("type","checkbox")
        .attr("class","frn form-check-input")
        .attr("value","N")
        .attr("id","fr_n")
        .property("checked",fitler_checkboxes_parameters['check'][2])
    ;
    checkbox_No.append("label")
        .attr("class","form-check-label")
        .attr("for","fr_n")
        .text("NO")
    ;
    let checkbox_Unique = filter_checkboxes.append("div")
            .attr("class","form-check form-check-inline")
    ;
    checkbox_Unique.append("input")
        .attr("type","checkbox")
        .attr("class","frs form-check-input")
        .attr("value","S")
        .attr("id","fr_s")
        .property("checked",fitler_checkboxes_parameters['check'][3])
    ;
    checkbox_Unique.append("label")
        .attr("class","form-check-label")
        .attr("for","fr_s")
        .text("Unique")
        .on("mouseover",function(){
            d3.select(".unique")
                .style("visibility","visible")
                .style("top",(this.getBoundingClientRect().top + this.getBoundingClientRect().height+ 3)+"px")
                .style("left",(this.getBoundingClientRect().left + this.getBoundingClientRect().width/2)+"px")
            ;
            }
        )
        .on("mouseout",function(){
            d3.select(".unique")
                .style("visibility","hidden");
        })
    ;
    sidebar_form_group.append("hr");
    //LEGENDS
    let legends_parameters = sidebar_parameters['legends'];
    let heatColor = d3.scaleOrdinal()
        .domain(legends_parameters['color_scale_domain'])
        .range(legends_parameters['color_scale_range']);
    ;
    let legend_menu = sidebar_form_group.append("div")
        .attr("class","form-group")
    ;
    legend_menu.append("label")
                .attr("for","sdbf_c")//filter menu select filter select
                .text("Click the legends to change color")
            ;
    //let legends = legend_menu.append('svg')
    let legends = legend_menu.append('div')
        .attr("id","sdbf_c")
        .attr("width",legends_parameters['legend_menu_width'])
        .attr("height",legends_parameters['legend_menu_height'])
        .style("vertical-align", legends_parameters['legend_menu_vertical-align'])
    ;
    let GLegends = legends.selectAll(".leg")
            .data(legends_parameters['color_scale_domain'])
    ;
	//HERE I can update the color customization
    GLegends.join(
        function(enter){
        let GLegends_div_Enter = enter
                .append("div")
                .attr("class","form-group row")
        ;
        GLegends_div_Enter.append("label")
            .attr("for",function(d,i){
              return "rect"+i;  
            })//filter menu select filter select
            .attr("class","col-form-label col-sm-4")
            .style("font-size","12px")
            .text(d =>d)
        ;
        GLegends_div_Enter
                .append("input")
                .attr("id",function(d,i){
                  return "rect"+i;  
                })
                .attr("class",function(d,i){
                  return "leg rect"+i;  
                })
                .attr("type","color")
                .attr("data-color",function(d,i) {
                        return (legends_parameters["color_scale_range"][i]);
                    })
                .attr("value",function(d,i) {
                    return (legends_parameters["color_scale_range"][i]);
                    })
                .attr("height",legends_parameters['legend_square_height'])
                .attr("width",legends_parameters['legend_square_height'])
                //.attr("fill",d => heatColor(d))
                .style("fill",d => heatColor(d))
                .on("change",function(){
                    //change color of the respective legend 
                     d3.select(this)
                          .style("fill",this.value);
                     ;
                     d3.select(this)
                         .attr("data-color",this.value)
                     ;
                     updateGraph();
                 })
            ;
            return(GLegends_div_Enter);
        })
    ;
    sidebar_form_group.append("hr");
    //Drawing the Buttons
    let sidebar_buttons_form_group = sidebar_form_group.append("div")//side bar buttion
        .attr("class","form-group text-center")
    ;
    sidebar_buttons_form_group.append("button")
        .attr("type","button")
        .attr("class","btn btn-outline-secondary btn-sm rb")
        .text("Reset")
    ;
    sidebar_buttons_form_group.append("button")
        .attr("class", "btn btn-outline-secondary btn-sm eab")
        .attr("type", "button")
        .text("Expand all")
        .on("mouseover",function(){
            d3.select(".expand")
                .style("visibility","visible")
                .style("top",(this.getBoundingClientRect().top + this.getBoundingClientRect().height+ 3)+"px")
                .style("left",(this.getBoundingClientRect().left + this.getBoundingClientRect().width/2)+"px")
            ;
            }
        )
        .on("mouseout",function(){
            d3.select(".expand")
                .style("visibility","hidden");
        })
    ;
    sidebar_form_group.append("hr");
    //Drawing Zoom controls
    let sidebar_zoom_control = sidebar_form_group.append("div")//side bar buttion
        .attr("class","form-group")
    ;
    sidebar_zoom_control.append("label")
        .attr("for","zc")//filter menu select filter select
        .text("Zoom control")
    ;
    sidebar_zoom_control.append("input")
        .attr("class","form-control zcc")
        .attr("id","zc")
        .attr("type","range")
        .attr("min",0)
        .attr("max",100)
        .attr("value",80)
		//modify the padding to cero
		.style("padding",0)
    ;
    sidebar_form_group.append("hr");
    //Drawing the select2 Search selector
    let sidebar_select2_search = sidebar_form_group
        .append("select")//navigationbar division select
            .attr("class","ndfs select2-accessible")//nav-div-form-select
            .attr("name","properties")
            .attr("title","Property Search")
            .attr("tabindex",-1)
            .style("width","100%")
            .attr("aria-hidden","true")
    ;
    sidebar_select2_search.append("option")/* to be able to set the placeholder*/;
    
    let option_names = sidebar_select2_search.append("optgroup")
        .attr("label","Property Names")
        .attr("class","ndfso_names")
    ;
}
/**
 * Calculates the heatmap width
  * @param {object} heatmap_parameters The configuration parameters for footer. *
 * @param {array} sample_names the sample names of the micromeda file
 * @return {int} heatmap_width
 */
function calculate_heatmap_width(heatmap_parameters, sample_names){
    // 1 character at font size 12 is 8 pixels, I want 30 characters 240pixels
    //console.log("calculate_heatmap:",sample_names);
    //const window_width         = window.innerWidth - margin_parameters["left"] - margin_parameters["right"];
    //const window_height        = window.innerHeight - margin_parameters["top"] - margin_parameters["bottom"]; //- window.innerHeight * 0.4;
    //let   wrapperWidth         = Math.min(window_width, window_height) ;   // like a rectangle with its longer side being half longer than its smaller side
    //let   wrapperWidth         = sample_names.length*sample_square_size;//depends now on the total number of samples.
    //let   heatmap_width        = wrapperWidth - (heatmap_parameters["Y_link_lenght"] + heatmap_parameters["link_margin"]);
    let   heatmap_width        = sample_names.length*heatmap_parameters.heatmap_sample_square_size;//depends now on the total number of samples.
    return(heatmap_width);
}

function BiggerElements(val){
    return function(evalue, index, array){
        return (evalue >= val);
    };
}

/**
 * Draws the heatmap_canvas
 *
 * @param {object} general_parameters 
 * @param {array} sample_names array of string with the sample names
 * 
 */
function draw_heatmap(general_parameters,sample_names){
    let general_content_parameters   = general_parameters["general_content"];
    let heatmap_parameters           = general_content_parameters["heatmap"];
    let margin_parameters            = general_parameters["margins"];
    let heatmap_width                = calculate_heatmap_width(heatmap_parameters,sample_names);
    let mct_footer = d3.select(".gcc")
        .append("div")
            .attr("class","mct_foot")
            .style("display", 'flex')
            .style("flex-direction", 'column')
            .style("flex-wrap", 'nowrap')
            .style("justify-content", 'flex-start')
            .style("align-items", 'strech')
            .style("width","100%")
    ;
    
    let mct = mct_footer
        .append("div")
        .attr("class","mct")
        .style("order","0")
        .style("flex-grow","1")
        .style("flex-shrink","1")
        .style("flex-basis","auto")
        .style("align-self","flex-start")
        .style("position","relative")
        .style("z-index","1003")
        .style("width","100%")
        .style("box-shadow","0 0 5px 3px rgba(0,0,0,0.25) inset")
        .style("overflow-y","scroll")
        //.attr('transform', 'translate(' + (heatmap_parameters.heatmap_controls_margin+ heatmap_parameters.heatmap_icon_container_width + heatmap_parameters.heatmap_controls_margin+  heatmap_parameters.heatmap_function_label_width + heatmap_parameters.heatmap_controls_margin+ heatmap_parameters.heatmap_icon_container_width+heatmap_parameters.heatmap_controls_margin+heatmap_parameters.heatmap_icon_container_width+ heatmap_parameters.heatmap_controls_margin ) + ',' + (0) + ')')
        .on("scroll",function(){
            //d3.select(".xn").attr('transform', 'translate(' + (parseInt(d3.select(".heatmap").attr("data-Y_link_lenght")) + parseInt(d3.select(".heatmap").attr("data-link_margin"))) + ',' + (d3.select(".mct").property("scrollTop")*(1/d3.select(".chart").attr("scale"))) + ')');
            d3.select(".xn").attr('transform', 'translate(' + (parseInt(d3.select(".xn").attr("data-x_position"))) + ',' + (d3.select(".mct").property("scrollTop")*(1/d3.select(".chart").attr("scale"))) + ')');
            d3.select(".yn").attr('transform', 'translate(' + (parseInt(d3.select(".yn").attr("data-x_position"))) + ',' + (0) + ')');
            // follow up scrolltop
            //console.log("scroll_top");
            //console.log(d3.select(".mct").property("scrollTop"));
            //Getting the reference of the last drawn page
            //Getting where I am 
            const scale                             = zScale(d3.select(".zcc").property("value"));
            const svg_height_min                    = Math.round(parseInt(d3.select(".div_svg").attr("height"))*(1/scale)*minZoom);
            const mct_height                        = d3.select(".mct").node().getBoundingClientRect().height;
            const page_number                       = Math.ceil(svg_height_min/mct_height);
            const current_mct_scroll_top            = d3.select(".mct").property("scrollTop");
            let   scroll_top_current_page           = 0;
            let   i                                 = 0;
            let   visible_node_max_threshold_vector = [];
            while(i < page_number){
                if(i+1===page_number){
                    //fill the last element with the maximum size possible 
                    visible_node_max_threshold_vector.push(svg_height_min*(1/minZoom)*(scale));
                }else{
                    visible_node_max_threshold_vector.push(Math.floor((i+1)*(1/minZoom)*mct_height*(scale)));
                }
                i++;
              }
            scroll_top_current_page = visible_node_max_threshold_vector.findIndex(BiggerElements(current_mct_scroll_top));
            //console.log("scroll_top_current_page");
            //console.log(scroll_top_current_page);
            //console.log(parseInt(d3.select(".mct").attr("data-scroll_top_current_page")));
            if(scroll_top_current_page === parseInt(d3.select(".mct").attr("data-scroll_top_current_page"))){
                //same page do nothing
            }else{
                //send redraw order.
                updateGraph();
            }
            //save a reference of the last page you draw on a global object, maybe mct
            //here identify where you are at, using the scroll top page and the max vector 
            //trigger a redraw event if the page changes in comparison to the last drawn. 
            
        })
    ;
    //##########################################################################
    //##                   DRAWING THE LEGEND CONTAINER                       ##
    //##########################################################################
            
    //Think an adaptative size of SVG canvas to draw the heatmap. 
    //##########################################################################
    //##                   DRAWING THE VISBILITY BUTTON                       ##
    //##########################################################################
    let sidebar_collapse_button = mct.append("button")
        .attr("id","sidebar-button")
        .attr("class","sidebar_collapse_btn btn btn-xs btn-light btn-outline-secondary")
        .attr("type","button")
        .attr("data-toggle","collapse")
        .attr("data-target","#sidebar")
        .attr("data-collapsed","0")
        .attr("aria-expanded","false")
        .attr("aria-controls","sidebar")
        .style("position","fixed")
        .style("width","12px")
        .style("height","50px")
        .style("left","300px")// 
        .style("top","50%")
        .style("padding-top","2px")
        .style("padding-right","0px")
        .style("padding-bottom","2px")
        .style("padding-left","0px")
        .style("border-top-left-radius",0)
        .style("border-bottom-left-radius",0)
        .style("z-index",10)
        .on("click",function(){
            let footer_collapse_button = d3.select(".footer_collapse_btn");
            if(sidebar_collapse_button.attr("data-collapsed")==="0"){
                //Collapsing sidebar
                d3.select(".sidebar_collapse_btn_icon")
                    .attr("class","sidebar_collapse_btn_icon fa fa-chevron-right")
                ;
                sidebar_collapse_button
                        .style("left","0px")// 
                        .attr("data-collapsed","1")
                ;
                footer_collapse_button
                        .style("left","0px")// 
                ;
                //if the color pop ups are visible, make them invisible.
                d3.select(".c0")
                    .style("visibility","hidden")
                ;
                d3.select(".c1")
                    .style("visibility","hidden")
                ;
                d3.select(".c2")
                    .style("visibility","hidden")
                ;
            }else{
                //Expanding sidebar
                d3.select(".sidebar_collapse_btn_icon")
                    .attr("class","sidebar_collapse_btn_icon fa fa-chevron-left")
                ;
                sidebar_collapse_button
                        .style("left","300px")// 
                        .attr("data-collapsed","0")
                ;
                footer_collapse_button
                        .style("left","288px")// 
                ;
            }
            
        })
    ;
    sidebar_collapse_button.append("span")
        .attr("class","sidebar_collapse_btn_icon fa fa-chevron-left")
    ;
    //**************************************************************************
    //**                    Button to collapse the footer                     **
    //**************************************************************************
    let footer_collapse_button = mct.append("button")
        .attr("id","footer-button")
        .attr("class","footer_collapse_btn btn btn-xs btn-light btn-outline-secondary")
        .attr("type","button")
        .attr("data-toggle","collapse")
        .attr("data-target","#foot")
        .attr("data-collapsed","0")
        .attr("aria-expanded","false")
        .attr("aria-controls","foot")
        .style("position","fixed")
        .style("width","12px")
        .style("height","25px")
        .style("left","288px")// sidebar minus button's width
        .style("bottom","50px")
        .style("padding-top","2px")
        .style("padding-right","0px")
        .style("padding-bottom","2px")
        .style("padding-left","0px")
        .style("border-rigth-left-radius",0)
        .style("border-left-left-radius",0)
        .style("z-index",101)
        .style("font-size","12px")
        .on("click",function(){
            
            //logic for the collapsing buttons positions. 
            if(footer_collapse_button.attr("data-collapsed")==="0"){
                //Collapsing
                d3.select(".footer_collapse_btn_icon")
                    .attr("class","footer_collapse_btn_icon fa fa-chevron-up")
                ;
                footer_collapse_button
                        .style("bottom","0px")// aqui sidebar width -1 px;
                        .attr("data-collapsed","1")
                ;
                

            }else{
                d3.select(".footer_collapse_btn_icon")
                    .attr("class","footer_collapse_btn_icon fa fa-chevron-down  ")
                ;
                footer_collapse_button
                        .style("bottom","50px")// 
                        .attr("data-collapsed","0")
                ;
            }
            
        })
    ;
    footer_collapse_button.append("span")
        .attr("class","footer_collapse_btn_icon fa fa-chevron-down")
        .style("marging", "auto")
    ;
    
    //##########################################################################
    //##                   DRAWING THE TOP HEATMAP                            ##
    //##########################################################################
    let dv = mct
        .append("div")
        //.append("g")
        .attr("class","svg")
        .style("z-index",0)

    ;
    //##########################################################################
    //##                     HEATMAP CONTENT I ZOOM THIS                      ##
    //##########################################################################
            // this object is the window to see the target of the zoom.
            // remember to scale this up
			
	
    const scale                             = zScale(d3.select(".zcc").property("value"));
            
    let svg = dv
        .append("svg")
        .attr('transform', 'translate('+ (0) + ',' + (0) + ')')
        .attr("class","div_svg")
        .attr("data-nodeSpaceY",heatmap_parameters.nodeSpaceY)
        .attr("data-sample_name_height",heatmap_parameters.sample_name_height)
    ;
    let gZoom = svg.append("g")
        .attr("class","chart")
        .attr("transform","scale("+scale+")")
        .attr("scale",scale)
        .style("position","relative")
        .style("z-index","1001")
    ;

    // CREATING THE HEATMAP DRAWING SPACE 
    const table_x_position         = heatmap_parameters.heatmap_controls_left_margin + heatmap_parameters.heatmap_icon_container_width + heatmap_parameters.heatmap_controls_left_margin;
    const download_icon_x_position = table_x_position+ heatmap_width + heatmap_parameters.heatmap_controls_left_margin;
    const GxNodes_x_position       = table_x_position;
    const GyNodes_x_position       = download_icon_x_position + heatmap_parameters.heatmap_icon_container_width + heatmap_parameters.heatmap_controls_left_margin;
    let heatmap = gZoom.append('g').attr('class', 'heatmap')
        .attr('transform', 'translate('+ (0) + ',' + (heatmap_parameters.sample_name_height+20) + ')')
        .attr("data-Y_link_lenght",heatmap_parameters.heatmap_sample_square_size)
        .attr("data-link_margin",heatmap_parameters.heatmap_controls_margin)
        .style("position","relative")
        .style("z-index",1000)
    ;
    // table contains the heatmap squares
    let table = heatmap.append('g')
        .attr('class', 'table')
        //.attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"] + heatmap_parameters["link_margin"]) + ',' + (0) + ')')
        .attr("data-x_position",table_x_position)
        .attr('transform', 'translate(' + (table_x_position) + ',' + (0) + ')')
        .attr("data-heatmapWidth",heatmap_width)
        .attr("data-sample_names_length",sample_names.length)
    ;
    
        // GxNodes contains the sample names
    let GxNodes = gZoom.append('g')//you can intercept here for a rectangle to generate the blur
        .attr('class', 'xn')
        .attr("data-x_position",GxNodes_x_position)
        .attr('transform', 'translate(' + (GxNodes_x_position) + ',' + (0) + ')')
        .style("display","block")
        .style("position","relative")
        .style("z-index","1001")
    ;
    
    // GyNodes contains the function labels
    let GyNodes = heatmap.append('g')
        .attr('class', 'yn')
        //.attr('transform','translate(' + (heatmap_parameters["Y_link_lenght"]+ heatmap_width + heatmap_parameters["link_margin"] + 10) + ',' + (1e-6) + ')')
        .attr("data-x_position",GyNodes_x_position)
        .attr('transform','translate(' + (GyNodes_x_position) + ',' + (1e-6) + ')')
        //.attr('transform','translate(' + (heatmap_parameters.heatmap_controls_margin) + ',' + (1e-6) + ')')
        .attr("data-intro_animation_time",heatmap_parameters.intro_animation_time)
    ;

    
    
    //first icon, the metadata icon
    /*let metadata_icon_holder = heatmap.append('g')
        .attr('class', 'metadata_icon_holder')
        //.attr("width",heatmap_parameters.heatmap_icon_container_width)
        //.attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"]/3) + ',' + (0) + ')')
        .attr('transform', 'translate(' + (heatmap_parameters.heatmap_controls_left_margin ) + ',' + (0) + ')')
    ;*/
    //second icon the dowload protein icon
    let download_icon_holder = heatmap.append('g')
        .attr('class', 'download_icon_holder')
        .attr("data-x_position",download_icon_x_position)
        //.attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"]/3)*2 + ',' + (0) + ')')
        .attr('transform', 'translate(' + (download_icon_x_position) + ',' + (0) + ')')
    ;
    //third  icon the expand compress function
}

/**
 * Draws the tooltips
 *
 * @param {object} general_content_parameters The general parameters
 * 
 */
function draw_tool_tips(general_content_parameters){
    let sidebar_parameters = general_content_parameters["sidebar"];
    let legend_parameters  = sidebar_parameters["legends"];
    //##########################################################################
    //##                       DRAWING THE TOOLTIPS                           ##
    //##########################################################################    
    //------------------------------------------------------------------
    //------------------Expand button tool tip--------------------------
    //------------------------------------------------------------------
    
    let tt1 = d3.select("body")
        .append("span")
        .attr("class","tt1 expand")
        .style("visibility","hidden")
        .style("width","120px")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("padding","5px")
        .style("border-radius","6px")
        .style("position","fixed")
        .style("z-index","101")
        .text("Warning might slow the site's response")
    ;
    let download_protein_tt = d3.select("body")
        .append("span")
        .attr("class","download_protein_tt")
        .style("left","0px")
        .style("top","0px")
        .style("display","block")
        .style("opacity",0.7)
        .style("visibility","hidden")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("padding","5px")
        .style("border-radius","6px")
        .style("position","fixed")
        .style("z-index","101")
        .text("the download tooltip")
    ;

    let function_name_tt = d3.select("body")
        .append("span")
        .attr("class","function_name_tt")
        .style("left","0px")
        .style("top","0px")
        .style("height","30px")
        .style("opacity",0.7)
        .style("visibility","hidden")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("vertical-align","middle")
        .style("padding","2px")
        .style("border-radius","6px")
        .style("position","fixed")
        //.style("z-index","101")
        .text("here I will insert the function name")
    ;
    let sample_name_tt = d3.select("body")
        .append("span")
        .attr("class","sample_name_tt")
        .style("left","0px")
        .style("top","0px")
        .style("height","30px")
        .style("opacity",0.7)
        .style("visibility","hidden")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("vertical-align","middle")
        .style("padding","2px")
        .style("border-radius","6px")
        .style("position","fixed")
        //.style("z-index","101")
        .style("transform","rotate(270deg)")
        .style("transform-origin","left 100%")
        .text("shu")
    ;
    let value_tt = d3.select("body")
        .append("span")
        .attr("class","value_tt")
        .style("left","0px")
        .style("top","0px")
        .style("height","30px")
        .style("opacity",0.7)
        .style("visibility","hidden")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("vertical-align","middle")
        .style("padding","2px")
        .style("border-radius","6px")
        .style("position","fixed")
        //.style("z-index","101")
        .text("here I will insert the value")
    ;
    //------------------------------------------------------------------
    //------------------Unique filter tool tip--------------------------
    //------------------------------------------------------------------
    let tt1_f = d3.select("body")
        .append("span")
        .attr("class","tt1 unique")
        .style("visibility","hidden")
        .style("width","200px")
        .style("background-color","black")
        .style("color","#fff")
        .style("text-align","center")
        .style("padding","5px")
        .style("border-radius","6px")
        .style("position","fixed")
        .style("z-index","101")
        .text("The unique filter will show you the functions where at least one sample has a different value compared to the others")
    ;
    //------------------------------------------------------------------
    //---------------------Color tool tips------------------------------
    //------------------------------------------------------------------
    let tt1_cy = d3.select("body")
        .append("div")
        .attr("class","tt1 c0")
        .style("visibility","hidden")
        .style("background-color","white")
        .style("text-align","center")
        .style("position","fixed")
        .style("z-index","101")
    ;
    tt1_cy.append("span")
        .style("font-size","12px")
        .style("cursor","pointer")
        .style("vertical-align","middle")
        .on("click",function(){
            d3.select(".c0")
                .style("visibility","hidden")
            ;
        })
        .text("X ")
    ;
    tt1_cy.append("input")
        .attr("type","color")
        .attr("id","y_color")
        .attr("class","tool_tip_color_yes")
        .attr("data-color",legend_parameters["color_scale_range"][0])
        .attr("value",legend_parameters["color_scale_range"][0])
        .on("change",function(){
           //change color of the respective legend 
            d3.select(".rect0")
                 .style("fill",this.value);
            ;
            d3.select(".tool_tip_color_yes")
                .attr("data-color",this.value)
            ;
            updateGraph();
        })
    ;
    tt1_cy.append("label")
        .attr("for","y_color")
        .style("font-size","12px")
        .text(" Choose your color")
    ;        
    let tt1_cp = d3.select("body")
        .append("div")
        .attr("class","tt1 c1")
        .style("visibility","hidden")
        .style("background-color","white")
        .style("text-align","center")
        .style("position","fixed")
        .style("z-index","101")
    ;
    tt1_cp.append("span")
        .style("font-size","12px")
        .style("cursor","pointer")
        .style("vertical-align","middle")
        .on("click",function(){
            d3.select(".c1")
                .style("visibility","hidden")
            ;
        })
        .text("X ")
    ;
    tt1_cp.append("input")
        .attr("type","color")
        .attr("id","p_color")
        .attr("class","tool_tip_color_partial")
        .attr("data-color",legend_parameters["color_scale_range"][1])
        .attr("value",legend_parameters["color_scale_range"][1])
        .on("change",function(){
           //change color of the respective legend 
            d3.select(".rect1")
                 .style("fill",this.value);
            ;
            d3.select(".tool_tip_color_partial")
                .attr("data-color",this.value)
            ;
            updateGraph();
        })
        ;
    tt1_cp.append("label")
        .attr("for","p_color")
        .style("font-size","12px")
        .text(" Choose your color")
    ;
    let tt1_cn = d3.select("body")
        .append("div")
        .attr("class","tt1 c2")
        .style("visibility","hidden")
        .style("background-color","white")
        .style("text-align","center")
        .style("position","fixed")
        .style("z-index","101")
    ;
    tt1_cn.append("span")
        .style("font-size","12px")
        .style("cursor","pointer")
        .style("vertical-align","middle")
        .on("click",function(){
            d3.select(".c2")
                .style("visibility","hidden")
            ;
        })
        .text("X ")
    ;
    tt1_cn.append("input")
        .attr("type","color")
        .attr("id","no_color")
        .attr("class","tool_tip_color_no")
        .attr("data-color",legend_parameters["color_scale_range"][2])
        .attr("value",legend_parameters["color_scale_range"][2])
        .on("change",function(){
           //change color of the respective legend 
            d3.select(".rect2")
                 .style("fill",this.value);
            ;
            d3.select(".tool_tip_color_no")
                .attr("data-color",this.value)
            ;
            updateGraph();
        })
    ;
    tt1_cn.append("label")
        .attr("for","no_color")
        .style("font-size","12px")
        .text(" Choose your color")
    ;
}
/**
 * Draws the footer
 *
 * @param {object} footer_parameters The configuration parameters for footer.
 * 
 */
function draw_footer(footer_parameters){
    let foot = d3.select(".mct_foot")
        .append("div")
        .attr("id","foot")
        .attr("class","foote bg-light collapse show")
        .style("order","1")
        .style("flex-grow","1")
        .style("flex-shrink","0")
        .style("flex-basis","auto")
        .style("align-self","flex-start")
        .style("width",footer_parameters['width'])
        .style("text-align","center")
        .style("z-index",100)
        .style("overflow","scroll")
    ;
    let tooltip = foot.append("div")
        .attr("class", "toolt")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .style("opacity", 1)
        .style("z-index",100)
        .style("text-align","center")
    ;
    
}

/**
 * Sets up the events to the buttons, checkbox and select object. 
 *
 * @param {void} 
 * 
 */
function setup_object_actions(){
    d3.select(".ub")
        .on("click",function(){
                //VALIDATE THE FIELDS
                //Guarantee that at least a YES, PARTIAL, NO option is selected.
                let fcheck = [d3.select(".fry").property("checked"),d3.select(".frp").property("checked"),d3.select(".frn").property("checked"),d3.select(".frs").property("checked")];
                if(fcheck.some(d => d===true)){
                    initHeatmapData();
                }else{
                    alert("Please choose at least one value from YES, NO, PARTIAL or Unique");
                }
                
            }
        )
    ;
    //RESET BUTTON
    d3.select(".rb")
        .on("click",function(){
                selected_data.descendants().slice(1).forEach(collapse);//the collapse gunction was defined in the genome_properties_tree_fused.js file
                updateGraph();
            }
        )
    ;
    //EXPAND ALL BUTTON
    d3.select(".eab")
        .on("click",function(){
                selected_data.descendants().slice(1).forEach(expand);//the expand gunction was defined in the genome_properties_tree_fused.js file
                updateGraph();
            }
        )
    ;
    //FILTER DROP BOX
    d3.select(".fms").on("change",function(){
        d3.select(".fms").attr("data-filter",this.value);
        if(d3.select(".fms").attr("data-filter")==="all"){
            d3.select(".fry").attr("disabled","true");
            d3.select(".frp").attr("disabled","true");
            d3.select(".frn").attr("disabled","true");
            d3.select(".frs").attr("disabled","true");
        }else{
            d3.select(".fry").attr("disabled",null);
            d3.select(".frp").attr("disabled",null);
            d3.select(".frn").attr("disabled",null);
            d3.select(".frs").attr("disabled",null);
        }
        //call the data changing function
        initHeatmapData();
    });
    //CHECKBOXES
    d3.select(".fry").on("change",function(){
        d3.select(this).property("checked");
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
        //call the data changing function
        let fcheck = [d3.select(".fry").property("checked"),d3.select(".frp").property("checked"),d3.select(".frn").property("checked"),d3.select(".frs").property("checked")];
        if(fcheck.some(d => d===true)){
            initHeatmapData();
        }else{
            alert("Please choose at least one value from YES, NO, PARTIAL or Unique");
        }
    });
    d3.select(".frp").on("change",function(){
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
        //call the data changing function
        let fcheck = [d3.select(".fry").property("checked"),d3.select(".frp").property("checked"),d3.select(".frn").property("checked"),d3.select(".frs").property("checked")];
        if(fcheck.some(d => d===true)){
            initHeatmapData();
        }else{
            alert("Please choose at least one value from YES, NO, PARTIAL or Unique");
        }
    });
    d3.select(".frn").on("change",function(){
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
        //call the data changing function
        let fcheck = [d3.select(".fry").property("checked"),d3.select(".frp").property("checked"),d3.select(".frn").property("checked"),d3.select(".frs").property("checked")];
        if(fcheck.some(d => d===true)){
            initHeatmapData();
        }else{
            alert("Please choose at least one value from YES, NO, PARTIAL or Unique");
        }
    });
    d3.select(".frs").on("change",function(){
        if(d3.select(this).property("checked")){
            d3.select(".frn").property("checked",false);
            d3.select(".frp").property("checked",false);
            d3.select(".fry").property("checked",false);
        }
        //call the data changing function
        let fcheck = [d3.select(".fry").property("checked"),d3.select(".frp").property("checked"),d3.select(".frn").property("checked"),d3.select(".frs").property("checked")];
        if(fcheck.some(d => d===true)){
            initHeatmapData();
        }else{
            alert("Please choose at least one value from YES, NO, PARTIAL or Unique");
        }
    });
}

/**
 * draws the sample names. 
 *
 * @param {object} sample_names sample_names
 * @param {object} general_parameters application configuration parameters
 * 
 */
function draw_sample_names(sample_names,general_parameters){
    console.log("I am in drawing the sample names");
    
    let samples                      = sample_names;
    let general_content_parameters   = general_parameters.general_content;
    let heatmap_parameters           = general_content_parameters.heatmap;
    //let margin_parameters            = general_parameters["margins"];
    let heatmap_width                = calculate_heatmap_width(heatmap_parameters,sample_names);
    let nodeSpaceX                   = heatmap_parameters.heatmap_sample_square_size;
    let GxNodes = d3.select(".xn")
    ;
    //This rect is the gaussian blur to make the sample square visible when scrolling down. But, it is not working on firefox
    /*GxNodes
        .append('rect')
            .attr('transform', 'translate('+ (0) + ',' + (8) + ')')// se divide entre dos para colocarlo en la mitad
            .style("fill","white")
            .style("opacity",0.7)
        ;*/
    GxNodes
        .append("rect")
		.attr("class","xn_background")
        .style("position","relative")
        .style("z-index","1000")
        .style("display","block")
        .style("fill","white")
        .style("opacity",0.7)
    ;
    let xNode = GxNodes.selectAll('g.x-node')
        .data(samples);
    xNode.join(
        function(enter){
            let xNodeEnter = enter
                    .append("g")
                    .attr('class',(function (d,i) {return "x-node heatmap_col heatmap_col"+i ;}))
                ;
                xNodeEnter.append("text")
                    .attr('class',function (d,i) {return "x-node x-node"+i ;})//"x-node"+i+
                    .style("text-anchor", 'start')
                    .attr("font-family", "Arial, sans-serif")
                    .attr("font-size", "12px")
                    .style('fill', "white")
                    .attr("transform", function(d,i) { return "translate(" + ((nodeSpaceX*i) + (nodeSpaceX/2))+ "," + heatmap_parameters["sample_name_height"] + ")"+" rotate(315)"; })
                    .text(function(d) { return d; })
                    .transition()
                        .duration(heatmap_parameters["intro_animation_time"])
                            .style('fill', "black")
                ;
            return(xNodeEnter);
        },
        function(update){
            let xNodeUpdate = update;
                xNodeUpdate.select("text.x-node")
                    .attr("transform", function(d,i) { return "translate(" + ((nodeSpaceX*i) + (nodeSpaceX/2))+ "," + heatmap_parameters["sample_name_height"] + ")"+" rotate(270)"; });
            return(xNodeUpdate);
        },
        function(exit){
            let xNodeExit = exit.remove();
            return(xNodeExit);
        }
	);
	const xn_background_height = GxNodes.node().getBBox().height*1;
	const xn_background_y_pos  = heatmap_parameters["sample_name_height"] - xn_background_height;
	console.log("width of xn");
	console.log(GxNodes.node().getBBox().width*1);
	console.log("height of xn");
	console.log(xn_background_height);
	d3.select(".xn_background")
		.attr("width",GxNodes.node().getBBox().width*1)
		.attr("height",xn_background_height)
		.attr("transform","translate("+(0)+","+(xn_background_y_pos)+")")
	;
}


function generate_download_tooltip_html_content(tooltip, hovered_tree_node) {//this one works only for steps
    let step_number = hovered_tree_node.data.step_id;
    let genome_property_id = hovered_tree_node.parent.data.property_id;//updated the object access to properties by adding .data

    localforage.getItem('micromeda-result-key').then(function (result_key) {
        if (result_key === null)
        {
            let fasta_url = back_end_url + 'fasta/' + genome_property_id + '/' + step_number;
            //let download_link_one = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'TOP FASTA' + '</a></p>';
            //let download_link_two = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '?all=true' + '">' + 'ALL FASTA' + '</a></p>';
            let download_link_one = '<a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'Top 10 protein sequences' + '</a><br>';
            let download_link_two = '<a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '?all=true' + '">' + 'All protein sequences' + '</a>';
            tooltip.html(download_link_one + download_link_two);
        }
        else {
            let fasta_url = back_end_url + 'fasta/' + genome_property_id + '/' + step_number + '?result_key=' + result_key;
            //let download_link_one = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'TOP FASTA' + '</a></p>';
            //let download_link_two = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '&all=true' + '">' + 'ALL FASTA' + '</a></p>';
            let download_link_one = '<a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'Top 10 protein sequences' + '</a><br>';
            let download_link_two = '<a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '?all=true' + '">' + 'All protein sequences' + '</a>';
            tooltip.html(download_link_one + download_link_two);
        }
        
        //set tooltip location depending on the object?
        //making it visible
    }).catch(function (err) {
        console.log(err);
    });
}

/**
 * Takes the clicked tree node and creates a tooltip with information on
 * the EBI website about the step property the node represents.
 *
 * @param {Object} tooltip A D3 wrapped html element.
 * @param {Object} hovered_tree_node A an object representing a hovered tree node.
 */
function generate_step_tooltip_html_content(tooltip, hovered_tree_node)
{
    let parent_property_id   = "Parent property ID: " + hovered_tree_node.parent.data.property_id+"<br>";
    let parent_property_name = "Parent property name: " + hovered_tree_node.parent.data.name+"<br>";
    let step_id              = "Step Number: "+hovered_tree_node.data.step_id+"<br>"; 
    let step_name            = "Step name: " + hovered_tree_node.data.name+"<br>";
    let html_content = parent_property_id + parent_property_name + step_id + step_name;
    tooltip.html(html_content);
}

/**
 * Takes the clicked tree node and creates a new tab with information on
 * the EBI website about the genome property for which the node represents.
 *
 * @param {Object} tooltip A D3 wrapped html element.
 * @param {Object} hovered_tree_node A an object representing a hovered tree node.
 */
function generate_property_tooltip_html_content(tooltip, hovered_tree_node)
{
    //I have to correct the path to the data of the nodes depending on which tree
    //hovered tree node has the data in data.propertyid, etc etc, change the path to that. 
    let genome_property_id = hovered_tree_node.data.property_id;

    localforage.getItem(genome_property_id).then(function (local_genome_properties_data) {
        if (local_genome_properties_data !== null)
        {
            default_tool_tip_html_callback(tooltip, genome_property_id, local_genome_properties_data);
        }
        else
        {
            default_tool_tip_html_callback(tooltip, genome_property_id, hovered_tree_node.data);
        }
    });

}
function generate_out_link(database_url, link_name)
{
    //return '<p><a target="_blank" rel="noopener noreferrer" href="' + database_url + '">' + link_name + '</a></p>';
    return '<a target="_blank" rel="noopener noreferrer" href="' + database_url + '">' + link_name + '</a>  ';
}

function default_tool_tip_html_callback(tooltip, property_id, property_data)
{
    let header = "Property ID: " + property_id+"<br>";
    let name   = "Property name: " + property_data.name+"<br>";

    let desc   = "Description: " + "This is a mock property description it can be long."+"<br>";
    if (property_data.hasOwnProperty('description')) {
        desc   = "Description: " + property_data.description + "<br>";
    }

    let out_links = 'Links:';
    let ebi_url   = "https://www.ebi.ac.uk/interpro/genomeproperties/#" + property_id;
    let ebi_link  = generate_out_link(ebi_url, 'EBI Genome Properties');

    let individual_database_links = [];
    if (property_data.hasOwnProperty('databases')) {
        let databases = property_data.databases;
        if (!$.isEmptyObject(databases)) {
            if (databases.hasOwnProperty('KEGG')) {
                let kegg_ids = databases['KEGG'];
                for (let index in kegg_ids){
                    let current_kegg_id = kegg_ids[index];
                    let kegg_url_one = 'https://www.genome.jp/dbget-bin/www_bget?' + current_kegg_id;
                    let kegg_url_two = 'https://www.genome.jp/kegg-bin/show_pathway?' + current_kegg_id;
                    individual_database_links.push(generate_out_link(kegg_url_one, 'KEGG Pathway'));
                    individual_database_links.push(generate_out_link(kegg_url_two, 'KEGG Map'));
                }
            }

            if (databases.hasOwnProperty('MetaCyc')) {
                let metacyc_ids = databases['MetaCyc'];
                for (let index in metacyc_ids){
                    let current_metacyc_id = metacyc_ids[index];
                    let metacyc_url = 'https://biocyc.org/META/new-image?object=' + current_metacyc_id;
                    individual_database_links.push(generate_out_link(metacyc_url, 'MetaCyc Pathway'));
                }
            }
        }
    }

    let combined_database_links = individual_database_links.join('');

    /*
    KEGG Pathway https://www.genome.jp/dbget-bin/www_bget?map00400
    KEGG MAP https://www.genome.jp/kegg-bin/show_pathway?map00400
    MetaCyc Pathway https://biocyc.org/META/new-image?object=ARO-PWY
    */

    let html_content = header + name + desc + out_links + ebi_link + combined_database_links;

    tooltip.html(html_content);
}