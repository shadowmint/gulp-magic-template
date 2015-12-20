import gulp from 'gulp';
import markdown from 'gulp-markdown';
import toml from 'gulp-toml';
import section from '..';

gulp.task('json', function() {
  return gulp.src('./src/**/*.md')
    .pipe(section({ end: /^--$/ }))
    .pipe(toml())
    .pipe(gulp.dest("./build"));
});

gulp.task('html', function() {
  return gulp.src('./src/**/*.md')
    .pipe(section({ start: /^--$/ }))
    .pipe(markdown())
    .pipe(gulp.dest("./build"));
});

gulp.task('default', ['json', 'html']);
