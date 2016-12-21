const cheerio = require('cheerio')
const request = require('request')
const promisifyAll = require('bluebird').promisifyAll
const mongoose = promisifyAll(require('mongoose'));
const labelImage = require('./labelImages').labelImage
// const testTypes = require('./labelImages').testTypes
const FilmModel = require('../models').FilmModel
Promise = require('bluebird')

let goal = 300

/* connect to db */

mongoose.connect('mongodb://localhost/film-grab');

// const FilmModel = mongoose.model('Film', FilmSchema);

/* scrape movies */

function getMovies(number){
  console.log("number", number);
  // 20 movies per page, how many pages do we need to get?
  let pagePromises = []
  let pages = Math.ceil(number / 20)
  for (let i=1; i < pages + 1; i++ ){
    pagePromises.push(getMoviePage(i))
  }
  return Promise.all(pagePromises)
  .then( moviesArr => {
    return moviesArr.reduce( (accum, next) => {
      return accum.concat(next)
    }, [])
  })
}

function getMoviePage(page){
  let movies = []
  console.log("getting movies for page", page);
  return new Promise( (resolve, reject) => {
    request(`https://film-grab.com/page/${page}`, (err, res, body)=> {
      if (err) reject(err)
      if (!err && res.statusCode === 200) {
        let $ = cheerio.load(body)
        let articleLinks = Array.from($('article > a'))
        articleLinks.forEach( movie => {
          movies.push({
            url: movie.attribs.href,
            title: movie.attribs.title.split(' ').slice(2).join(' ')
          })
        })
        // console.log(movies)
        resolve(movies.slice())
      }
    })
  })
}

function getAllImages(movies){
  return Promise.all(
    movies.map( movie => getMovieImages(movie))
  )
}

function getMovieImages(movie){
  console.log(`getting images for ${movie.title}`);
  let images = []
  return new Promise( (resolve, reject) => {
    request(movie.url, (err, res, body)=> {
      if (err) reject(err)
      if (!err && res.statusCode === 200) {
        let $ = cheerio .load(body)
        let imageLinks = Array.from($('.gallery-item a img'))
        imageLinks.forEach( img => {
          let src = img.attribs.src
          let url = src.split('?')[0]
          images.push(url)
        })
        movie.images = images.slice()
        resolve(movie)
      }
    })
  })
}

function reseedMovies(){
  return FilmModel.remove({})
    .then( getMovies.bind(null, goal) )
    .then( getAllImages )
    .then( movies => {
      console.log("movies length", movies.length);
      return Promise.all(movies.map( movie => {
        // return FilmModel.create(movie)
      }))
    })
    .then( (movies) => {
      console.log(`${movies.length} movies successfully seeded`);
    })
}

/* End scrape movies */

function annotateMovies(){
  return FilmModel.find({annotated: {$exists: false}}).limit(2)
    .then( movies => {
      console.log(`annotating ${movies.length} movies`)
      return Promise.each(movies, getLabelsAndUpdate)
    })
    .then( _ => {
      console.log("successfully updated movies");
    })
    .catch( err => {
      console.log("error in annotateMovies", err);
    })
}

/* Label Movie Images */

function makeAllLabels(){

}

function getLabelsAndUpdate(movie){
  return Promise.all(movie.images.map( labelImage ))
  .then( labelsArr =>{
    console.log(`got data for ${movie.title}`);
    labelsArr.forEach( (imageLabels, idx) => {
      let url = movie.images[idx]
      let imageObj = {
        url: url,
        labels: imageLabels
      }
      movie.images[idx] = imageObj
    })                            
    movie.annotated = true                                                                                                                                                                                                  
    return FilmModel.findByIdAndUpdate(movie._id, movie)
  })
  .catch( err => {
    console.log("error in getLabelsandUpdate", err);
  })
}

function testMakeLabels(){
  return FilmModel.findOne({annotated: {$exists: false}})
  .then( movie => {
    return getLabelsAndUpdate(movie)
  })
  .then( () => {
    // let totals = cumulativeLabelsForFilm(movieTop)
    // console.log("totals", totals)
    // console.log("keys", Object.keys(movieLabels))
    console.log("movie updated")
    process.exit(0)
  })
  .catch( err => {
    console.log(err)
    process.exit(0)
  })
}

function cumulativeLabelsForFilm(movie){
  let movieLabels = {}
  movie.images.forEach( image => {
    movieLabels = image.labels.reduce( (labelsColl, next) => {
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

// testMakeLabels()
// annotateMovies()
//   .then( () => {
//     process.exit(0)
//   })
/* End label movies images */

annotateMovies()
  .then( () => {
    process.exit(0)
  })
// for the test data - use annotate 50 movies
