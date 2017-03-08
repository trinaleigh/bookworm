import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Searcher from './Searcher.js';
import Scraper from './Scraper.js';


export default class RecDisplay extends React.Component {

	constructor(props) {
	    super(props);
  	}

  	render() {

	    return (
	    	<div>
	    	<h2>Based on Your Library</h2>
			<div className="rec-container">
				<Searcher authors= {this.props.authors} title="Favorite Authors" mode="author"/>
				<Searcher genres={this.props.genres} themes= {this.props.themes} title="Common Themes" mode="similar"/>
				<Searcher genres={this.props.genres} themes= {this.props.themes} title="For a Change" mode="dissimilar"/>
			</div>
			<h2>Community Suggestions</h2>
			<div className="rec-container">
				<Scraper authority="staffpicks" title="Independent Bookstores"/>
				<Scraper authority="bestsellers" title="Bestsellers"/>
				<Scraper authority="awards" title="Award Winners"/>
			</div>
			</div>
	    );
	}
}
