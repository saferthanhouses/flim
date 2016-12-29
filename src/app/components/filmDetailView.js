import React from 'react'

import FilmGraph from './filmGraph'

export default class FilmView extends React.Component {
  constructor(props){
    super(props)
    this.props = props
    this.state = {}
  }
  componentDidMount(){
    let { filmId } = this.props.params
    // console.log(this.props.params.filmId)
    fetch(`http://localhost:9000/api/films/${filmId}`)
      .then( response => response.json() )
      .then( data => {
        console.log("data", data);
        let { film, labels } = data;
        // console.log("film", film)
        this.setState({ film, labels })
      })
      .catch( err => {
        console.log("err", err)
      })
  }
  render(){
    if (!this.state.film){
      return <div>Loading</div>
    } else {
      let { labels, film } = this.state
      let { title, images } = film
      return (
        <div id="film-detail">
          <h3>{ title}</h3>
          <FilmGraph labels={labels} />
        </div>
      )
    }
  }
}