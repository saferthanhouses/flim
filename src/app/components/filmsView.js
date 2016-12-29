import React from 'react'

import SearchBar from './searchBar'
import FilmList from './filmList'


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

export default class FilmsView extends React.Component {
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
  render(){
    return (
      <div style={{position:"relative"}}>
        <div style={styles.searchBarContainer}>
          <SearchBar filmsLoaded={this.state.filmsLoaded}/>
        </div>
        <FilmList style={styles.filmListContainer} films={this.state.films} filmsLoaded={this.state.filmsLoaded}  />
      </div>
    )
  }
}