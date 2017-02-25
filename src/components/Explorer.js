import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class Explorer extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      recommendation: "",
	      author: "",
	      isbn: "",
	      url: ""
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

	  	function library(){
		    // access bookstore
		    return $.ajax({
		            url: `/staffpicks`,
		            dataType: 'json'         
			})
		};
  		
		library()
			.then(result => this.setState({recommendation : result.title, 
											author: result.author, 
											isbn: result.isbn, 
											url: result.url, 
											store: result.store}));
  	}
	
  	render() {

	    return (
			<div>
				<h1>Recommended</h1>
				<p>{this.state.recommendation}</p>
				<p>{this.state.author}</p>
				<p>{this.state.isbn}</p>
				<p>From <strong><a href={this.state.url} target="_blank">{this.state.store}</a></strong></p>
				<button onClick={this.handleUpdate}>
		    		Refresh
				</button>
			</div>
	    );
	}
}

