import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import LibraryData from './LibraryData';

export default class ISBNs extends React.Component {

	constructor(props) {
		super(props);

		this.removeItem = this.removeItem.bind(this);
	}

	removeItem(event) {

		function putList(userid, isbn){
		    // access user's isbns from mongodb
		    return $.ajax({
		            url: `/remove/${userid}/${isbn}`,
			})
		}; 

		putList(this.props.userid, event.target.id)

	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.isbns === this.props.isbns) {
			return false;
		} else {
			return true;
		}
	}

	render() {

	    return (
			<div>

				<div className="data_text">
					<h2>ISBNs</h2>
					{this.props.isbns.map(isbn => {
					  	return <p><span>{isbn}</span> <span id={isbn} onClick={this.removeItem}>X</span></p>
					  	}
				  	)}	
				</div>

			  <LibraryData isbns={this.props.isbns} />

			</div>
	    );
	}

}