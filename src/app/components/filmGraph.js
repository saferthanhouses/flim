import React from 'react'
import rd3 from 'react-d3';
const Treemap = rd3.Treemap;

// import { select, selectAll } from 'd3-selection'
// // import { scaleLinear, scaleOrdinal } from 'd3-scale'

// // // console.log("d3", d3);

// // const width = 500
// // const height = 500

export default class FilmGraph extends React.Component {
  constructor(props){
    super(props)
    let { labels } = props
    this.data = this.formatData(labels)    
  }
  formatData(labels){

    function scaleLabels(accum, next){
      return accum += next.score
    }

    return Object.keys(labels).map( elt => {
      return { label: elt, value: labels[elt].reduce(scaleLabels, 0)}
    })
  }
  // componentDidMount(){
// //     // console.log("graphContainer", graphContainer);
// //     let graphContainer = select("#graph-container")
// //       .append("svg")
// //       .attr("width", "500px")
// //       .attr("height", "500px")
// //       .append("g")
// //     let x = scaleOrdinal(Object.keys(this.props.labels)).range([0, width])
// //     console.log("scaleLabels", scaleLabels(0));
// //     let y = d3.scaleLinear().range([height, 0])
// //     // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// //   }
  render(){
    let { innerWidth, innerHeight } = window, w, h;
    if (innerWidth <= 450){
      className = "graph-mobile"
      w = innerWidth
      h = innerHeight
    } else {
      className = "graph-desktop"
      w = 700
      h = 500
    }
    return (
      <div id="graph-container" className={className}>
        <Treemap 
          data={this.data}
          width={w}
          height={h}
          textColor="#484848"
          fontSize="14px"
          title="Treemap"
          hoverAnimation={true}
        />
      </div>
    )
  }
}