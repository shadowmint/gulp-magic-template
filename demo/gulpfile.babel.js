import gulp from 'gulp';
import markdown from 'gulp-markdown';
import toml from 'gulp-toml';
import section from 'gulp-section';
import magic from 'gulp-magic-template';
import rename from 'gulp-rename';
import handlebars from 'handlebars';
import hitl from 'handlebars-intl';
import run from 'run-sequence';
import jade from 'gulp-jade';
import sass from 'gulp-sass-native';

// Setup handlebars to be a bit less shit
hitl.registerWith(handlebars);

// Split top part of file into external json
gulp.task('json', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(section({
      start: /^--META--$/,
      end: /^--CONTENT--$/
    }))
    .pipe(toml())
    .pipe(gulp.dest("./tmp"));
});

// Split middle of file into external html
gulp.task('html', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(section({
      start: /^--CONTENT--$/,
      end: /^--TEMPLATE--$/
    }))
    .pipe(markdown({
      sanitize: false
    }))
    .pipe(gulp.dest("./tmp"));
});

// Split bottom out into it's own jade file
gulp.task('jadesrc', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(section({
      start: /^--TEMPLATE--$/
    }))
    .pipe(rename((path) => {
      path.extname = ".jsrc"
    }))
    .pipe(gulp.dest("./tmp"));
});

// Map global files across to tmp folder
gulp.task('toml', function() {
  return gulp.src('./src/**/*.toml')
    .pipe(toml())
    .pipe(rename((path) => {
      path.extname = '.global';
    }))
    .pipe(gulp.dest("./tmp"));
});

// Run all split tasks
gulp.task('split', ['json', 'html', 'jadesrc', 'toml']);

// Use magic template to recombine all the parts into a single file
gulp.task('combine', ['split'], function() {
  return gulp.src('./tmp/**/*')
    .pipe(magic({
      globals: {
        globals: /(.*)globals\.global$/
      },
      patterns: {
        html: /(.*)\.html$/,
        json: /(.*)\.json$/,
        jade: /(.*)\.jsrc$/
      },
      action: (data) => {

        // Combine globals and local data into 'mega' locals objects
        var locals = {
          self: JSON.parse(data.json.value),
          global: JSON.parse(data.globals.value),
          content: ''
        };

        // Try to load and parse the content html and inject values
        try {
          console.log(data.html.value);
          var html = handlebars.compile(data.html.value);
          locals.content = html({ locals: locals });
          console.log(locals.content);
        }
        catch(err) {
          console.log(`Failed to render: ${data.html.path}`);
          console.log(err);
        }

        // Return a new jade template with the injected meta data
        return `block locals\n  - var locals = ${JSON.stringify(locals)}\n${data.jade.value}`;
      },
      path: (data) => { return data.jade.path; }
    }))
    .pipe(rename((path) => {
      path.extname = ".jade";
    }))
    .pipe(gulp.dest("./tmp"));
});

// Expand generated jade templates
gulp.task('jade', function() {
  return gulp.src('./tmp/**/*.jade')
    .pipe(jade({
      globals: ['locals']
    }))
    .pipe(gulp.dest("./build"));
});

// Styles
gulp.task('styles', function() {
  return gulp.src('./src/*.scss')
    .pipe(sass())
    .pipe(gulp.dest("./build"));
});

gulp.task('default', function() {
  return run('split', 'combine', 'jade', 'styles');
});
