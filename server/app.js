const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const promisifyAll = require('bluebird').promisifyAll
const Films = require('./models').FilmModel
const morgan = require('morgan')

mongoose.Promise = require('bluebird').Promise
const app = express()

app.use(morgan('dev'))

app.get('/api/films/annotated', getAnnotatedFilms)

app.get('/api/films', getFilms)
app.get('/api/films/:id/labels', getFilmLabels)
app.get('/api/films/:id', getFilm)

app.use('/lib', express.static('lib'))
app.use(express.static('build'))

app.get('*', function(req,res, next){
  res.sendFile(path.join(__dirname,'../build/index.html'))
})

app.use(handleError)

function getFilms(req, res, next){
  Films.find({}).limit(50)
    .then( films => {
      res.status(200).json(films)
    })
    .catch( next )
}

function getFilm(req, res, next){
  Films.findById(req.params.id)
    .then( film => {
      let allLabels = cumulativeLabelsForFilm(film)
      console.log("allLabels", allLabels);
      film.allLabels = allLabels
      // console.log("film", film);
      res.status(200).json({film, labels: allLabels})      
    })
    .catch( next )
}

function getFilmLabels(req, res, next){
  Films.findById(req.params.id)
    .then( film => {
      res.status(200).json(film)      
    })
    .catch( next )
}

function getAnnotatedFilms(req,res,next){
  Films.find({annotated: true})
    .then( films => {
      res.status(200).json(films)
    })
    .catch( next )
}

function handleError(err, req, res, next){
  console.log("error!", err);
  res.status(500).send(err.message)
}

/* Utils */

function cumulativeLabelsForFilm(movie){
  let movieLabels = {}
  movie.images.forEach( image => {
    console.log(image);
    movieLabels = image.labels.reduce( (labelsColl, next) => {
      console.log("next", next);
      if (!next){
        return labelsColl
      }
      if (labelsColl[next.description]){
        labelsColl[next.description].push(next)
      } else {
        labelsColl[next.description] = [next]
      }
      return labelsColl
    }, movieLabels)
  })
  return movieLabels
}


module.exports = app;