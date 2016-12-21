const path = require('path')

const vision = require('@google-cloud/vision')({
  projectId: 'flim-sights',
  // Specify a path to a keyfile.
  keyFilename: path.join(__dirname, "../../", "flim-sights-87fdbb9ccd06.json")
});

var types = [
  'label',
];

function labelImage(url){
  console.log("url", url);
  if (typeof url === 'object'){
    url = url.url
  }
  return new Promise( function(resolve, reject){
    vision.detect(url, types, function(err, detection, apiResponses) {
      console.log("err", err);
      // console.log("detection", detection);
      console.log("apiResponses", apiResponses);
      if (err) return reject(err)
      let labels = []
      apiResponses.responses.forEach( response => {
        labels = labels.concat(response["labelAnnotations"])
      })
      return resolve(labels)
    });
  }).catch( err => {
    console.log("error in labelImage", err);
  })
}


module.exports = {
  labelImage: labelImage,
} 