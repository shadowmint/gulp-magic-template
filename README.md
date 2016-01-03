# gulp-magic-template

This is a gulp plugin to combine multiple files using a custom action.

This is useful, if, for example, you need to process a template with some
metadata in an associated .json file; the action call allows you to create
a new intermediate file before passing to the template task that injects
the contents of the metadata into the top of the file.

See the `demo` folder for an example of this in practice.

## Usage

```
var stream = magic({
  globals: {
    global: /.*global.foo$/
  },
  patterns: {
    txt: /(.*)\.txt$/,
    jade: /(.*)\.jade$/,
    html: /(.*)\.html$/
  },
  action: (data) => {
    return `${data.json.value}${data.jade.value}${data.html.value}`;
  },
  path: (data) => {
    return data.json.path;
  },
  debug: (data) => {
    console.log(data);
  }
});
```

### For example...

You can render this:

    --META--

    title = "Article 1"
    published = 2016-01-01T08:00:00+08:00

    --CONTENT--

    # {{ locals.self.title }}

    published {{formatDate locals.self.published day=numeric month=long year=numeric}}

    Some actual content goes here...

    * item 1
    * item 2
    * item 3

    --TEMPLATE--

    extend ../templates/master

    block pagecontent
      != locals.content

Into this:

    <!DOCTYPE html>
    <head>
      <title>Demo</title>
      <link rel="stylesheet" type="text/css" href="./styles.css">
    </head>
    <body class="default default">
      <h1 id="-locals-self-title-">Article 1</h1>
      <p>published 1/1/2016</p>
      <p>Some actual content goes here...</p>
      <ul>
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
      </ul>
      <div class="footer">
        <div>
          <a href="www.google.com">Google</a>
        </div>
        <div>
          <a href="www.facebook.com">Facebook</a>
        </div>
      </div>
    </body>
    </html>

Notice how the toml, markdown and jade are split out and then individually
processed, then recombined into a single file.

See the `demo` folder to see how this is done.

### Patterns

A hash of id and regex pairs, which are used to match on file names using
the first submatch token.

So for example above, the files:

    /foo/foo.txt
    /foo/foo.jade
    /foo/foo.html

Will be loaded and combined into a data object which is passed to action.

### Action

The action callback is invoked with a hash of the ids, paths and data values
from the files which were matched, eg:

    { txt: { path: 'foo/source1.txt', value: '1' },
      html: { path: 'foo/source1.html', value: '1' },
      jade: { path: 'foo/source1.jade', value: '1' } }

Notice that this plugin will only generate *one* output file, for a complete
input file set; partial file sets are discarded, and each complete set will
emit with a single filename based off the `path` option.

### Debug

The debug option can be used to debug the process, it returns a block like
this on the handler:

    { globals: { matched: 1, total: 1 },
      incomplete: 0,
      discarded: 0,
      emitted: 2 }

Which are, respectively, the number of global tokens required and found,
the number of incomplete patterns at the end of the run, the number of
paths that were discarded as matching no token, and the number of complete
patterns emitted.

## Install

```
$ npm install --save-dev shadowmint/gulp-magic-template#0.0.1
```

## License

MIT
