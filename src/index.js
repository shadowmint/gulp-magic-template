import gutil from 'gulp-util';
import {Plugin} from 'gulp-tools';
import {PatternStream} from './pattern_stream';
import File from 'vinyl';
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

    // The set of globals we expect to find
    this.option('globals', null, (v) => { return true; });

    // The handler to invoke with the set of loaded pattern files
    // The input is { key: token, key: token, ... }
    // where token: { path: 'foo/source2.html', value: '...', uid: 'foo/source2', id: 'html' }
    this.option('action');

    // The handler to invoke to generate the output path for complete files
    // The input is { key: token, key: token, ... }
    // where token: { path: 'foo/source2.html', value: '...', uid: 'foo/source2', id: 'html' }
    this.option('path');
  }

  handle_string(file, value, callback, fstream) {

    /// Create a new pattern config, if none exists
    if (this.patterns == null) {
      this.patterns = new PatternStream();
      this.patterns.instance(this.options.patterns);
      if (this.options.globals) {
        this.patterns.global(this.options.globals);
      }
    }

    // Process a value
    var results = this.patterns.handle(file.path, value);
    var failed = null;
    if (results) {
      for (var i = 0; i < results.length; ++i) {
        try {
          var output = this.options.action(results[i].tokens);
          var path = this.options.path(results[i].tokens);
          var fp = new File({ path: path, cwd: file.cwd, base: file.base, contents: new Buffer(output) });
          fstream.push(fp);
        }
        catch(err) {
          failed = new gutil.PluginError(this.name, err, {fileName: file.path});
        }
      }
    }
    callback(failed);
  }
}

export default function handler(opts) {
  return new GulpPlugin().handler()(opts);
}
