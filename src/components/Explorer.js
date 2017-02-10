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
  		this.setState({bookshelf: []});
  		this.refreshData();
  	}

  	refreshData() {

	  	function parseData(rawData){ 

	  		var data = rawData;

		    return new Promise(function(resolve, reject) {      

		        if (data) {
		            resolve(data);
		        }
		        else {
		            reject(Error("parsing failed"));
		        }
		    })
		};

	  	function library(){
		    // access bookstore
		    return $.ajax({
		            url: `/staffpicks`,
		            dataType: 'json'         
			})
		};

  		
		library()
			.then(parseData)
			.then(result => this.setState({recommendation : result.title, author: result.author, isbn: result.isbn, url: result.url}));
	  	
  	}
	
  	render() {

	    return (
			<div>
				<h2>Recommended</h2>
				<p>{this.state.recommendation}</p>
				<p>{this.state.author}</p>
				<p>{this.state.isbn}</p>
				<p>from <a href={this.state.url}>employee picks</a></p>
			</div>
	    );
	}
}

