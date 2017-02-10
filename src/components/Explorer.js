import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class Explorer extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      recommendation: ""
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

	  		var recommendation = rawData.title;

		    return new Promise(function(resolve, reject) {      

		        if (recommendation) {
		            resolve(recommendation);
		        }
		        else {
		            reject(Error("parsing failed"));
		        }
		    })
		};

	  	function library(){
		    // access bookstore
		    return $.ajax({
		            url: `/explore/store`,
		            dataType: 'json'         
			})
		};

  		
		library()
			.then(parseData)
			.then(result => this.setState({recommendation : result}));
	  	
  	}
	
  	render() {

	    return (
			<div>
				<h2>Recommendations</h2>
				<p>read: {this.state.recommendation}</p>
			</div>
	    );
	}
}

