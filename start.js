// Rollup plugins.
const buble =require('rollup-plugin-buble')
const cjs =require('rollup-plugin-commonjs')
const globals =require('rollup-plugin-node-globals')
const replace =require('rollup-plugin-replace')
const resolve =require('rollup-plugin-node-resolve')
const rollup = require('rollup')
const chalk = require('chalk')
const bluebird = require('bluebird')
const ncp = bluebird.promisify(require('ncp').ncp);
const cp = bluebird.promisify(require('cp'));
const mkdirp = bluebird.promisify(require('mkdirp'));
const rimraf = bluebird.promisify(require('rimraf'));
const fs = bluebird.promisifyAll(require('fs'));
const watch = require('node-watch')
const startServer = require('./server')

function timeNow(){
  let time = new Date()
  return `${time.getHours()}:${time.getMinutes()}`
}


function bundleJS() {
  return rollup.rollup({
    // dest: 'build/app.js',
    entry: 'src/app/app.js',
    format: 'iife',
    plugins: [
      buble(),
      cjs({
        exclude: [
        'node_modules/process-es6/**',
        ],
        include: [
          'node_modules/react/**',
          'node_modules/react-dom/**',
          'node_modules/fbjs/**',
          'node_modules/muicss/**',
          'node_modules/object-assign/**',
          'lib/react/**',
          'lib/react-dom/**'
        ]
      }),
      globals(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      resolve({
        browser: true,
        main: true
      })
    ],
    sourceMap: true
  })
  .then( function ( bundle ) {
    // console.log(bundle);
    // Generate bundle + sourcemap
    return bundle.write({
      format: 'iife',
      dest: './build/bundle.js'
    });
  })
  .then( ()=> {
    console.log(chalk.blue("bundled", timeNow()));
  })
  .catch( err => {
    console.log(chalk.red('error in build'))
    console.log(err)
  })
}

function cleanDir(){
  console.log(chalk.green("cleaning..."));
  return rimraf('./build')
    .then( () => mkdirp('./build'))
}


function buildCss(){
  console.log(chalk.green("building css"));
  let readPromises = [
    fs.readFileAsync('./src/reset.css', 'utf-8'), 
    fs.readFileAsync('./src/style.css', 'utf-8'),
    fs.readFileAsync('./src/mui.min.css', 'utf-8'),
  ] 
  return Promise.all(readPromises)
    .then(styleFiles =>{
      return fs.writeFileAsync('./build/styles.css', styleFiles.join('\n'), 'utf-8')
    })
}

function buildHTML(){
  console.log(chalk.green("building html"));
  return cp('./src/index.html', './build/index.html')
}



function startDevBuild(){
  return cleanDir()
    .then( ()=> {
      return Promise.all([buildHTML(), buildCss(), bundleJS()])
    })
    .then( () => {
      // why does node-watch not work for single files but fs.watch does?
      fs.watch('./src/index.html', function(){
        return buildHTML()
      })
      watch('src/app/', {recursive: true}, () =>{
        return Promise.all([buildHTML(), bundleJS()])
      })
      fs.watch('./src/style.css', {recursive: true}, () => {
        return Promise.all([buildHTML(), buildCss()])
      })
    })
}

startDevBuild()
.then( startServer )