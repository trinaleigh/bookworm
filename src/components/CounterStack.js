import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

export default class CounterStack extends React.Component {

	constructor(props) {
	    super(props);
  	}

  	componentDidUpdate() {

  			var libSize = Object.keys(this.props.counts).length;
  			var h = Math.min(500,libSize*75);
			const w = 300;
			var margin = {top: 20, right: 0, bottom: 40, left: 0};

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var svg = d3.select(el).append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
     			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 			var y = d3.scaleBand()
				.rangeRound([0, h])
				.padding(0)
				.domain(this.props.counts.map(function(d) { return d.author; }));

		    var x = d3.scaleLinear()
		    	.rangeRound([0, w])
				.domain([0, d3.max(this.props.counts, function(d) { return d.pages; })]);

			var barChart = svg.selectAll("svg")
				.data(this.props.counts)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("y", function(d){return y(d.author)})
				.attr("x", function(d){return (w - x(d.pages))/2})
				.attr("height", y.bandwidth)
				.attr("width", function(d){return x(d.pages)})

  	}	

  	render() {

	    return (
	    	<div/>
	    );
  		
  	}

 }