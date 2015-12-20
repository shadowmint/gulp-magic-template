import gutil from 'gulp-util';
import {Plugin} from 'gulp-tools';
import path from 'path';

class GulpPlugin extends Plugin {

  constructor() {
    super('gulp-section');
  }

  configure(options) {
    this.options = options ? options : {};

    // The start pattern, or null to start from the start of the file.
    this.option('start', null, (v) => { return true; });

    // The end pattern, or null to end at the end of the file.
    this.option('end', null, (v) => { return true; });

    // The splitter to use; defaults to '\n'
    this.option('split', '\n');
  }

  handle_string(file, value, callback) {
    var lines = value.split(this.options.split);
    var matches = [];
    var reading = this.options.start == null;
    for (var i = 0; i < lines.length; ++i) {
      if (!reading) {
        if (this.options.start.test(lines[i])) {
          reading = true;
        }
      }
      else {
        if ((this.options.end !== null) && (this.options.end.test(lines[i]))) {
          break;
        }
        else {
          matches.push(lines[i]);
        }
      }
    }

    // Rebind into file
    file.contents = new Buffer(matches.join(this.options.split));
    callback(null, file);
  }
}

export default function handler(opts) {
  return new GulpPlugin().handler()(opts);
}
