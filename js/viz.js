var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";

  var width = document.getElementById('container').offsetWidth,
      height = 500,
      tooltip = CustomTooltip("gates_tooltip", 240),
      layout_gravity = -0.01,
      damper = 0.1,
      nodes = [],
      vis, force, circles, radius_scale;

  var center = {x: width / 2, y: height / 2};

  var type_centers = {
      "ONLONL": {x: width / 5, y: height / 2},
      "ONLSTR": {x: 2 * width / 5, y: height / 2},
      "STRONL": {x: 3 * width / 5, y: height / 2},
	  "STRSTR": {x: 4 * width / 5, y: height / 2},
    };
	
  var category_centers = {
      "F": {x: width / 6, y: height / 2},
      "G": {x: width / 3, y: height / 2},
      "C": {x: width / 2, y: height / 2},
	  "S": {x: 2 * width / 3, y: height / 2},
	  "E": {x: 5 * width / 6, y: height / 2}
    };	

  var user_centers = {
      "Shruthi": {x: width / 6, y: height / 2},
      "Shugo": {x: width / 3, y: height / 2},
      "Lavanya": {x: width / 2, y: height / 2},
	    "Rimi": {x: 2 * width / 3, y: height / 2},
	   "Stavan": {x: 5 * width / 6, y: height / 2}
    };		

  var fill_color = d3.scale.ordinal()
                  .domain(["F", "G", "C", "S", "E"])
                  .range(["#DF9496", "#77BA9B", "#B6A754", "#F4F3EE", "#93B1C6"]);

  function custom_chart(data) {
    var max_price = d3.max(data, function(d) { return parseFloat(d.price, 10); } );
    radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_price]).range([2, 50]);

    //create node objects from original data
    //that will serve as the data behind each
    //bubble in the vis, then add each node
    //to nodes to be used later
    data.forEach(function(d){
      var node = {
        id: d.id,
        radius: radius_scale(parseInt(d.price)),
        price: d.price,
        user: d.user,
        item: d.item,
        category: d.category,
        type: d.type,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      nodes.push(node);
    });

    nodes.sort(function(a, b) {return b.value- a.value; });

    vis = d3.select("#vis").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");

    circles = vis.selectAll("circle")
                 .data(nodes, function(d) { return d.id ;});

    circles.enter().append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.category) ;})
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.category)).darker();})
      .attr("id", function(d) { return  "bubble_" + d.id; })
      .on("mouseover", function(d, i) {show_details(d, i, this);} )
      .on("mouseout", function(d, i) {hide_details(d, i, this);} );

    circles.transition().duration(2000).attr("r", function(d) { return d.radius; });

  }

  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  function start() {
    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);
  }

  function display_group_all() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
         .on("tick", function(e) {
            circles.each(move_towards_center(e.alpha))
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    force.start();
    hide_types();
  }

  function move_towards_center(alpha) {
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }

  function display_by_type() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(move_towards_type(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    display_types();
  }

  function move_towards_type(alpha) {
    return function(d) {
      var target = type_centers[d.type];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }


  function display_types() {
      var types_x = {"LOOK ONL SHOP ONL": type_centers["ONLONL"]["x"]-60, "LOOK ONL SHOP IN STR": type_centers["ONLSTR"]["x"]-30, "LOOK IN STR SHOP ONL": type_centers["STRONL"]["x"]-20, "LOOK IN STR SHOP IN STR": type_centers["STRSTR"]["x"]+10};
      var types_data = d3.keys(types_x);
      var types = vis.selectAll(".types")
                 .data(types_data);

      types.enter().append("text")
                   .attr("class", "types")
                   .attr("x", function(d) { return types_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .style("font-weight","bold")
                   .text(function(d) { return d;});

  }

  function hide_types() {
      var types = vis.selectAll(".types").remove();
  }

  function display_by_category() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(move_towards_category(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    display_categories();
  }

  function move_towards_category(alpha) {
    return function(d) {
      var target = category_centers[d.category];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }


  function display_categories() {
      var categories_x = {"FOOD": category_centers["F"]["x"], "GROCERY": category_centers["G"]["x"], "CLOTHING": category_centers["C"]["x"], "SERVICE": category_centers["S"]["x"], "ELECTRONICS":category_centers["E"]["x"]};
      var categories_data = d3.keys(categories_x);
      var categories = vis.selectAll(".categories")
                 .data(categories_data);

      categories.enter().append("text")
                   .attr("class", "categories")
                   .attr("x", function(d) { return categories_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .style("font-weight","bold")
                   .text(function(d) { return d;});

  }

  function hide_categories() {
      var types = vis.selectAll(".categories").remove();
  }
  
  function display_by_user() {
    force.gravity(layout_gravity)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(move_towards_user(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    display_users();
  }

  function move_towards_user(alpha) {
    return function(d) {
      var target = user_centers[d.user];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.1;
    };
  }


  function display_users() {
      var users_x = {"Shruthi": user_centers['Shruthi']['x'], "Shugo":user_centers['Shugo']['x'], "Lavanya": user_centers['Lavanya']['x'], "Rimi": user_centers['Rimi']['x'], "Stavan": user_centers['Stavan']['x']};
      var users_data = d3.keys(users_x);
      var users = vis.selectAll(".users")
                 .data(users_data);

      users.enter().append("text")
                   .attr("class", "users")
                   .attr("x", function(d) { return users_x[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .style("font-weight","bold")
                   .text(function(d) { return d;});

  }

  function hide_users() {
      var users = vis.selectAll(".users").remove();
  }



  
  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "black");
    var content = "<span class=\"name\">User: </span><span class=\"value\"> " + data.user + "</span><br/>";
    content +="<span class=\"name\">Price:</span><span class=\"value\"> $" + addCommas(data.price) + "</span><br/>";
	content +="<span class=\"name\">Item:</span><span class=\"value\">" + addCommas(data.item) + "</span><br/>";
	content +="<span class=\"name\">Price:</span><span class=\"value\"> $" + addCommas(data.price) + "</span><br/>";
    content +="<span class=\"name\">Type:</span><span class=\"value\"> " + data.type + "</span>";
    tooltip.showTooltip(content, d3.event);
  }

  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.group)).darker();} );
    tooltip.hideTooltip();
  }

  var my_mod = {};
  my_mod.init = function (_data) {
    custom_chart(_data);
    start();
  };

  my_mod.display_all = display_group_all;
  my_mod.display_type = display_by_type;
  my_mod.toggle_view = function(view_type) {
    if (view_type == 'type') {
	  hide_users();hide_categories();
      display_by_type();
    }else if(view_type == 'category'){
	  hide_types();hide_users();
	  display_by_category();
	}
	else if(view_type == 'user') {
	hide_types();hide_categories();
	  display_by_user();
	}
	 else {
	 	hide_types();
	 	hide_categories();
	 	hide_users();
      display_group_all();
      }
    };

  return my_mod;
})(d3, CustomTooltip);
