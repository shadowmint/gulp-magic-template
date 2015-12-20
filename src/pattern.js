import {Token} from './token';

/** A pattern is a collection of tokens */
export class Pattern {

  /** Create a new instance */
  constructor() {
    this.patterns = {};
    this.tokens = {};
  }

  /**
   * Add a bunch of required patterns to this instance
   * @param patterns A hash of { id: regex, id2: regex, ... }
   */
  required(patterns) {
    //console.log("Setup pattern with: " + JSON.stringify(patterns));
    for (var key in patterns) {
      this.patterns[key] = patterns[key];
    }
  }

  /** Try to match a token into this pattern */
  match(token) {
    for (var key in this.patterns) {
      if (token.match(key, this.patterns[key])) {
        this.tokens[key] = token.clone();
        //console.log("The token was bound to: " + key);
        return true;
      }
    }
    return false;
  }

  /** Ready yet? */
  ready() {
    //console.log(`Checking if a pattern is ready: ${JSON.stringify(this.patterns)}`);
    for (var key in this.patterns) {
      //console.log(`${key} -> ${this.tokens[key]}`);
      if (!this.tokens[key]) {
        return false;
      }
    }
    return true;
  }

  /** Export this pattern as a data object */
  data() {
    var rtn = {};
    for (var key in this.tokens) {
      var token = this.tokens[key];
      rtn[key] = { path: token.path, value: token.value };
    }
    return rtn;
  }
}

/** A stream of patterns */
export class PatternStream {

  /** Create a new instance */
  constructor() {
    this.patterns = {};
    this.emitted = 0;
    this.discarded = 0;
    this._globals = new Pattern();
    this._instance = new Pattern();
  }

  /** Set the global required patterns */
  global(patterns) {
    this._globals.required(patterns);
  }

  /** Set the per-instance template patterns */
  instance(patterns) {
    this._instance.required(patterns);
  }

  /** Handle an incoming pattern */
  handle(path, value) {
    //console.log("\n------ New token ------");
    var token = new Token(path, value);
    if (this._globals.match(token)) {
      //console.log("It was a global. Published global");
      this.publish_global(token);
    }
    else if (this._instance.match(token)) {
      //console.log("It was an instance.");
      var pattern = this.patterns[token.uid];
      if (!pattern) {
        //console.log("Creating a new pattern to match this uid: " + token.uid);
        pattern = this.create_pattern();
        this.patterns[token.uid] = pattern;
      }
      //console.log("Passing token to pattern: " + token.id);
      pattern.match(token);
    }
    else {
      //console.log(`Discarded unknown token: ${path}`);
      this.discarded += 1;
    }
    return this.completed_patterns();
  }

  /** Create a new pattern and pass all existing global tokens into it */
  create_pattern() {
    var instance = new Pattern();
    instance.required(this._instance.patterns);
    instance.required(this._globals.patterns);
    for (var key in this._globals.tokens) {
      instance.match(this._globals.tokens[key]);
    }
    return instance;
  }

  /** Push a global token to all held patterns */
  publish_global(token) {
    for (var key in this.patterns) {
      this.patterns[key].match(token);
    }
  }

  /** Return an array of completed patterns, remove them from the list */
  completed_patterns() {
    //console.log("\n------ done ------");
    var count = 0; for (var key in this.patterns) { count += 1; }
    //console.log("Looking for complete patterns in total: " + count);
    var tmp = this.patterns;
    var rtn = [];
    this.patterns = {};
    for (var key in tmp) {
      if (tmp[key].ready()) {
        rtn.push(tmp[key]);
      }
      else {
        this.patterns[key] = tmp[key];
      }
    }
    this.emitted += rtn.length;
    //console.log("Found " + rtn.length + " patterns which were complete");
    return rtn;
  }

  /** Return a debug hash about the state of the pattern stream. */
  debug() {
    var rtn = {
      globals: { matched: 0, total: 0 },
      incomplete: 0,
      discarded: this.discarded,
      emitted: this.emitted
    };
    for (var key in this._globals.patterns) {
      rtn.globals.total += 1;
      if (this._globals.tokens[key]) {
        rtn.globals.matched += 1;
      }
    }
    for (var key in this.patterns) {
      rtn.incomplete += 1;
    }
    return rtn;
  }
}
