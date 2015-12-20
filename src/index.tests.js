'use strict';

import * as sutils from 'gulp-tools/lib/utils';
import plugin from './index';
import fs from 'fs';
import File from 'vinyl';

export function test_entire_file(test) {
  test.expect(1);

  var files = [
    new File({ path: 'foo/source1.json', cwd: 'tests/', base: 'tests/', contents: new Buffer("1") }),
    new File({ path: 'foo/source2.json', cwd: 'tests/', base: 'tests/', contents: new Buffer("2") }),
    new File({ path: 'foo/source1.html', cwd: 'tests/', base: 'tests/', contents: new Buffer("3") }),
    new File({ path: 'foo/source2.html', cwd: 'tests/', base: 'tests/', contents: new Buffer("4") }),
    new File({ path: 'foo/source1.jade', cwd: 'tests/', base: 'tests/', contents: new Buffer("5") }),
    new File({ path: 'foo/source2.jade', cwd: 'tests/', base: 'tests/', contents: new Buffer("6") })
  ];

  var stream = plugin({
    patterns: {
      json: /(.*)\.json$/,
      jade: /(.*)\.jade$/,
      html: /(.*)\.html$/
    },
    action: (data) => {
      return `${data.json.value}${data.jade.value}${data.html.value}`;
    }
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    test.ok(value == "153264");
    test.done();
  });

  for (var i = 0; i < files.length; ++i) {
    stream.write(files[i]);
  }
  stream.end();
}

export function test_with_stream(test) {
  test.expect(1);

  var file = new File({
    path: 'tests/source.md',
    cwd: 'tests/',
    base: 'tests/',
    contents: fs.createReadStream('./tests/source.md')
  });
  var file2 = new File({
    path: 'tests/source.json',
    cwd: 'tests/',
    base: 'tests/',
    contents: fs.createReadStream('./tests/source.json')
  });

  var stream = plugin({
    patterns: {
      json: /(.*)\.json$/,
      markdown: /(.*)\.md$/
    },
    action: (data) => {
      return `${data.markdown.value}${data.json.value}`;
    }
  });

  sutils.read_from_stream(stream, 'utf-8', function(value) {
    var expected = "An h1 header\n{}\n";
    test.ok(value == expected);
    test.done();
  });

  stream.write(file);
  stream.write(file2);
  stream.end();
}
