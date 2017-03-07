import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Searcher from './Searcher.js';
import Scraper from './Scraper.js';


export default class RecEngine extends React.Component {

	constructor(props) {
	    super(props);
  	}

  	render() {

	    return (
			<div className="rec-container">
				<Scraper authority="staffpicks" title="Independent Bookstore"/>
				<Scraper authority="bestsellers" title="Bestseller List"/>
				<Searcher authors= {this.props.authors} title="Favorite Authors" mode='author'/>
				<Searcher genres={this.props.genres} themes= {this.props.themes} title="Based on Your Library" mode='similar'/>
				<Searcher genres={this.props.genres} themes= {this.props.themes} title="For a Change" mode='dissimilar'/>
			</div>
	    );
	}
}
