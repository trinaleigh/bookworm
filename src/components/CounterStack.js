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
  			var w = Math.min(800,libSize*100);
			const h = 400;
			var margin = {top: 20, right: 0, bottom: 20, left: 40};

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var svg = d3.select(el).append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
     			.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    var x = d3.scaleLinear()
		    	.rangeRound([0, w])
				.domain([0, this.props.total]);

			var color = d3.scaleOrdinal().range(["#311D3F", "#522546", "#88304E", "#E23E57"]);

			var stackWidth = 0;

			var barChart = svg.selectAll("g")
				.data(this.props.counts)
				.enter()
				.append("g")
				.attr("transform", function(d) { 
					stackWidth += x(d.pages); return "translate(" + (stackWidth - x(d.pages)) + "," + 0 + ")"; })

			var book = barChart.append("rect")
				.attr("class", "bar")
				.attr("width", function(d){return x(d.pages)})
				.attr("height", h)
				.style("fill", function(d) {return color(d.author)});

			var text = barChart.append("text")
				.attr("class","spine")
				.style("text-anchor", "middle")
				.text(function(d) {
					return (d.pages != 0 ? d.author.split(",")[0] : "")}) // only add label if there is a page count
				.attr("x", function(d){return x(d.pages)/2})
				.attr("y", h/2);

  	}	

  	render() {

	    return (
	    	<div/>
	    );
  		
  	}

 }