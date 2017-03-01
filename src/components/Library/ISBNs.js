import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
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

			  <LibraryData isbns={this.props.isbns} userid={this.props.userid} handler={this.props.handler} />

			</div>
	    );
	}

}