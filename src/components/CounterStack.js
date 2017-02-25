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
			var margin = {top: 10, right: 0, bottom: 40, left: 0};

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var svg = d3.select(el).append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
     			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    var y = d3.scaleLinear()
		    	.rangeRound([0, h])
				.domain([0, this.props.total]);

			var color = d3.scaleOrdinal().range(["#311D3F", "#522546", "#88304E", "#E23E57"]);

			var stackHeight = 0;

			var barChart = svg.selectAll("g")
				.data(this.props.counts)
				.enter()
				.append("g")
				.attr("transform", function(d) { stackHeight += y(d.pages); return "translate(" + 0 + "," + (stackHeight - y(d.pages)) + ")"; })

			var book = barChart.append("rect")
				.attr("class", "bar")
				// .attr("y", function(d){stackHeight += y(d.pages); return stackHeight - y(d.pages)})
				.attr("height", function(d){return y(d.pages)})
				.attr("width", w)
				.style("fill", function(d) {return color(d.author)});

			var text = barChart.append("text")
				.attr("class","spine")
				.style("text-anchor", "middle")
				.text(function(d) {return d.author.split(",")[0]})
				.attr("y", function(d){return y(d.pages)/2})
				.attr("x", w/2);

  	}	

  	render() {

	    return (
	    	<div/>
	    );
  		
  	}

 }