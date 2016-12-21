import React from 'react';
import ReactDOM from 'react-dom';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Input from 'muicss/lib/react/input';

import SearchBar from './components/searchBar'
import FilmList from './components/filmList'

const styles = {
  searchBarContainer: {
    position: "absolute",
    left: "-15px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
}

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      filmsLoaded: false,
      films: [],
      selectedFilm: null
    }
    this.selectFilm = this.selectFilm.bind(this)
  }
  selectFilm(film){
    this.setState({selectedFilm: film})
  }
  componentDidMount(){
    // do request to server here
    fetch('http://localhost:9000/films/annotated')
      .then( response => {
        return response.json()
        // console.log("response", response.json());
      })
      .then( films => {
        this.setState({ filmsLoaded: true, films })
      })
      .catch( err => {
        console.log("err", err)
      })
  }
  render() {
    console.log("render", this.state);
    return (
      <div>
        <Appbar>
        </Appbar>
        <Container style={{height: "100vh", position: "relative"}}>
          <div style={styles.searchBarContainer}>
            <SearchBar filmsLoaded={this.state.filmsLoaded}/>
          </div>
          <FilmList style={styles.filmListContainer} selectFilm={this.selectFilm} films={this.state.films} filmsLoaded={this.state.filmsLoaded}  />
        </Container>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));