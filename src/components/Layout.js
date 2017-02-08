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
      <div className = "navbar">
          <Link to={`/`}>
          <p>Library</p>
          </Link>
          <Link to={`/explorer`}>
          <p>Explorer</p>
          </Link>
      </div>
        <div className="main-content">{this.props.children}</div>
        <footer>
          <p>
            ...the end
          </p>
        </footer>
      </div>
    );
  }
}