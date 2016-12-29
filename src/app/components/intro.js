import React from 'react'


const slideTime = 1;

const styles = {
  intro: {
    transition: `${slideTime}s width`
  }
}

export default class Intro extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isOpening: false,
      open: props.open
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }
  toggleDrawer(){
    let { innerWidth } = window;
    if (innerWidth < 450){
      return
    } else {
      this.setState({open: !this.state.open})
      setTimeout(()=>{
        this.setState({isOpening: false})
      }, 900)
    }
  }
  render(){
    let { open, isOpening } = this.state, val;
    if (open && !isOpening || !open && isOpening){
      val = (
          <div>
            <h3>Google Vision Film Recommender</h3>
            <p>What is this thing?</p> 
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non nibh rutrum, fringilla nibh semper, porttitor lectus. Donec bibendum massa in mattis tempus.</p>
          </div>
      )
    } else if (!open && !isOpening || open && isOpening){
      val = (
        <h2 style={{color: "white"}}>?</h2>
      )
    }
    return (
      <div id="intro" onClick={this.toggleDrawer} className={open ? "intro-open" : "intro-closed" } style={styles.intro}>
        <div id="intro-container">
          { val }
        </div>
      </div>
    )
  }
}