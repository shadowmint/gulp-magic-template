'use strict';

import * as sutils from 'gulp-tools/lib/utils';
import plugin from './index';
import fs from 'fs';
import File from 'vinyl';

export function test_entire_file(test) {
  test.expect(1);

  var file = new File({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = plugin({
    start: null,
    end: null
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    test.ok(value == "1\n2\n3\n4\n5");
    test.done();
  });

  stream.write(file);
  stream.end();
}

export function test_start_to_marker(test) {
  test.expect(1);

  var file = new File({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = plugin({
    start: null,
    end: /^4$/
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    test.ok(value == "1\n2\n3");
    test.done();
  });

  stream.write(file);
  stream.end();
}

export function test_marker_to_end(test) {
  test.expect(1);

  var file = new File({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = plugin({
    start: /^3$/,
    end: null
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    test.ok(value == "4\n5");
    test.done();
  });

  stream.write(file);
  stream.end();
}

export function test_section(test) {
  test.expect(1);

  var file = new File({ path: 'source1.js', cwd: 'tests/', base: 'tests/', contents: new Buffer("1\n2\n3\n4\n5") });

  var stream = plugin({
    start: /^2$/,
    end: /^4$/
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    test.ok(value == "3");
    test.done();
  });

  stream.write(file);
  stream.end();
}

export function test_with_stream(test) {
  test.expect(1);

  var file = new File({
    path: 'source1.js',
    cwd: 'tests/',
    base: 'tests/',
    contents: fs.createReadStream('./tests/source.md')
  });

  var stream = plugin({ start: /^--START.*/, end: /^--END.*/ });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    var expected = "Note that --- not considering the asterisk --- the actual text\ncontent starts at 4-columns in.";
    test.ok(value == expected);
    test.done();
  });

  stream.write(file);
  stream.end();
}
