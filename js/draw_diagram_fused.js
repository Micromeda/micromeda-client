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
                .attr("href","./html/upload_view_fused.html")
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
        .attr("data-filter","path")
    ;
    sidebar_form_group_select.append("option")
        .attr("class","fmdo")//option
        .attr("value","all")
        .text("All")
    ;
    sidebar_form_group_select.append("option")
        .attr("class","fmdo")//options
        .attr("value","path")
        .attr("selected","true")
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
    ;
    legend_menu.append("label")
                .attr("for","sdbf_c")//filter menu select filter select
                .text("Click the legends to change color")
            ;
    let legends = legend_menu.append('svg')
        .attr("id","sdbf_c")
        .attr("width",legends_parameters['legend_menu_width'])
        .attr("height",legends_parameters['legend_menu_height'])
        .style("vertical-align", legends_parameters['legend_menu_vertical-align'])
        .append("g")
            .attr('class', 'legends')
            .attr('transform', 'translate('+ (0) + ',' + (0) + ')')
    ;
    let GLegends = legends.selectAll(".leg")
            .data(legends_parameters['color_scale_domain'])
    ;
    GLegends.join(
        function(enter){
            let GLegendsEnter = enter.append("g")
                .attr('class', 'leg')
                .attr('transform', 'translate(' + (0) + ',' + (0) + ')')
                .style("vertical-align", "middle")
                .on("click",function(d,i){
                    if(d3.select(".c"+i).style("visibility")==="hidden"){
                        d3.select(".c"+i)
                            .style("visibility","visible")
                            .style("top",(this.getBoundingClientRect().top-3)+"px")
                            .style("left",120+"px")
                        ;
                    }else{
                        d3.select(".c"+i)
                            .style("visibility","hidden");
                    }
                })
            ;
            GLegendsEnter.append("rect")
                .attr("class",function(d,i){
                    return "rect"+i;
                })
                .attr("height",legends_parameters['legend_square_height'])
                .attr("width",legends_parameters['legend_square_height'])
                .style("stroke", "grey")
                .style("stroke-width", 1)
                .attr("x",0)
                .attr("y",function(d,i) {
                        return ((i*legends_parameters['legend_square_height'])+10);
                    }
                )
                .attr("fill",d => heatColor(d))
            ;
            GLegendsEnter.append("text")    
                .attr("x", legends_parameters['legend_square_height']+5)
                .style("font-size","12px")
                .attr("y",function(d,i) {
                        return ((i*legends_parameters['legend_square_height'])+((legends_parameters['legend_square_height'])*(3/4))+10 );
                    }
                )
                .text(d =>d)
            ;
            return(GLegendsEnter);
        })
    ;
    sidebar_form_group.append("hr");
    //Drawing the Buttons
    let sidebar_buttons_form_group = sidebar_form_group.append("div")//side bar buttion
        .attr("class","form-group text-center")
    ;
    sidebar_buttons_form_group.append("button")
        .attr("id","update")
        .attr("type","button")
        .attr("class","btn btn btn-outline-primary btn-sm ub")   
        .text("Update")
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
        .attr("value",50)
    ;
    
}
/**
 * Calculates the heatmap width
 * @param {object} margin_parameters The configuration parameters for footer.
 * @param {object} heatmap_parameters The configuration parameters for footer. *
 * @return {int} heatmap_width
 */
function calculate_heatmap_width(heatmap_parameters, margin_parameters){
    const window_width  = window.innerWidth - margin_parameters["left"] - margin_parameters["right"];
    const window_height = window.innerHeight - window.innerHeight*0.3 - window.innerHeight * 0.4;
    let   wrapperWidth  = Math.min(window_width, window_height) * 1.5;   // like a rectangle with its longer side being half longer than its smaller side
    let   heatmap_width = wrapperWidth - (heatmap_parameters["Y_link_lenght"] + heatmap_parameters["link_margin"]);
    return(heatmap_width);
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
    let heatmap_width                = calculate_heatmap_width(heatmap_parameters,margin_parameters);
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
        .style("width","100%")
        .style("box-shadow","0 0 5px 3px rgba(0,0,0,0.25) inset")
        .style("overflow-y","scroll")
        .on("scroll",function(){
            d3.select(".xn").attr('transform', 'translate(' + (parseInt(d3.select(".heatmap").attr("data-Y_link_lenght")) + parseInt(d3.select(".heatmap").attr("data-link_margin"))) + ',' + (d3.select(".mct").property("scrollTop")*(1/d3.select(".chart").attr("scale"))) + ')');
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
            
    let svg = dv
        .append("svg")
        .attr('transform', 'translate('+ (0) + ',' + (0) + ')')
        .attr("class","div_svg")
        .attr("data-nodeSpaceY",heatmap_parameters.nodeSpaceY)
        .attr("data-sample_name_height",heatmap_parameters.sample_name_height)
    ;
    let gZoom = svg.append("g")
        .attr("class","chart")
        .attr("transform","scale(0.5)")
        .attr("scale",0.5)
        .style("position","relative")
        .style("z-index","1001")
    ;

    // CREATING THE HEATMAP DRAWING SPACE 
    
    
    let heatmap = gZoom.append('g').attr('class', 'heatmap')
        .attr('transform', 'translate('+ (0) + ',' + (heatmap_parameters.sample_name_height+20) + ')')
        .attr("data-Y_link_lenght",heatmap_parameters.Y_link_lenght)
        .attr("data-link_margin",heatmap_parameters.link_margin)
        .style("position","relative")
        .style("z-index",1000)
    ;
    
    let GyNodes = heatmap.append('g')
        .attr('class', 'yn')
        .attr('transform','translate(' + (heatmap_parameters["Y_link_lenght"]+ heatmap_width + heatmap_parameters["link_margin"] + 10) + ',' + (1e-6) + ')')
        .attr("data-intro_animation_time",heatmap_parameters.intro_animation_time)
    ;
    let GxNodes = gZoom.append('g')
        .attr('class', 'xn')
        .attr("height",heatmap_parameters.sample_name_height)
        .attr("width",heatmap_width)
        .attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"] + heatmap_parameters["link_margin"]) + ',' + (0) + ')')
        .style("position","relative")
        .style("z-index","1001")
    ;

    let table = heatmap.append('g')
        .attr('class', 'table')
        .attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"] + heatmap_parameters["link_margin"]) + ',' + (0) + ')')
        .attr("data-heatmapWidth",heatmap_width)
        .attr("data-sample_names_length",sample_names.length)
    ;
    let metadata_icon_holder = heatmap.append('g')
        .attr('class', 'metadata_icon_holder')
        .attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"]/3) + ',' + (0) + ')')
    ;
    let download_icon_holder = heatmap.append('g')
        .attr('class', 'download_icon_holder')
        .attr('transform', 'translate(' + (heatmap_parameters["Y_link_lenght"]/3)*2 + ',' + (0) + ')')
    ;
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
        .text("When the heatmap is completely expanded, the site's response becomes slow")
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
    d3.select(".rb")
        .on("click",function(){
                selected_data.descendants().slice(1).forEach(collapse);//the collapse gunction was defined in the genome_properties_tree_fused.js file
                updateGraph();
            }
        )
    ;
    d3.select(".eab")
        .on("click",function(){
                selected_data.descendants().slice(1).forEach(expand);//the expand gunction was defined in the genome_properties_tree_fused.js file
                updateGraph();
            }
        )
    ;
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

    });
    d3.select(".fry").on("change",function(){
        d3.select(this).property("checked");
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
    });
    d3.select(".frp").on("change",function(){
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
    });
    d3.select(".frn").on("change",function(){
        if(d3.select(".frs").property("checked")){
            d3.select(".frs").property("checked",false);
        }
    });
    d3.select(".frs").on("change",function(){
        if(d3.select(this).property("checked")){
            d3.select(".frn").property("checked",false);
            d3.select(".frp").property("checked",false);
            d3.select(".fry").property("checked",false);
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
    let general_content_parameters   = general_parameters["general_content"];
    let heatmap_parameters           = general_content_parameters["heatmap"];
    let margin_parameters            = general_parameters["margins"];
    let heatmap_width                = calculate_heatmap_width(heatmap_parameters,margin_parameters);
    let nodeSpaceX                   = heatmap_width/samples.length;
    let GxNodes = d3.select(".xn")
    ;
    GxNodes
        .append('rect')
            .attr('transform', 'translate('+ (0) + ',' + (8) + ')')// se divide entre dos para colocarlo en la mitad
            .style("fill","white")
            .style("opacity",0.7)
        ;
    let xNode = GxNodes.selectAll('g.x-node')
        .data(samples);
    xNode.join(
        function(enter){
            let xNodeEnter = enter
                    .append("g")
                    .attr('class',"x-node")
                ;
                xNodeEnter.append("text")
                    .attr('class',"x-node")
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
}



function generate_download_tooltip_html_content(tooltip, hovered_tree_node) {//this one works only for steps
    let step_number = hovered_tree_node.data.step_id;
    let genome_property_id = hovered_tree_node.parent.data.property_id;//updated the object access to properties by adding .data

    localforage.getItem('micromeda-result-key').then(function (result_key) {
        if (result_key === null)
        {
            let fasta_url = back_end_url + 'fasta/' + genome_property_id + '/' + step_number;
            let download_link_one = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'TOP FASTA' + '</a></p>';
            let download_link_two = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '?all=true' + '">' + 'ALL FASTA' + '</a></p>';
            tooltip.html(download_link_one + download_link_two);
        }
        else {
            let fasta_url = back_end_url + 'fasta/' + genome_property_id + '/' + step_number + '?result_key=' + result_key;
            let download_link_one = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url +'">' + 'TOP FASTA' + '</a></p>';
            let download_link_two = '<p><a target="_blank" rel="noopener noreferrer" href="' + fasta_url + '&all=true' + '">' + 'ALL FASTA' + '</a></p>';
            tooltip.html(download_link_one + download_link_two);
        }
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