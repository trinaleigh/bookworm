import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Recommendation from './Recommendation.js';


export default class Scraper extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      recommendation: "",
	      author: "",
	      isbn: "",
	      url: "",
	      source: ""
	    };

	    this.refreshData = this.refreshData.bind(this);
  	}	

  	componentDidMount() {
  		this.refreshData();
  	}

  	refreshData() {

	  	function library(authority){
		    // access recommendation resource
		    return $.ajax({
		            url: `/${authority}`,
		            dataType: 'json'         
			})
		};
  		
		library(this.props.authority)
			.then(result => this.setState({recommendation : result.title, 
											author: result.author, 
											isbn: result.isbn, 
											url: result.url, 
											source: result.source}));
  	}
	
  	render() {

	    return (
			<Recommendation book={this.state} title={this.props.title}/>	
	    );
	}
}
