import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Scraper from './Scraper.js';
import Searcher from './Searcher.js';


class Recommendation extends React.Component {

	constructor(props) {
	    super(props);

  	}	
	
  	render() {

	    return (
			<div className="rec">
				<h2>{this.props.title}</h2>
				<p>{this.props.recommendation}</p>
				<p>{this.props.author}</p>
				<p>{this.props.isbn}</p>
				<p>From <strong><a href={this.props.url} target="_blank">{this.props.source}</a></strong></p>
			</div>
	    );
	}
}


export default class Explorer extends React.Component {

	constructor(props) {
	    super(props);
  	}	
	
  	render() {

	    return (
			<div>
				<h1>Recommended</h1>
				<div className="rec-container">
					<Scraper authority="staffpicks" title="Independent Bookstore"/>
					<Scraper authority="bestsellers" title="Bestseller List"/>
					<Searcher genre="Fiction" topic="Animals" title="Based on History"/>
					<Searcher genre="Nonfiction" topic="Mystery" title="Mix it Up"/>
				</div>
			</div>
	    );
	}
}

