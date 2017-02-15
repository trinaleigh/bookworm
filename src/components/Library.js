import React from 'react';
import { Link } from 'react-router';
import BookSelector from './BookSelector';

export default class Library extends React.Component {
	
	constructor(props) {
		super(props);
	}

  	render() {

	    return (
			<BookSelector userid="001"/>
	    );
	}
}

