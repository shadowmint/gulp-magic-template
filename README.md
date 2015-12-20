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
  patterns: {
    txt: /(.*)\.txt$/,
    jade: /(.*)\.jade$/,
    html: /(.*)\.html$/
  },
  action: (data) => {
    return `${data.json.value}${data.jade.value}${data.html.value}`;
  }
});
```

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

The return value is taken and used to replace the buffer on the final matching
file.

Notice that this plugin will only generate *one* output file, for a complete
input file set; partial file sets are discarded, and each complete set will
have whatever the final matching token is passed out as the file; use
gulp-rename to ensure your final output file has the correct name.

## Install

```
$ npm install --save-dev shadowmint/gulp-magic-template#0.0.1
```

## License

MIT
