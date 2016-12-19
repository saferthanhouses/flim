import React from 'react';
import Input from 'muicss/lib/react/input';

export default class SearchBar extends React.Component {
  constructor(){
    super()
    this.onChangeHandler = this.onChangeHandler.bind(this)
  }
  onChangeHandler(evt){
    console.log("onChangeHandler evt", evt.target.value)
  }
  render(){
    return (
      <Input style={{maxWidth: "500px", background: "#fafafa", width: "80%"}} hint="stormy city films" onChange={this.onChangeHandler}/>
    )
  }
}