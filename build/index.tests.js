'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test_entire_file = test_entire_file;
exports.test_start_to_marker = test_start_to_marker;
exports.test_marker_to_end = test_marker_to_end;
exports.test_section = test_section;
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

  var file = new _vinyl2.default({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = (0, _index2.default)({
    start: null,
    end: null
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    test.ok(value == "1\n2\n3\n4\n5");
    test.done();
  });

  stream.write(file);
  stream.end();
}

function test_start_to_marker(test) {
  test.expect(1);

  var file = new _vinyl2.default({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = (0, _index2.default)({
    start: null,
    end: /^4$/
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    test.ok(value == "1\n2\n3");
    test.done();
  });

  stream.write(file);
  stream.end();
}

function test_marker_to_end(test) {
  test.expect(1);

  var file = new _vinyl2.default({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = (0, _index2.default)({
    start: /^3$/,
    end: null
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    test.ok(value == "4\n5");
    test.done();
  });

  stream.write(file);
  stream.end();
}

function test_section(test) {
  test.expect(1);

  var file = new _vinyl2.default({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = (0, _index2.default)({
    start: /^2$/,
    end: /^4$/
  });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    test.ok(value == "3");
    test.done();
  });

  stream.write(file);
  stream.end();
}

function test_with_stream(test) {
  test.expect(1);

  var file = new _vinyl2.default({
    path: 'source1.js',
    cwd: 'tests/',
    base: 'tests/',
    contents: _fs2.default.createReadStream('./tests/source.md')
  });

  var stream = (0, _index2.default)({ start: /^--START.*/, end: /^--END.*/ });

  sutils.read_from_stream(stream, 'utf-8', function (value) {
    var expected = "Note that --- not considering the asterisk --- the actual text\ncontent starts at 4-columns in.";
    test.ok(value == expected);
    test.done();
  });

  stream.write(file);
  stream.end();
}