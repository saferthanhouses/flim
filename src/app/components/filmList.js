import React from 'react'
import LoadingBar from './loadingBar'
import FilmThumb from './filmThumb'

const styles = {
  filmListContainer: {
    marginTop: "70px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  }
}

export default class FilmList extends React.Component {
  constructor(props){
    super(props)
    this.props = props
  }
  render(){
    console.log("render", this.props);
    let content
    if (!this.props.filmsLoaded) {
      content = <LoadingBar/>
    } else {
      content = this.props.films.map( (film, idx) => <FilmThumb key={idx} film={film}/> )
    }
    return (
      <div style={styles.filmListContainer}>
        { content }
      </div>
    )
  }
}