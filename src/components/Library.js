import React from 'react';
import { Link } from 'react-router';
import BookSelector from './BookSelector';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
    <div>
      <h1>Your Library</h1>
      <BookSelector userid={this.props.userid}/>
      </div>
    );
  }
}