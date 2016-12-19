const mongoose = require('mongoose')

const FilmSchema = new mongoose.Schema({
  title: String,
  url: String,
  images: [mongoose.Schema.Types.Mixed],
  annotated: {
    type: Boolean,
    default: false
  }
})


const FilmModel = mongoose.model('Film', FilmSchema);

module.exports = {
  FilmModel
}
