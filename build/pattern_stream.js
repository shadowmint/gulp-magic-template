'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PatternStream = undefined;

var _pattern = require('./pattern');

var _token = require('./token');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** A stream of patterns */

var PatternStream = exports.PatternStream = (function () {

  /** Create a new instance */

  function PatternStream() {
    _classCallCheck(this, PatternStream);

    this.patterns = {};
    this.emitted = 0;
    this.discarded = 0;
    this._globals = new _pattern.Pattern();
    this._instance = new _pattern.Pattern();
  }

  /** Set the global required patterns */

  _createClass(PatternStream, [{
    key: 'global',
    value: function global(patterns) {
      this._globals.required(patterns);
    }

    /** Set the per-instance template patterns */

  }, {
    key: 'instance',
    value: function instance(patterns) {
      this._instance.required(patterns);
    }

    /** Handle an incoming pattern */

  }, {
    key: 'handle',
    value: function handle(path, value) {
      //console.log("\n------ New token ------");
      var token = new _token.Token(path, value);
      if (this._globals.match(token)) {
        //console.log("It was a global. Published global");
        this.publish_global(token);
      } else if (this._instance.match(token)) {
        //console.log("It was an instance.");
        var pattern = this.patterns[token.uid];
        if (!pattern) {
          //console.log("Creating a new pattern to match this uid: " + token.uid);
          pattern = this.create_pattern();
          this.patterns[token.uid] = pattern;
        }
        //console.log("Passing token to pattern: " + token.id);
        pattern.match(token);
      } else {
        //console.log(`Discarded unknown token: ${path}`);
        this.discarded += 1;
      }
      return this.completed_patterns();
    }

    /** Create a new pattern and pass all existing global tokens into it */

  }, {
    key: 'create_pattern',
    value: function create_pattern() {
      var instance = new _pattern.Pattern();
      instance.required(this._instance.patterns);
      instance.required(this._globals.patterns);
      for (var key in this._globals.tokens) {
        instance.match(this._globals.tokens[key]);
      }
      return instance;
    }

    /** Push a global token to all held patterns */

  }, {
    key: 'publish_global',
    value: function publish_global(token) {
      for (var key in this.patterns) {
        this.patterns[key].match(token);
      }
    }

    /** Return an array of completed patterns, remove them from the list */

  }, {
    key: 'completed_patterns',
    value: function completed_patterns() {
      //console.log("\n------ done ------");
      var count = 0;for (var key in this.patterns) {
        count += 1;
      }
      //console.log("Looking for complete patterns in total: " + count);
      var tmp = this.patterns;
      var rtn = [];
      this.patterns = {};
      for (var key in tmp) {
        if (tmp[key].ready()) {
          rtn.push(tmp[key]);
        } else {
          this.patterns[key] = tmp[key];
        }
      }
      this.emitted += rtn.length;
      //console.log("Found " + rtn.length + " patterns which were complete");
      return rtn;
    }

    /** Return a debug hash about the state of the pattern stream. */

  }, {
    key: 'debug',
    value: function debug() {
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
  }]);

  return PatternStream;
})();