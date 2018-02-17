const glob = require('glob');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const responsive = require('gulp-responsive');

let images = false;

module.exports = () => {
  glob('./src/images/**/*.jpg', (er, files) => {
    if (files.length > 0) images = true;

    return gulp.src('./src/images/**/*.jpg')
      .pipe(gulpif(images, responsive({
        '*': [{
          width: 1200,
        }],
      }, {
        quality: 70,
        progressive: true,
        withMetadata: false,
        withoutEnlargement: true,
        errorOnEnlargement: false,
      })))
      .pipe(gulp.dest('./dist/images'));
  });
  glob('./src/images/**/*.png', (er, files) => {
    if (files.length > 0) images = true;

    return gulp.src('./src/images/**/*.png')
      .pipe(gulp.dest('./dist/images'));
  });
}
