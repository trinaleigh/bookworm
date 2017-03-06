import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {user: '001'};
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({user: event.target.value});
  }

  render() {
    return (
      <div className="app">
        <header>
          <h1>hello, bookworm!</h1>
          <div id="login">
            <form>
              <label>
                Reading List:
                <select value={this.state.value} onChange={this.handleChange}>
                  <option value="001">classics</option>
                  <option value="002">favorites</option>
                  <option value="003">2017</option>
                </select>
              </label>
            </form>
         </div>
        </header>
        <Navbar/>
        <div className="main-content">{React.cloneElement(this.props.children, { userid: this.state.user })}</div>
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