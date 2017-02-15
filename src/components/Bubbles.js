import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

export default class Bubbles extends React.Component {

	constructor(props) {
	    super(props);
  	}

  	componentDidUpdate() {

  		// count keywords
		var keywords = Array.from(this.props.keywords);

		if (keywords.length > 0) {

			var wordCount = {}

			keywords.forEach(word => {
				if (word in wordCount) {
					wordCount[word] += 1;
				} else {
					wordCount[word] = 1;
				}
			})

			// reformat to JSON parent/child list
			var wordList = []
			for (var key in wordCount) {
				var item = {"name": key, 
						"size": String(wordCount[key])};
				wordList.push(item);
			}

		  	var wordJSON = {"name": "keywords",
		    				"children" : wordList};

	  		const h = 500;
			const w = 500;
			const r = Math.max(h,w)/2;

			var color = d3.scaleOrdinal().range(["#311D3F", "#522546", "#88304E", "#E23E57"]);

			var el = ReactDOM.findDOMNode(this);
			d3.select(el).html("");

			var bubble = d3.pack()
				.size([r*2, r*2])
				.padding(1.5);

			var svg = d3.select(el).append("svg")
			    .attr("width", w)
			    .attr("height", h)
			    .append("g")


			var root = d3.hierarchy(wordJSON)
			    .sum(function(d) { return d.size; })
			    .sort(null);

			bubble(root);

			var node = svg.selectAll("node")
				.data(root.leaves())
				.enter()
				.append("g")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

			node.append("circle")
				.attr("r", function(d) { return d.r; })
				.style("fill", function (d) {return color(d.data.name)})

			var text = node.append("text")
				.attr("y", function(d){return `${d.data.name.split(' ').length/-2}em`})
				.style("text-anchor", "middle")
				.attr("class","chart_label")

			for (let i = 0; i <4 ; i++){
				text.append("tspan")    
					.text(function(d) { return d.data.name.split(' ')[i]; })
					.attr("dy", `1em`)
					.attr("x", `0`)
			}
		}
	}	

  	render() {

	    return (<div/>);
  		
  	}

 }