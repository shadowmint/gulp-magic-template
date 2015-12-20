'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test_stream_works_without_globals = test_stream_works_without_globals;
exports.test_stream_works_with_globals = test_stream_works_with_globals;
exports.test_stream_works_with_deferred_globals = test_stream_works_with_deferred_globals;

var _pattern = require('./pattern');

function test_stream_works_without_globals(test) {
  var instance = new _pattern.PatternStream();
  instance.instance({
    inst1: /(.*)\.foo$/,
    inst2: /(.*)\.bar$/
  });

  var debug = instance.debug();
  test.ok(debug.incomplete == 0);
  test.ok(debug.emitted == 0);

  instance.handle('/home/foo/star.foo');
  instance.handle('/home/foo/bone.foo');
  test.ok(instance.handle('/home/foo/star.bar').length);
  test.ok(instance.handle('/home/foo/bone.bar').length);

  debug = instance.debug();
  test.ok(debug.incomplete == 0);
  test.ok(debug.emitted == 2);

  test.done();
}

function test_stream_works_with_globals(test) {
  var instance = new _pattern.PatternStream();
  instance.instance({
    inst1: /(.*)\.foo$/,
    inst2: /(.*)\.bar$/
  });
  instance.global({
    glob1: /(.*)meta1.json$/,
    glob2: /(.*)meta2.json$/
  });

  var debug = instance.debug();
  test.ok(debug.incomplete == 0);
  test.ok(debug.emitted == 0);

  instance.handle('/home/foo/meta1.json');
  instance.handle('/home/foo/meta2.json');
  instance.handle('/home/foo/star.foo');
  instance.handle('/home/foo/bone.foo');
  test.ok(instance.handle('/home/foo/star.bar').length);
  test.ok(instance.handle('/home/foo/bone.bar').length);

  debug = instance.debug();
  test.ok(debug.incomplete == 0);
  test.ok(debug.emitted == 2);

  test.done();
}

function test_stream_works_with_deferred_globals(test) {
  var instance = new _pattern.PatternStream();
  instance.instance({
    inst1: /(.*)\.foo$/,
    inst2: /(.*)\.bar$/
  });
  instance.global({
    glob1: /(.*)meta1.json$/,
    glob2: /(.*)meta2.json$/
  });

  var debug = instance.debug();
  test.ok(debug.incomplete == 0);
  test.ok(debug.emitted == 0);

  instance.handle('/home/foo/star.foo');
  instance.handle('/home/foo/star.bar');

  instance.handle('/home/foo/meta1.json');

  instance.handle('/home/foo/bone.foo');
  instance.handle('/home/foo/bone.bar');

  debug = instance.debug();
  test.ok(debug.incomplete == 2);
  test.ok(debug.emitted == 0);

  test.ok(instance.handle('/home/foo/meta2.json').length == 2);

  test.done();
}