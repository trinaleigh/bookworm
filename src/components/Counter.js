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
			var margin = {top: 20, right: 40, bottom: 40, left: 100};

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var svg = d3.select(el).append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
     			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 			var y = d3.scaleBand()
				.rangeRound([0, h])
				.padding(0.5)
				.domain(this.props.counts.map(function(d) { return d.author.split(",")[0]; }));

		    var x = d3.scaleLinear()
		    	.rangeRound([0, w])
				.domain([0, d3.max(this.props.counts, function(d) { return d.pages; })]);
	
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + h + ")")
				.call(d3.axisBottom(x).ticks(5));

		  	svg.append("g")
			   .attr("class", "axis")
			   .call(d3.axisLeft(y));

			var barChart = svg.selectAll("svg")
				.data(this.props.counts)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("y", function(d){return y(d.author.split(",")[0])})
				.attr("height", y.bandwidth())
				.attr("width", function(d){return x(d.pages)})

  	}	

  	render() {

	    return (
	    	<div/>
	    );
  		
  	}

 }