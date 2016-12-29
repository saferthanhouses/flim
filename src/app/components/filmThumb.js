import React from 'react'
import { browserHistory } from 'react-router'

const height = 90
const width = 150

const styles = {
  thumbStyles: {
    width: `${width}px`,
    height: `${height}px`,
  }
}

export default class FilmThumb extends React.Component {
  constructor(props){
    super(props)
    this.props = props
    this.goToFilm = this.goToFilm.bind(this)
  }
  goToFilm(film){
    browserHistory.push(`/films/${film._id}`)
  }
  render(){
    let { film } = this.props
    let { images, title } = film
    let { url } = images[0]

    let background = `${url}?width=${width}&height=${height}`
    return (
      <div className="film-thumb" style={Object.assign({},  ...styles.thumbStyles, {backgroundImage: `url(${background})`})}>
        <div className="film-thumb-mask" onClick={() => this.goToFilm(film)}></div>
        <div className="film-thumb-content">
          <p>{ title }</p>
        </div>
      </div>
    )
  }
}