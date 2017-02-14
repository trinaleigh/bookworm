import React from 'react';
import { Link } from 'react-router';
import LibraryData from './LibraryData';
import ISBNs from './ISBNs';

export default class BookSelector extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {value: '', isbns: ["9781476738024","9780486415918", "9780425274866"]};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		// allow digits only for ISBN input
		this.setState({value: event.target.value.replace(/\D/g,'')});
	}

	handleSubmit(event) {
		// upon submission, add book to the list
		this.setState({value: '', isbns : this.state.isbns.concat([this.state.value])})
		event.preventDefault();
	}

  	render() {

	    return (
			<div>

				<form onSubmit={this.handleSubmit}>
					<label>
					  <h2>Add ISBN: </h2> 
					  <input type="text" name="isbn" placeholder="9780486415918" 
					  	value={this.state.value} onChange={this.handleChange} required/>
					</label>
					<input type="submit" value="Submit" />
				</form>

			  <ISBNs isbns={this.state.isbns}/>

			</div>
	    );
	}
}

