const mongoose = require('mongoose')
const Promise = require('bluebird')
const app = require('./app.js')

mongoose.Promise = Promise.Promise;

function startDB(){
  return new Promise( (resolve, reject) => {
    mongoose.connect('mongodb://localhost/film-grab', (err, res) => {
      if (err) return reject()
      console.log("successfully connected to db");
      return resolve()
    })
  })
}

function startApp(){ 
  return new Promise( (resolve, reject) => {
    app.listen(9000, (err)=> {
      if (err) return reject(err)
      console.log("express app listening at port 9000");
      return resolve()
    })
  })
}

module.exports = function startServer(){
  return startDB().then( startApp )
}