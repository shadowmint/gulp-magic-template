import gutil from 'gulp-util';
import {Plugin} from 'gulp-tools';
import {PatternGroup} from './pattern';
import path from 'path';

class GulpPlugin extends Plugin {

  constructor() {
    super('gulp-magic-template');
    this.patterns = null;
  }

  configure(options) {
    this.options = options ? options : {};

    // The set of patterns we expect to find
    this.option('patterns');

    // The handler to invoke with the set of loaded pattern files
    this.option('action');
  }

  handle_string(file, value, callback) {

    /// Create a new pattern config, if none exists
    if (this.patterns == null) {
      this.patterns = new PatternGroup(this.options.patterns);
    }

    // Add to pattern group, if its a complete pattern, process it.
    var pattern = this.patterns.process(file.path, value);
    if (pattern) {
      try {
        var output = this.options.action(pattern.data);
        file.contents = new Buffer(output);
        callback(null, file);
      }
      catch(err) {
        var error = new gutil.PluginError(this.name, err, {fileName: file.path});
        callback(error);
      }
    }
    else {
      callback();
    }
  }
}

export default function handler(opts) {
  return new GulpPlugin().handler()(opts);
}
