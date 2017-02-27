import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

class Recommendation extends React.Component {

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
	    this.handleUpdate = this.handleUpdate.bind(this);
  	}	

  	componentDidMount() {
  		this.refreshData();
  	}

  	handleUpdate() {
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
			<div className="rec">
				<h2>{this.props.title}</h2>
				<p>{this.state.recommendation}</p>
				<p>{this.state.author}</p>
				<p>{this.state.isbn}</p>
				<p>From <strong><a href={this.state.url} target="_blank">{this.state.source}</a></strong></p>
				<button onClick={this.handleUpdate}>
		    		Refresh
				</button>
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
					<Recommendation authority="staffpicks" title="Independent Bookstores"/>
					<Recommendation authority="bestsellers" title="Bestseller List"/>
				</div>
			</div>
	    );
	}
}

