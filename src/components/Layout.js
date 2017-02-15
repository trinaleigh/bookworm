import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app">
        <header>
          <h1>hello, bookworm!</h1>
        </header>
        <Navbar/>
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

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {page: 'Home'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.setState({page: event.target.innerHTML});
  }

  render() {
    return (
      <div className = "navbar">
          <Link to="/">
          <p onClick={this.handleChange} className={this.state.page == "Home" ? "active" : "inactive"}>Home</p>
          </Link>
          <Link to={`/library`}>
          <p onClick={this.handleChange} className={this.state.page == "Library" ? "active" : "inactive"}>Library</p>
          </Link>
          <Link to={`/explorer`}>
          <p onClick={this.handleChange} className={this.state.page == "Explorer" ? "active" : "inactive"}>Explorer</p>
          </Link>
      </div>
    )
  }
}