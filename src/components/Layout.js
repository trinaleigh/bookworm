import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app">
        <header>
          <Link to="/">
          <h1>hello, bookworm!</h1>
          </Link>
        </header>
        <div className="main-content">{this.props.children}</div>
        <footer>
          <p>
            (footer here)
          </p>
        </footer>
      </div>
    );
  }
}