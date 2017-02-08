import React from 'react';
import { Link } from 'react-router';

export default class Bubbles extends React.Component {

	constructor(props) {
	    super(props);
  	}	

  	render() {

	// count keywords
	var keywords = Array.from(this.props.keywords);
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

  	var wordJSON = {"name": "flavors",
    				"children" : wordList};

    console.log(wordJSON);

    return (
    	<div>hi</div>
    	)

  		
  	}

 }