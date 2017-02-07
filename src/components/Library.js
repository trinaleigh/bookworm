import React from 'react';
import { Link } from 'react-router';

export default class BookSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: '', shelf: ["9780486415918 ","9781476738024"]};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		// allow digits only for ISBN input
		this.setState({value: event.target.value.replace(/\D/g,'')});
	}

  handleSubmit(event) {
  	// upon submission, add book to the list
  	this.setState({value: '', shelf : this.state.shelf.concat([this.state.value])})
  	event.preventDefault();
  }

  render() {

    return (
		<div>
		  <form onSubmit={this.handleSubmit}>
		    <label>
		      ISBN: 
		      <input type="text" name="isbn" placeholder="9780486415918" 
		      	value={this.state.value} onChange={this.handleChange} required/>
		    </label>
		    <input type="submit" value="Submit" />
		  </form>

		  <h2>Bookshelf: </h2>
		  {this.state.shelf.map( book => {
		  	return <p>{book}</p> 
		  	}
		  )}
		</div>
    );
  }
}

