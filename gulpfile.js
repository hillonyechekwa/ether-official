const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const postCss = require('gulp-postcss');
const Eleventy = require('@11ty/eleventy');
const log = require('fancy-log');
const browserSync = require('browser-sync').create()


function sassTask() {
  return src('./src/scss/*.scss', {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(postCss([autoprefixer(), cssnano()]))
    .pipe(dest('dist/css', {sourcemaps: '.'}));
};

function jsTask() {
  return src('./src/scripts/*.js', {sourcemaps: true})
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(terser())
    .pipe(dest('dist/scripts', {sourcemaps: '.'}));
};

async function eleventyServe(cb){
  const eleventy = new Eleventy();
  
  try{
    await eleventy.init()
    await eleventy.watch()
    cb()//signal task completion
  }catch(err){
    log.error('Error running eleventy', err)
    cb(err);
  }
  
  // eleventy.init()
  //   .then(() => eleventy.watch())
  //   .then(() => cb())
  //   .catch((err) => {
  //     log.error(`Error running eleventy`, err);
  //     cb(err);
  //   })
}

function serveSite(cb){
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    open: false
  })
  
  cb()
}

function reloadBrowser(){
  browserSync.reload()
}

function watchTask() {
  watch('./dist/**/*').on('change', reloadBrowser)
  watch('./src/**/*', series(eleventyServe, reloadBrowser))
  watch(['./src/scss/*.scss', './src/scripts/*.js'], series(sassTask, jsTask));
};

exports.default = series(sassTask, jsTask, eleventyServe, parallel(serveSite, watchTask));
