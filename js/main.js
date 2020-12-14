'use strict'

const dimensions = {
	height: 300,
	width: 500,
	padding: {
		top: 20,
		left: 80,
		right: 60,
		bottom: 40
	}

	
}

const plotTextColor = d3.rgb(255, 255, 255);
const bottom50Color = d3.rgb(13, 57, 255);
const next40Color = d3.rgb(255, 74, 25);
const next9Color = d3.rgb(255, 197, 25);
const top1Color = d3.rgb(13, 255, 181);

! function () {

	$(document).ready(function () {

		// start code here
		let incomeData = [];

		d3.csv("data/Line-chart-dfa-levels.csv", (error, data) => {
		
			console.log("data: ", data);

			data.forEach((row) => {
				let rowDate = row.Date.split(":");
				let year = rowDate[0];
				let month = getMonth(rowDate[1]);

				let dataPoint = {
					date: new Date(year, month),
					bottom50: Number(row.Bottom50),
					next40: Number(row.Next40),
					next9: Number(row.Next9),
					top1: Number(row.Top1),
				}

				incomeData.push(dataPoint);
			})

			LineChart(incomeData);
			pieChart(incomeData);
			showLegend();


			console.log(incomeData);
		
		});


	})

	const getMonth = (quarter) => {
		switch(quarter) {
			case "Q1":
				return 0;
			case "Q2": 
				return 3;
			case "Q3":
				return 6;
			case "Q4":
				return 9;
		}
	}

	const LineChart = (incomeData) => {

		let startDate = incomeData[0].date;
		let endDate = new Date(2021, 0);

		let plotWidth = dimensions.width - dimensions.padding.left - dimensions.padding.right;
		let plotHeight = dimensions.height - dimensions.padding.top - dimensions.padding.bottom;

		let xScale = d3.scaleTime()
			.domain([startDate, endDate])
			.range([dimensions.padding.left, dimensions.width - dimensions.padding.right]);

		let yScale = d3.scaleLinear()
			.domain([0, 45000000])
			.range([dimensions.height - dimensions.padding.bottom, dimensions.padding.top]);

		const svg = d3.select("#wi-line-svg")
			.attr("height", dimensions.height)
			.attr("width", dimensions.width)

		svg.append("rect")
			.attr("x", dimensions.padding.left)
			.attr("y", dimensions.padding.top)
			.attr("height", dimensions.height - dimensions.padding.top - dimensions.padding.bottom)
			.attr("width",  dimensions.width - dimensions.padding.left - dimensions.padding.right)
			.style("fill", "none")
			.style('stroke', d3.rgb(255, 255, 255))
			.style('stroke-width', 3)
			.style("shape-rendering", "crispEdges")

		// do axis labels

		// header label

		svg.append("text")
			.attr("y", 16)
			.attr("x", (plotWidth / 2) + dimensions.padding.left)
			.style("fill", plotTextColor)
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			// .style("font-weight", "bold")
			.style("font-family", "Montserrat")
			.text("Wealth Growth 1989 - 2020");

		// Y scale

		svg.append("text")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (18) + "," + (dimensions.padding.top + ((dimensions.height - dimensions.padding.top - dimensions.padding.bottom) / 2)) + "), rotate(-90)")
			.style("fill", plotTextColor)
			.style("font-size", "16px")
			.text("Wealth Value (in $Trillion)");

		svg.append("text")
			.attr('x', xScale(startDate) - 10)
			.attr('y', yScale(0))
			.style("font-size", "16px")
			.style("text-anchor", "end")
			.style("fill", plotTextColor)
			.text("$0");
			
		svg.append("text")
			.attr('x', xScale(startDate) - 10)
			.attr('y', yScale(45000000) + 16)
			.style("font-size", "16px")
			.style("text-anchor", "end")
			.style("fill", plotTextColor)
			.text("$45T");
			
		
		for (let i = 5; i < 45; i+= 5) {

			let value = i * 1000000;

			if (i % 15 == 0) {
				svg.append("text")
					.attr('x', xScale(startDate) - 10)
					.attr('y', yScale(value)+ 8)
					.style("font-size", "16px")
					.style("text-anchor", "end")
					.style("fill", plotTextColor)
					.text("$" + i + "T");

				svg.append("line")
					.attr("x1", xScale(startDate))
					.attr("x2", xScale(endDate))
					.attr("y1", yScale(value))
					.attr("y2", yScale(value))
					.attr("stroke", plotTextColor)
					.attr("stroke-width", 3)
					.style("shape-rendering", "crispEdges")
			} else {
				svg.append("line")
					.attr("x1", xScale(startDate))
					.attr("x2", xScale(endDate))
					.attr("y1", yScale(value))
					.attr("y2", yScale(value))
					.attr("stroke", plotTextColor)
					.attr("stroke-width", 1)
					.style("shape-rendering", "crispEdges")
			}
		}


		//xAxis
		svg.append("text")
			.attr("y", dimensions.height - 4)
			.attr("x", (plotWidth / 2) + dimensions.padding.left)
			.style("fill", plotTextColor)
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			.text("Year")


		for (let i = 1990; i <= 2020; i += 5) {
			let date = new Date(i, 0);

			svg.append("line")
				.attr("x1", xScale(date))
				.attr("x2", xScale(date))
				.attr("y1", yScale(0))
				.attr("y2", yScale(0) + 5)
				.attr("stroke", plotTextColor)
				.attr("stroke-width", 1)
				.style("shape-rendering", "crispEdges")

			svg.append("text")
				.attr("x", xScale(date))
				.attr('y', yScale(0) + 20)
				.style("font-size", "16px")
				.style("text-anchor", "middle")
				.style("fill", plotTextColor)
				.text(i);
		}

		let lineWidth = 3;

		svg.append("path")
			.datum(incomeData)
			.attr("fill", "none")
			.attr("stroke", bottom50Color)
			.attr("stroke-width",lineWidth)
			.attr("d", d3.line()
				.x(function(d) { return xScale(d.date) })
				.y(function(d) { return yScale(d.bottom50) })
				);

		svg.append("path")
			.datum(incomeData)
			.attr("fill", "none")
			.attr("stroke", next40Color)
			.attr("stroke-width", lineWidth)
			.attr("d", d3.line()
				.x(function(d) { return xScale(d.date) })
				.y(function(d) { return yScale(d.next40) })
				);

		svg.append("path")
			.datum(incomeData)
			.attr("fill", "none")
			.attr("stroke", next9Color)
			.attr("stroke-width",lineWidth)
			.attr("d", d3.line()
				.x(function(d) { return xScale(d.date) })
				.y(function(d) { return yScale(d.next9) })
				);

		svg.append("path")
			.datum(incomeData)
			.attr("fill", "none")
			.attr("stroke", top1Color)
			.attr("stroke-width", lineWidth)
			.attr("d", d3.line()
				.x(function(d) { return xScale(d.date) })
				.y(function(d) { return yScale(d.top1) })
				);

		//final labels

		let finalPoint = incomeData[incomeData.length - 1];

		svg.append("text")
			.attr("x", dimensions.padding.left + plotWidth + 3)
			.attr('y', yScale(finalPoint.top1))
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text("$" + ((finalPoint.top1 / 1000000).toFixed(1)) + "T");

		svg.append("text")
			.attr("x", dimensions.padding.left + plotWidth + 3)
			.attr('y', yScale(finalPoint.next9))
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text("$" + ((finalPoint.next9 / 1000000).toFixed(1)) + "T");

		svg.append("text")
			.attr("x", dimensions.padding.left + plotWidth + 3)
			.attr('y', yScale(finalPoint.next40) + 10)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text("$" + ((finalPoint.next40 / 1000000).toFixed(1)) + "T");

		svg.append("text")
			.attr("x", dimensions.padding.left + plotWidth + 3)
			.attr('y', yScale(finalPoint.bottom50))
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text("$" + ((finalPoint.bottom50 / 1000000).toFixed(1)) + "T");

	}

	const pieChart = (incomeData) => {

		let dataPoint = incomeData[incomeData.length - 1];

		let plotWidth = dimensions.width - dimensions.padding.left - dimensions.padding.right;
		let plotHeight = dimensions.height - dimensions.padding.top - dimensions.padding.bottom;

		let values = [];

		let totalValue = 0;

		for (let prop in dataPoint) {
			if (prop != "date") {
				totalValue += dataPoint[prop];
				values.push({
					key: prop,
					value: dataPoint[prop]
				})
			}
		}

		values.forEach((value) => {
			value.percentage = value.value / totalValue;
		})

		console.log("pie chart data point", values)

		const svg = d3.select("#wi-pie-svg")
			.attr("height", dimensions.height)
			.attr("width", dimensions.width)

		
		svg.append("text")
			.attr("y", 16)
			.attr("x", (plotWidth / 2) + dimensions.padding.left)
			.style("fill", plotTextColor)
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			// .style("font-weight", "bold")
			.style("font-family", "Montserrat")
			.text("Wealth Distribution in 2020");

		let g = svg.append("g")
		.attr("transform", "translate(" + (plotWidth / 2 + dimensions.padding.left) + "," + (plotHeight / 2 + dimensions.padding.top) + ")")

		let pie = d3.pie()
			.value((d) => {return d.value});

		var data_ready = pie(values);

		console.log("dataready ", data_ready)

		let radius = plotHeight / 2 - 20;
		
		g.selectAll('.wedge')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', d3.arc()
			  .innerRadius(0)
			  .outerRadius(radius)
			)
			.attr('fill', function(d){ return(getColor(d.data.key)) })


		svg.append("text")
			.attr("x", 300)
			.attr('y', 280)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text(((dataPoint.top1 / totalValue * 100).toFixed(1)) + "%");

		svg.append("line")
			.attr("x1", 300)
			.attr("x2", 260)
			.attr("y1", 263)
			.attr("y2", 200)
			.attr("stroke", plotTextColor)
			.attr("stroke-width", 1)
			.style("shape-rendering", "crispEdges")

		svg.append("text")
			.attr("x", 360)
			.attr('y', 60)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text(((dataPoint.next9 / totalValue * 100).toFixed(1)) + "%");

		svg.append("line")
			.attr("x1", 358)
			.attr("x2", 320)
			.attr("y1", 62)
			.attr("y2", 100)
			.attr("stroke", plotTextColor)
			.attr("stroke-width", 1)
			.style("shape-rendering", "crispEdges")

		svg.append("text")
			.attr("x", 100)
			.attr('y', 100)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text(((dataPoint.next40 / totalValue * 100).toFixed(1)) + "%");

		svg.append("line")
			.attr("x1", 143)
			.attr("x2", 200)
			.attr("y1", 100)
			.attr("y2", 120)
			.attr("stroke", plotTextColor)
			.attr("stroke-width", 1)
			.style("shape-rendering", "crispEdges")

		svg.append("text")
			.attr("x", 180)
			.attr('y', 40)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text(((dataPoint.bottom50 / totalValue * 100).toFixed(1)) + "%");

		svg.append("line")
			.attr("x1", 217)
			.attr("x2", 255)
			.attr("y1", 40)
			.attr("y2", 60)
			.attr("stroke", plotTextColor)
			.attr("stroke-width", 1)
			.style("shape-rendering", "crispEdges")

		
	}
 
	const getColor = (key) => {
		switch(key) {
			case "bottom50":
				return bottom50Color;
			case "next40":
				return next40Color;
			case "next9":
				return next9Color;
			case "top1":
				return top1Color;
		}
	} 

	const showLegend = () => {
		let legendValues = [{
			key: "bottom50",
			text: "Bottom 50%"
		},{
			key: "next40",
			text: "50% - 89%"
		},{
			key: "next9",
			text: "90% - 99%"
		},{
			key: "top1",
			text: "Top 1%"
		}]

		let height = 60;
		let width = 500;

		let svg = d3.select("#legend-svg")
			.attr("height", height)
			.attr("width", width);

		svg.append("text")
			.attr("y", 16)
			.attr("x", (width / 2))
			.style("fill", plotTextColor)
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			// .style("font-weight", "bold")
			.style("font-family", "Montserrat")
			.text("Income Value Percentiles");

		let legendItem = svg.selectAll(".legend-item")
			.data(legendValues, (d) => {
				return d.key
			}) 
			.enter()

		let gap = 130;

		legendItem.append("rect")
			.classed("legend-item", 1)
			.attr("x", (d, i) => {
				return i * gap + 15;
			})
			.attr("y", 30)
			.attr("height", 20)
			.attr("width", 20)
			.style("fill", (d) => {
				return getColor(d.key);
			})
			.style("stroke", )

		legendItem.append("text")
			.classed("legend-item", 1)
			.attr("x", (d, i) => {
				return i * gap + 40;
			})
			.attr("y", 50)
			.style("font-size", "16px")
			.style("text-anchor", "start")
			.style("fill", plotTextColor)
			.text((d) => {
				return d.text;
			});

	}

}();
