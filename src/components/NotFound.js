import React from 'react';
import { Link } from 'react-router';

export default class NotFound extends React.Component {
  render() {
    return (
      <div>
        <h1>404</h1>
        <h3>page not found</h3>
        <div>
          <Link to="/">back</Link>
        </div>
      </div>
    );
  }
}