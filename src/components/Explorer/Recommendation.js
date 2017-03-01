import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';


export default class Recommendation extends React.Component {

	constructor(props) {
	    super(props);

  	}	
	
  	render() {

	    return (
			<div className="rec">
				<h2>{this.props.title}</h2>
				<p>{this.props.book.recommendation}</p>
				<p>{this.props.book.author}</p>
				<p>{this.props.book.isbn}</p>
				<p>From <strong><a href={this.props.book.url} target="_blank">{this.props.book.source}</a></strong></p>
			</div>
	    );
	}
}