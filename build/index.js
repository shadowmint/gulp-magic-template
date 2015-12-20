'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handler;

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _gulpTools = require('gulp-tools');

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

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GulpPlugin).call(this, 'gulp-section'));
  }

  _createClass(GulpPlugin, [{
    key: 'configure',
    value: function configure(options) {
      this.options = options ? options : {};

      // The start pattern, or null to start from the start of the file.
      this.option('start', null, function (v) {
        return true;
      });

      // The end pattern, or null to end at the end of the file.
      this.option('end', null, function (v) {
        return true;
      });

      // The splitter to use; defaults to '\n'
      this.option('split', '\n');
    }
  }, {
    key: 'handle_string',
    value: function handle_string(file, value, callback) {
      var lines = value.split(this.options.split);
      var matches = [];
      var reading = this.options.start == null;
      for (var i = 0; i < lines.length; ++i) {
        if (!reading) {
          if (this.options.start.test(lines[i])) {
            reading = true;
          }
        } else {
          if (this.options.end !== null && this.options.end.test(lines[i])) {
            break;
          } else {
            matches.push(lines[i]);
          }
        }
      }

      // Rebind into file
      file.contents = new Buffer(matches.join(this.options.split));
      callback(null, file);
    }
  }]);

  return GulpPlugin;
})(_gulpTools.Plugin);

function handler(opts) {
  return new GulpPlugin().handler()(opts);
}