import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import nodeunit from 'gulp-nodeunit';

gulp.task('default', ['tests']);

gulp.task('tests', ['build'], function(callback) {
  return gulp.src('./build/**/*.tests.js')
    .pipe(plumber())
    .pipe(nodeunit());
});

gulp.task('build', function(callback) {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(gulp.dest('./build'));
});
