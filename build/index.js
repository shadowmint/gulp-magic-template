'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handler;

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _gulpTools = require('gulp-tools');

var _pattern_stream = require('./pattern_stream');

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GulpPlugin = (function (_Plugin) {
  _inherits(GulpPlugin, _Plugin);

  function GulpPlugin() {
    _classCallCheck(this, GulpPlugin);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GulpPlugin).call(this, 'gulp-magic-template'));

    _this.patterns = null;
    return _this;
  }

  _createClass(GulpPlugin, [{
    key: 'configure',
    value: function configure(options) {
      this.options = options ? options : {};

      // The set of patterns we expect to find
      this.option('patterns');

      // The set of globals we expect to find
      this.option('globals', null, function (v) {
        return true;
      });

      // The handler to invoke with the set of loaded pattern files
      // The input is { key: token, key: token, ... }
      // where token: { path: 'foo/source2.html', value: '...', uid: 'foo/source2', id: 'html' }
      this.option('action');

      // The handler to invoke to generate the output path for complete files
      // The input is { key: token, key: token, ... }
      // where token: { path: 'foo/source2.html', value: '...', uid: 'foo/source2', id: 'html' }
      this.option('path');
    }
  }, {
    key: 'handle_string',
    value: function handle_string(file, value, callback, fstream) {

      /// Create a new pattern config, if none exists
      if (this.patterns == null) {
        this.patterns = new _pattern_stream.PatternStream();
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
            var fp = new _vinyl2.default({ path: path, cwd: file.cwd, base: file.base, contents: new Buffer(output) });
            fstream.push(fp);
          } catch (err) {
            failed = new _gulpUtil2.default.PluginError(this.name, err, { fileName: file.path });
          }
        }
      }
      callback(failed);
    }
  }]);

  return GulpPlugin;
})(_gulpTools.Plugin);

function handler(opts) {
  return new GulpPlugin().handler()(opts);
}