var rQuery = document.getElementById("query");
	rQuery.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("searchbutton").click();
    }
	});

	function runQuery(){
	    $("#loading").show();
		var sQuery = document.getElementById("query").value;

		$.post( "/search", {
			javascript_data: sQuery
		},
        function(data,status){
            $("#loading").hide();
			var svg2 = d3.select("svg > g");
			if(svg2.empty()){

			}else{
			d3.select("svg").remove();
			}
			refreshSVG(data)
        });
	}

	function refreshSVG(json){
				var type = "Youtube"
				jQuery.ajaxSetup({async:true});
				var width = 960,
					height = 620
				var svg = d3.select(".col-lg-12").append("svg")
					.attr("width", "100%")
					.attr("height", height);
				svg.selectAll("*").remove();
				var force = d3.layout.force()
					.gravity(0.05)
					.distance(function(){ return $(window).width()>750?250:150})
					.charge(-500)
					.size([width, height]);

				console.log(json)
				  force
					  .nodes(json.nodes)
					  .links(json.links)
					  .start();
				  var link = svg.selectAll(".link")
					  .data(json.links)
					.enter().append("line")
					  .attr("class", "link");
				  var node = svg.selectAll(".node")
					  .data(json.nodes)
					.enter().append("g")
					  .attr("class", "nodes")
					  .call(force.drag);
				  node.append("image")
					  .attr("xlink:href", function(){ return "static/icons/yt.ico" })
					  .attr("x", -8)
					  .attr("y", -8)
					  .attr("class", "wiki")
					  .attr("width", function(){ return $(window).width()>750?50:35})
					  .attr("height", function(){ return $(window).width()>750?50:35});

				  node.append("text")
					  .attr("dx", -50)
					  .attr("dy", "-.35em")
					  .text(function(d) { return d.name });
				 node.on("click",function(d){
					console.log("clicked", d.name);
					d3.select("svg").remove();
					expand(d.url);
				  });
				  force.on("tick", function() {
					link.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });
					node.attr("cx", function(d) { return d.x = Math.max(50, Math.min($(window).width() - 200, d.x)); })
						.attr("cy", function(d) { return d.y = Math.max(100, Math.min($(window).height() - 100, d.y)); })
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				  });
				  }
				  function expand(url){
					$.post( "/expand", {
						javascript_data: url
					},
					function(data,status){

						var svg2 = d3.select("svg > g");
						if(svg2.empty()){
							console.log("NO SVG exists for now");
						}else{
							d3.select("svg").remove();
						}
						refreshSVG(data)
					});
				  }