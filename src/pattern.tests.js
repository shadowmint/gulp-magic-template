import {Pattern, PatternGroup} from './pattern';

export function test_pattern(test) {
  var instance = new Pattern();
  instance.pattern('foo', /(.*)\.foo$/);
  instance.pattern('bar', /(.*)\.bar$/);
  test.ok(instance.match('/home/doug/foo.foo', '1'));
  test.ok(!instance.complete());
  test.ok(instance.match('/home/doug/foo.bar', '2'));
  test.ok(instance.complete());
  test.ok(instance.data.foo);
  test.ok(instance.data.bar);
  test.done();
}

export function test_pattern_uid(test) {
  var instance = new Pattern();
  instance.pattern('foo', /(.*)\.foo$/);
  instance.pattern('bar', /(.*)\.bar$/);
  test.ok(instance.match('/home/doug/foo.foo', '1'));
  test.ok(instance.uid == '/home/doug/foo');
  test.ok(!instance.match('/home/doug/fooxxx.bar', '1'));
  test.ok(instance.match('/home/doug/foo.bar', '1'));
  test.done();
}

export function test_pattern_group(test) {
  var instance = new PatternGroup({
    foo: /(.*)\.foo$/,
    bar: /(.*)\.bar$/,
  });

  test.ok(instance.process('blah/blah.txt', '1') == null);
  test.ok(instance.process('blah/blah.foo', '1') == null);
  test.ok(instance.process('blah/blah2.foo', '1') == null);
  test.ok(instance.process('blah/blah3.foo', '1') == null);

  var pattern = instance.process('blah/blah.bar', '1');
  test.ok(pattern);
  test.ok(pattern.data.foo);
  test.ok(pattern.data.bar);

  test.ok(instance.process('blah/blah2.bar', '1') != null);
  test.ok(instance.process('blah/blah3.bar', '1') != null);

  test.ok(true);
  test.done();
}
