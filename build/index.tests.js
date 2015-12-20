'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test_entire_file = test_entire_file;
exports.test_with_stream = test_with_stream;

var _utils = require('gulp-tools/lib/utils');

var sutils = _interopRequireWildcard(_utils);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function test_entire_file(test) {
  test.expect(1);

  var files = [new _vinyl2.default({ path: 'foo/globals.glob', cwd: 'tests/', base: 'tests/', contents: new Buffer("0") }), new _vinyl2.default({ path: 'foo/source1.json', cwd: 'tests/', base: 'tests/', contents: new Buffer("1") }), new _vinyl2.default({ path: 'foo/source2.json', cwd: 'tests/', base: 'tests/', contents: new Buffer("2") }), new _vinyl2.default({ path: 'foo/source1.html', cwd: 'tests/', base: 'tests/', contents: new Buffer("3") }), new _vinyl2.default({ path: 'foo/source2.html', cwd: 'tests/', base: 'tests/', contents: new Buffer("4") }), new _vinyl2.default({ path: 'foo/source1.jade', cwd: 'tests/', base: 'tests/', contents: new Buffer("5") }), new _vinyl2.default({ path: 'foo/source2.jade', cwd: 'tests/', base: 'tests/', contents: new Buffer("6") })];

  var stream = (0, _index2.default)({
    globals: {
      globals: /(.*)globals.glob$/
    },
    patterns: {
      json: /(.*)\.json$/,
      jade: /(.*)\.jade$/,
      html: /(.*)\.html$/
    },
    action: function action(data) {
      return '' + data.globals.value + data.json.value + data.jade.value + data.html.value;
    },
    path: function path(data) {
      return data.json.path;
    }
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    test.ok(value == "01530264");
    test.done();
  });

  for (var i = 0; i < files.length; ++i) {
    stream.write(files[i]);
  }
  stream.end();
}

function test_with_stream(test) {
  test.expect(1);

  var file = new _vinyl2.default({
    path: 'tests/source.md',
    cwd: 'tests/',
    base: 'tests/',
    contents: _fs2.default.createReadStream('./tests/source.md')
  });
  var file2 = new _vinyl2.default({
    path: 'tests/source.json',
    cwd: 'tests/',
    base: 'tests/',
    contents: _fs2.default.createReadStream('./tests/source.json')
  });

  var stream = (0, _index2.default)({
    patterns: {
      json: /(.*)\.json$/,
      markdown: /(.*)\.md$/
    },
    action: function action(data) {
      return '' + data.markdown.value + data.json.value;
    },
    path: function path(data) {
      return data.json.path;
    }
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    var expected = "An h1 header\n{}\n";
    test.ok(value == expected);
    test.done();
  });

  stream.write(file);
  stream.write(file2);
  stream.end();
}