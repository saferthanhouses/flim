import React from 'react'

const styles = {
  thumbStyles: {
    backgroundSize: 'cover',
    width: "90px",
    height: "60px"
  }
}

export default class FilmThumb extends React.Component {
  constructor(props){
    super(props)
    this.props = props
  }
  render(){
    let { images } = this.props.film
    let background = images[0]
    return (
      <div style={Object.assign({}, styles.thumbStyles, {backgroundImage: ""})}></div>
    )
  }
}