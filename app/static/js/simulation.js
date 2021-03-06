/**
 * Created by Pjer on 8/19/2016.
.
 */


Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};


var status_jump = "local";

function auto_input() {
    if (status_jump =="local"){

        var end_t = $('#input_func_t')[0];
        end_t.value = "30";
        var step_l = $('#input_func_l')[0];
        step_l.value = "0.01";



        var input_1 = $('#input_func_0')[0];
        input_1.value = "-10*y[0] + 10*y[1]";
        var input_2 = $('#input_func_1')[0];
        input_2.value = "28*y[0] - y[1]-y[0]*y[2]";
        var input_3 = $('#input_func_2')[0];
        input_3.value = "-8/3 * y[2] + y[0] * y[1]";

        var init_1 = $('#input_init_0')[0];
        init_1.value = "10";
        var init_2 = $('#input_init_1')[0];
        init_2.value = "5";
        var init_3 = $('#input_init_2')[0];
        init_3.value = "1.01";
        Materialize.updateTextFields();
    }
}



function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m,key,value) {
            vars[key] = value;
        });
    return vars;
}

var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });


//console.log(getUrlVars()["id"]);

var data_raw;
var vis;
var status=0;
var lines;
function vis_data(data,x_max,x_min,y_max,y_min,unstable,lya){
    if(status==1){
        vis.remove();}
    var vis_root = d3.select("#visualisation");
    vis=vis_root.append("svg")
        .attr("width",600)
        .attr("height",500+50);

    var    WIDTH = 600,
        width = 530,
        HEIGHT = 500,
        height = 480,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([x_min,x_max]),
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([y_min,y_max]),
        xAxis = d3.svg.axis()
            .scale(xScale),

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);


    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("class","axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);





    var data_length = data[0]["value"].length;
    for (var i=0;i<data_length;i++){
        var lineGen_1 = d3.svg.line()
            .x(function(d) {
                return xScale(d.time);
            })
            .y(function(d) {
                return yScale(d.value[i]);
            })
            .interpolate("basis");




        vis.append('svg:path')
            .attr('class','line')
            .attr('d', lineGen_1(data))
            .attr('stroke', color(i*0.1))
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }

    lines = document.getElementsByClassName('line');


    var mouseG = vis.append("g")
        .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", function(d) {
            return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width)
        .attr('x',50)// can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
                .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });


        });


    if(unstable!="None"){
        var data_unstable=[{
            "value": y_max,
            "time": unstable
        }, {
            "value": y_min,
            "time": unstable+0.000000001
        }];


        vis.append("text")
            .attr("dy", "3.35em")
            .attr("dx", ".75em")
            .attr('x',0)
            .attr('y',450)
            .style("text-anchor", "start")
            .text( "Maybe unstable after "+String(unstable) +" !!!!")
            .attr("style","font-size:24px;font-family:consolas")
            .attr("fill","black");
    }

    status=1;
}
var n_node;
var data_graph_g;

function  run_sim(n,data_graph) {
    var str_func='';
    var str_init='';
    for(var i=0;i<n;i++){
        node = data_graph.nodes[i];
        id_func = "input_func_"+node.id;
        id_init = "input_init_"+node.id;

        str_func+="dy"+node.id+"dx="+document.getElementById(id_func).value;
        str_init+="y"+node.id+"="+document.getElementById(id_init).value;
        if(i!=n-1){
            str_func += "\n";
            str_init += "\n";
        }
    }

    str_end_t = document.getElementById("input_func_t").value;
    str_step_l = document.getElementById("input_func_l").value;

    //console.log(str_func);
    //console.log(str_init);
    var str_post={"plugin":"simulation","eqs":str_func,"init":str_init,"end_t":str_end_t,"step_l":str_step_l};
    $.ajax({
        type: "POST",
        url: "/plugin/",
        data: str_post,
        success: function(response){
            var Jr = JSON.parse(response);
            if(Jr['success']==true) {
                var meta_data = JSON.parse(Jr['result']);
                var meta_time = JSON.parse(Jr['t_seq']);
                var data_res = [];
                var data_all = [];
                var data_t_all = [];
                for (var i = 0;i< meta_data[0].length;i++) {
                    if (1==1){//i % 20 == 0) {
                        var data_temp = [];
                        for (var j = 0; j < meta_data.length; j++) {
                            data_temp.push(meta_data[j][i]);
                            data_all.push(meta_data[j][i]);
                        }
                        //var step_l = document.getElementById("input_func_l").value;
                        data_res.push({"value": data_temp, "time": meta_time[i]});
                        data_t_all.push(meta_time[i]);
                    }
                }
                var glo_max = (data_all).max();
                var glo_min = (data_all).min();
                var glo_t_max = (data_t_all).max();
                var glo_t_min = (data_t_all).min();

                //console.log(data_res);

                var unstable = Jr['unstable'];
                //console.log(unstable);
                var lya = JSON.parse(Jr['lyapunov'])
                vis_data(data_res,glo_t_max,glo_t_min,glo_max,glo_min,unstable,lya);
            }
            else {
                Materialize.toast(Jr['error']+"error", 3000, 'rounded');
            }
        }
    });
}

function  no_connection_status() {

    console.log("no internet connection");
    d3.json("data/simu_data.json", function (error, data_graph) {


        data_graph_g=data_graph;
        var func_container = d3.selectAll("#functions");
        var func_0  = func_container.append("div")
            .selectAll("div")
            .data(data_graph.nodes)
            .enter();


        var card_div = func_0.append("div")
            .attr("class",'row');
            
            card_div
                .append("div")
                .attr("class","indigo-text")
                .attr("style","margin-top:30px;margin-left:40px")
                .append("span")
                .text(function (d) {
                var ret = '';
                ret+="Node name : ";
                ret+=d.name+"  ";
                return ret
            });
        card_div
            .append("div")
            .attr("class","indigo-text")
            .attr("style","margin-left:40px")
            .append("span")
            .text(function (d) {
                var ret = '';
                ret+="  Node title : ";
                ret+=d.title;
                return ret
            });


        var func = card_div.append("div")
            .attr("class","card row")
            .attr("style","margin:25px");
        
        func.append("div")
            .attr("class","col m2 s4")
            .attr("style","margin-top:15px")
            .attr("lang","latex")
            .append("img")
            .attr("src",function (d,i) {
                src_str = "http://latex.codecogs.com/gif.latex?\\frac{dy_{"
                    +   d.id
                    + "}}{dt} \\quad=";
                return src_str
            });

        var inp = func.append("div")
            .attr("class","input-field col m10 s12");

 

        inp.append("input")
            .attr("id",function (d) {
                fnstr = ("input_func_"+d.id);
                return fnstr;
            }).attr("type" ,"text");

        inp.append("label")
            .attr("for",function (d) {
            fnstr = "input_func_"+d.id;
            return fnstr;
        }).text(function (d) {
            return "Control Function of [ID:"+d.id+']';
        });



        func.append("div")
            .attr("class","col m2 s4")
            .attr("style","margin-top:25px")
            .attr("lang","latex")
            .append("img")
            .attr("src",function (d,i) {
                src_str = "http://latex.codecogs.com/gif.latex?y_{"
                    +   d.id
                    + "} \\quad=";
                return src_str
            });

        var inp_1 = func.append("div")
            .attr("class","input-field col m10 s12");


        inp_1.append("input")
            .attr("id",function (d) {
                fnstr = ("input_init_"+d.id);
                return fnstr;
            }).attr("type" ,"text");

        inp_1.append("label").attr("for",function (d) {
            fnstr = "input_init_"+d.id;
            return fnstr;
        }).html(function (d) {
            return "Initial Value of index "+d.id;
        });

        func_container
            .append("div")
            .attr("class","center")
            .append("a")
            .attr("class","btn btn-large waves-effect ")
            .html("run!")
            .attr("onclick","run_sim(n_node,data_graph_g)");



        n_node = data_graph.nodes.length;
        //console.log(n_node);

        
        

        data_raw = [{
            "value": ["202","177"],
            "time": "2000"
        }, {
            "value": ["215","167"],
            "time": "2001"
        }, {
            "value": ["179","157"],
            "time": "2002"
        }, {
            "value": ["199","187"],
            "time": "2003"
        }, {
            "value": ["163","187"],
            "time": "2007"
        }, {
            "value": ["176","157"],
            "time": "2010"
        }];

        //debug data
        //vis_data(data_raw)


    });
}



function draw_functions_simu(data_graph) {

    data_graph_g=data_graph;
    var func_container = d3.selectAll("#functions");
    var func_0  = func_container.append("div")
        .selectAll("div")
        .data(data_graph.nodes)
        .enter();


    var card_div = func_0.append("div")
        .attr("class",'row');

    card_div
        .append("div")
        .attr("class","indigo-text")
        .attr("style","margin-top:30px;margin-left:40px")
        .append("span")
        .text(function (d) {
            var ret = '';
            ret+="Node name : ";
            ret+=d.name+"  ";
            return ret
        });
    card_div
        .append("div")
        .attr("class","indigo-text")
        .attr("style","margin-left:40px")
        .append("span")
        .text(function (d) {
            var ret = '';
            ret+="  Node title : ";
            ret+=d.title;
            return ret
        });


    var func = card_div.append("div")
        .attr("class","card row")
        .attr("style","margin:25px");

    func.append("div")
        .attr("class","col m2 s4")
        .attr("style","margin-top:15px")
        .attr("lang","latex")
        .append("img")
        .attr("src",function (d,i) {
            src_str = "http://latex.codecogs.com/gif.latex?\\frac{dy_{"
                +   String(i)
                + "}}{dt} \\quad=";
            return src_str
        });

    var inp = func.append("div")
        .attr("class","input-field col m10 s12");



    inp.append("input")
        .attr("id",function (d,i) {
            fnstr = ("input_func_"+d.id);
            return fnstr;
        }).attr("type" ,"text");

    inp.append("label")
        .attr("for",function (d) {
            fnstr = "input_func_"+d.id;
            return fnstr;
        }).text(function (d) {
        return "Control Function of [ID:"+d.id+']';
    });



    func.append("div")
        .attr("class","col m2 s4")
        .attr("style","margin-top:25px")
        .attr("lang","latex")
        .append("img")
        .attr("src",function (d,i) {
            src_str = "http://latex.codecogs.com/gif.latex?y_{"
                +   String(i)
                + "} \\quad=";
            return src_str
        });

    var inp_1 = func.append("div")
        .attr("class","input-field col m10 s12");


    inp_1.append("input")
        .attr("id",function (d,i) {
            fnstr = ("input_init_"+d.id);
            return fnstr;
        }).attr("type" ,"text");

    inp_1.append("label").attr("for",function (d,i) {
        fnstr = "input_init_"+d.id;
        return fnstr;
    }).html(function (d,i) {
        return "Initial Value of index "+String(i);
    });

    func_container
        .append("div")
        .attr("class","center")
        .append("a")
        .attr("class","btn btn-large waves-effect ")
        .html("run!")
        .attr("onclick","run_sim(n_node,data_graph_g)");



    n_node = data_graph.nodes.length;
    //console.log(n_node);





}



    window.onload = (function () {
    var id_from_pano = getUrlVars()["id"];

            if(id_from_pano!=undefined && id_from_pano!=-1){
                var dictData = {"plugin":"pano","action":"load","id":id_from_pano};
                $.ajax({
                    type:"POST",
                    url:"/plugin/",
                    data:dictData,
                    success:function (response) {
                        var Jr = JSON.parse(response);
                        var data_g = JSON.parse(Jr["data"]);
                        draw_functions_simu(data_g);
                    },
                    statusCode: {
                        404: function() {
                            console.log("connection error(404)");
                            alert("can not connect to server");
                            no_connection_status();
                        },
                        400: function() {
                            console.log("connection error(400)");
                            alert("can not connect to server");
                            no_connection_status();
                        }
                    }
                });
            }
            else {
                no_connection_status();
            }

}
);