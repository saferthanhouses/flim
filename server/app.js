const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const promisifyAll = require('bluebird').promisifyAll
const Films = require('./models').FilmModel
const morgan = require('morgan')

mongoose.Promise = require('bluebird').Promise
const app = express()

app.use(morgan('dev'))

app.get('/films', getFilms)
app.get('/films/:id', getFilm)

app.use('/lib', express.static('lib'))
app.use(express.static('build'))

app.get('*', function(req,res, next){
  res.sendFile(path.join(__dirname,'../build/index.html'))
})

app.use(handleError)

function getFilms(req, res, next){
  Films.find({})
    .then( films => {
      res.status(200).json(films)
    })
    .catch( next )
}

function getFilm(req, res, next){
  console.log("req.params.id", req.params.id);
  Films.findById(req.params.id)
    .then( film => {
      res.status(200).json(film)      
    })
    .catch( next )
}

function handleError(err, req, res, next){
  console.log("error!", err);
  res.status(500).send(err.message)
}

module.exports = app;