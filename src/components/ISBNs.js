import React from 'react';
import { Link } from 'react-router';
import LibraryData from './LibraryData';

export default class ISBNs extends React.Component {

	constructor(props) {
		super(props);
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
					  	return <p>{isbn}</p> 
					  	}
				  	)}	
				</div>

			  <LibraryData isbns={this.props.isbns} />

			</div>
	    );
	}

}