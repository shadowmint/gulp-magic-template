# gulp-section

This plugin breaks a file into parts by line.

A new file is output which is all the lines between (but no including)
the start and end patterns.

## Why?

For example, you can have a markdown file with a header of yaml and
parse both the yaml to json and the body to html.

## Install

```
$ npm install --save-dev shadowmint/gulp-section#0.0.1
```

## Usage

```
import gulp from 'gulp';
import section from 'gulp-section';

gulp.task('default', function() {
  return gulp.src('./src/**/*.txt')
    .pipe(section({
      start: /^--START--$/,
      end: /^--END--$/
    })
    .pipe(gulp.dest('./output'));
});
```

### start

The pattern to start the section with, or null for 'start of file'.

### end

The pattern to end the section with, or null for 'end of file'.

## License

MIT
