function dropdownFilter(obj, array,filter){
				//console.log(obj, array,filter)
				var heirarchy=["Region","Country","Metric","SubMetric","Month"]
				var get_obj = "d3.nest()"
				for(i=0; i < array.length+filter ; i++){
				var get_obj = get_obj + " .key(function(d,i) { return d['"+heirarchy[i]+"'] }) " } 
				var get_obj = get_obj + ".entries(obj)"
				//console.log(get_obj)			
				var get_obj = eval(get_obj)	
				array.map(function(e,i){
				var Key = get_obj.map(function (f,j){ return f.key  })
				get_obj= get_obj[Key.indexOf(e)].values				
				})				
				return get_obj
				}

function dropdownCreate(id,datas){
	datas.unshift("----Select----");
	deleteElement(id);
	d3.select(id)
          .selectAll("option")
          .data(datas)
          .enter()
          .append("option")
          .attr("value", function(e) { return e })         
          .text(function(f) { return f; });

}


function deleteElement(id){
	d3.select(id)
          .selectAll("option").remove();
}
function breadcrumb(breadcrumbData){
	console.log(breadcrumbData)
	d3.select("#breadcrumb")
          .selectAll("li").remove();
	d3.select("#breadcrumb")
          .selectAll("li")
          .data(breadcrumbData)
          .enter()
          .append("li")
          .text(function(f) { return f; });
}


d3.csv("datafinal1.csv",function (data) {
		//console.log(data)
		var arrayHeirarchy = new Array();
		var indicatorValue_2 = new Array();
		var filterData =  new Object();
		var keyy4 = new Array();
		var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var year,month;
		//var filterVal = [];
		var group = d3.nest()
		.key(function(d, i) { return d.Region; }) 
		.entries(data);	
		//console.log(data)	
		var keyy = group.map(function(d,i){
	 		return d.key	
		})

		dropdownCreate("#region",keyy)

		$("#region").change(function(d,i){	
			arrayHeirarchy=[]	
			arrayHeirarchy[0] = d.target.value			
			var filterData= dropdownFilter(data,arrayHeirarchy,1)	

			var keyy1 = filterData.map(function(d,i){
	 		return d.key	
			})			
			dropdownCreate("#country",keyy1)
			})

		$("#country").change(function(d,i){	
			arrayHeirarchy[1] = d.target.value			
			var filterData= dropdownFilter(data, arrayHeirarchy,1)			
			var keyy2 = filterData.map(function(d,i){
	 		return d.key	
			})			
			dropdownCreate("#metric",keyy2)

		})
		$("#metric").change(function(d,i){			
			arrayHeirarchy[2] = d.target.value			
			var filterData= dropdownFilter(data, arrayHeirarchy,1)			
			var keyy3 = filterData.map(function(d,i){
	 		return d.key	
			})
			dropdownCreate("#submetric",keyy3)
		})

		$("#submetric").change(function(d,i){			
			arrayHeirarchy[3] = d.target.value	
			filterData= dropdownFilter(data, arrayHeirarchy,1)
			//console.log(filterData)	
			keyy4 = filterData.map(function(d,i){
	 		return d.key	
			})
			//console.log(keyy4)

			dropdownCreate("#year",keyy4.toString().substr(0,4).split())
		})

		$("#year").change(function(d,i){	
			year = d.target.value
			//console.log(filterData)
			//console.log(keyy4)
								
			var month = keyy4.map(function(d){
							return d.slice(4,6)-1
							})
			//var month = parseInt(keyy4.toString().slice(4,6))-1	
			var FilteredMonthName = month.map(function(d){
				return monthNames[parseInt(d)].split(); 
			})	

			//console.log(FilteredMonthName)
			dropdownCreate("#month",FilteredMonthName)
		})

		$("#month").change(function(d,i){	
			month = d.target.value
			var monthNum = monthNames.indexOf(d.target.value)+1;
			var monthNum = monthNum.toString()
			var slicedDate = year+0+monthNum
			var clickedVal = "201701";
			$.each( keyy4, function( index, value ){
				var slicedVal = value.slice(0,6)
			    if(slicedVal == slicedDate)
			    {
					 arrayHeirarchy[4] = value
			}
			});
			//console.log(arrayHeirarchy)
		})

		$("#SubmitBtn").on("click", function(){ 

			//Bar Chart
			var breadcrumbData = arrayHeirarchy

			breadcrumb(breadcrumbData)
			//console.log(breadcrumb)
			var filterData= dropdownFilter(data,arrayHeirarchy,0)	
			//console.log(filterData);			
			var ChartData = d3.nest()
  			.key(function(d, i) { return d.Gateway; }) // nest first by month
			.rollup(function(v) { return d3.sum(v, function(d) { return d.Values; }); })
  			.entries(filterData)
			chartCreation(ChartData);
			//console.log(ChartData)

			//ScatterPlot

			var scatterChart = d3.nest()
  			.key(function(d, i) { return d.cabinndclass; }) // nest first by month
			.rollup(function(v) { return d3.sum(v, function(d) { return d.Values; }); })
  			.entries(filterData)
			/*chartCreation(ChartData);*/
 			
			//Indicator 2
			var indicator = d3.nest()
  			.key(function(d, i) { }) // nest first by month
			.rollup(function(v) { return d3.sum(v, function(d) { return d.Values; }); })
  			.entries(data)


  			indicatorValue_2 = indicator.map(function(d) { return d.value.toFixed(2)})
  			$("#indicator_value2").html(indicatorValue_2)
  			var indicator_3 = d3.nest()
					  			.key(function(d, i) { }) // nest first by month
								.rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
					  			.entries(ChartData);
  			var indicatorValue_3 = indicator_3.map(function(d){ return d.value.toFixed(2)})
  			var indicatorValue_3 = (indicatorValue_2/indicatorValue_3)
  			$("#indicator_value3").html(indicatorValue_3.toFixed(2))

  			var indicator_1 = d3.nest()
					  			.key(function(d, i) { }) // nest first by month
								.rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
					  			.entries(scatterChart);

  			var indicator_value1 = indicator_1.map(function(d){ return d.value; })

  			$("#indicator_value1").html(scatterChart.length)

  			$("#indicator_Totalvalue").html(Math.round(indicator_value1))
  			console.log(deleteElement("#country"));
			console.log(deleteElement("#metric"));
			console.log(deleteElement("#submetric"));
			console.log(deleteElement("#year"));
			console.log(deleteElement("#month"));

			createScatterPlot(scatterChart)



		})

})
//console.log(arrayHeirarchy)

function chartCreation(data){

	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $(".bar12").width() - margin.left - margin.right,
    height = $(".bar12").height() - margin.top - margin.bottom;

    // set the ranges
	var x = d3.scaleBand()
	          .range([0, width])
	          .padding(0.5);
	var y = d3.scaleLinear()
	          .range([height, 0]);

	 var tip = d3.tip().attr('class', 'd3-tip')
	              .direction(function(d,i) {
	                 if ($(this).position().left > 348)
	                  return 'w'
	                 return 'e' })
	              .offset([-10, 0])
	              .html(function(d,i) {
	              	return d.key+" - "+d.value.toFixed(2);
	                
	                });

	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	$("#barChart2").html("")
	var svg = d3.select("#barChart2").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");
	    // Scale the range of the data in the domains
	  	x.domain(data.map(function(d) { return d.key; }));
	  	y.domain([0, d3.max(data, function(d) { return d.value; })]);

	  	// append the rectangles for the bar chart
	  var barTip = svg.selectAll(".bar")
	      .data(data)
	      .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.key); })
	      .attr("width", x.bandwidth())
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide);
	      barTip.call(tip);
	    // add the x Axis
		svg.append("g")
		   .attr("transform", "translate(0," + height + ")")
		   .call(d3.axisBottom(x));

		// add the y Axis
			svg.append("g")
  		   .call(d3.axisLeft(y));
}

function createScatterPlot(scater){
	//console.log(scater)
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $(".bar11").width() - margin.left - margin.right,
    height = $(".bar11").height() - margin.top - margin.bottom;


    // setup x 
var xValue = function(d) { return d.key;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

    // setup y
var yValue = function(d) { return d.value;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);


 var tip = d3.tip().attr('class', 'd3-tip')
              .direction(function(d,i) {
                 if ($(this).position().left > 348)
                  return 'w'
                 return 'e' })
              .offset([-10, 0])
              .html(function(d,i) {
              	return "C&C:"+d.key+" - "+d.value.toFixed(2);
                
                });

    // add the graph canvas to the body of the webpage
    $("#barChart1").html("")
var svg = d3.select("#barChart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // change string (from CSV) into number format
  scater.forEach(function(d) {
    d.value = +d.value;
//    console.log(d);
  });

// don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(scater, xValue)-1, d3.max(scater, xValue)+1]);
  yScale.domain([d3.min(scater, yValue)-1, d3.max(scater, yValue)+1]);

// x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Cabin and Class");

// y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Values");

// draw dots
  var dot1 = svg.selectAll(".dot")
      .data(scater)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", 20)// xMap in
      .attr("cy", yMap)
      .style("fill-opacity", 0.5)
       .style("fill", "steelblue")
      //.style("fill", "steelblue"/* function(d) { return color(cValue(d));}*/);

       .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
      dot1.call(tip);

// draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
// draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
// draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
}