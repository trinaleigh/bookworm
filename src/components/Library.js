import React from 'react';
import { Link } from 'react-router';

export default class BookSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
	  this.setState({value: event.target.value.toUpperCase()});
	}

  handleSubmit(event) {
    alert('submitted' + this.state.value);
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

	      <h2>Titles: </h2>
	      <p>{this.state.value}</p>

      </div>
    );
  }
}

