/** A group values with specifically matching files */
export class Pattern {

  /** Create a new instance with a set of patterns in it */
  constructor() {
    this.patterns = [];
    this.data = {};
    this.uid = null;
  }

  /**
   * Add a new pattern
   * Notice that the regex should return a submatch for the UID to return.
   * @param id The id for this pattern
   * @param regex The regex for this pattern
   */
  pattern(id, regex) {
    this.patterns.push({ id: id, regex: regex });
  }

  /**
   * Add a new file, if it matches a pattern?
   * @param path The path to query
   * @param value The value to keep on match
   * @return The UID of the file, if it matches
   */
  match(path, value) {
    var tmp = this.patterns;
    this.patterns = [];
    var rtn = false;
    for (var i = 0; i < tmp.length; ++i) {
      var matches = path.match(tmp[i].regex);
      if (matches) {
        if (matches.length < 2) {
          throw new Error(`Invalid regex: ${tmp[i].regex}: At least one submatch must be present`);
        }

        // Absorb submatch as uid for this token if no uid yet
        if (this.uid == null) {
          this.uid = matches[1];
        }

        // Accept this match only if the uid also matches
        if (this.uid == matches[1]) {
          this.data[tmp[i].id] = { path: path, value: value };
          rtn = matches[1];
        }
        else {
          this.patterns.push(tmp[i]);
        }
      }
      else {
        this.patterns.push(tmp[i]);
      }
    }
    return rtn;
  }

  /** Check if this pattern is complete */
  complete() {
    return this.patterns.length == 0;
  }
}

/** Collection of patterns */
export class PatternGroup {

  /**
   * Create a new instance, with a factory like:
   * { foo: /(.*)\.foo$/, bar: .... }
   */
  constructor(factory) {
    this.factory = factory;
    this.patterns = {};
  }

  /** Process a new value */
  process(path, value) {
    var matched = false;
    var local = null;
    var rtn = null;

    // Try to match to an existing pattern */
    for (var key in this.patterns) {
      if (this.patterns[key].match(path, value)) {
        local = key;
        matched = true;
        break;
      }
    }

    // If there was no match, try a new pattern
    if (!matched) {
      var pattern = this.new_pattern();
      var uid = pattern.match(path, value);
      if (uid) {
        this.patterns[uid] = pattern;
        local = uid;
      }
    }

    // Check if the pattern we just finished was a match?
    if (local != null) {
      pattern = this.patterns[local];
      if (pattern.complete()) {
        delete this.patterns[local];
        rtn = pattern;
      }
    }

    return rtn;
  }

  /** Create a new pattern from the factory */
  new_pattern() {
    var rtn = new Pattern();
    for (var key in this.factory) {
      rtn.pattern(key, this.factory[key]);
    }
    return rtn;
  }
}
