import React from 'react';
import { Link } from 'react-router';
import BookSelector from './BookSelector';

export default class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '001'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
    <div>
      <h2>Your Library</h2>
      <form>
        <label>
          Select user ID:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="001">001</option>
            <option value="002">002</option>
            <option value="003">003</option>
          </select>
        </label>
      </form>
      <BookSelector userid={this.state.value}/>
      </div>
    );
  }
}