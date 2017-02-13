import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

export default class Counter extends React.Component {

	constructor(props) {
	    super(props);
  	}

  	componentDidUpdate() {

  			const h = 500;
			const w = 700;
			var margin = {top: 20, right: 40, bottom: 40, left: 20};

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var svg = d3.select(el).append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
     			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 			var x = d3.scaleBand()
				.rangeRound([0, w])
				.padding(0.5)
				.domain(this.props.counts.map(function(d) { return d.author.split(",")[0]; }));

		    var y = d3.scaleLinear()
		    	.rangeRound([h, 0])
				.domain([0, d3.max(this.props.counts, function(d) { return d.pages; })]);
	
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + h + ")")
				.call(d3.axisBottom(x));

		  	svg.append("g")
			   .attr("class", "axis")
			   .attr("transform", "translate(" + w + ",0)")
			   .call(d3.axisRight(y).ticks(5));

			var barChart = svg.selectAll("svg")
				.data(this.props.counts)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d){return x(d.author.split(",")[0])})
				.attr("y", function(d){return y(d.pages)})		
				.attr("width", x.bandwidth())
				.attr("height", function(d){return h - y(d.pages)})

  	}	

  	render() {

	    return (
	    	<div/>
	    );
  		
  	}

 }