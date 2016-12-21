import React from 'react'

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
  }
  render(){
    let { film, selectFilmHandler } = this.props
    let { images, title } = film
    let { url } = images[0]
    
    let background = `${url}?width=${width}&height=${height}`
    return (
      <div className="film-thumb" onClick={()=>selectFilmHandler(film)} style={Object.assign({},  ...styles.thumbStyles, {backgroundImage: `url(${background})`})}>
        <div className="film-thumb-mask"></div>
        <div className="film-thumb-content">
          <p>{ title }</p>
        </div>
      </div>
    )
  }
}