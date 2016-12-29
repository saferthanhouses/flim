import React from 'react';
import ReactDOM from 'react-dom';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Input from 'muicss/lib/react/input';

import Intro from './components/intro.js'
import FilmsView from './components/filmsView'
import FilmDetailView from './components/filmDetailView'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      filmsLoaded: false,
      films: [],
      selectedFilm: null
    }
  }
  componentDidMount(){
    // do request to server here
    fetch('http://localhost:9000/api/films/annotated')
      .then( response => response.json())
      .then( films => {
        this.setState({ filmsLoaded: true, films })
      })
      .catch( err => {
        console.log("err", err)
      })
  }
  render() {
    return (
      <div id="app-container">
        <Intro open={true}></Intro>
        <div id="film-list" style={{}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}




ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App} redirectTo="films">
      <IndexRoute component={FilmsView}/>
      <Route path="films/:filmId" component={FilmDetailView}/>
      <Route path="films" component={FilmsView}/>
      <Route path="*" component={FilmsView}/>
    </Route>
  </Router>
), document.getElementById('container'));
