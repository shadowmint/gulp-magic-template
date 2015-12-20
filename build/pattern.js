"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** A group values with specifically matching files */

var Pattern = exports.Pattern = (function () {

  /** Create a new instance with a set of patterns in it */

  function Pattern() {
    _classCallCheck(this, Pattern);

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

  _createClass(Pattern, [{
    key: "pattern",
    value: function pattern(id, regex) {
      this.patterns.push({ id: id, regex: regex });
    }

    /**
     * Add a new file, if it matches a pattern?
     * @param path The path to query
     * @param value The value to keep on match
     * @return The UID of the file, if it matches
     */

  }, {
    key: "match",
    value: function match(path, value) {
      var tmp = this.patterns;
      this.patterns = [];
      var rtn = false;
      for (var i = 0; i < tmp.length; ++i) {
        var matches = path.match(tmp[i].regex);
        if (matches) {
          if (matches.length < 2) {
            throw new Error("Invalid regex: " + tmp[i].regex + ": At least one submatch must be present");
          }

          // Absorb submatch as uid for this token if no uid yet
          if (this.uid == null) {
            this.uid = matches[1];
          }

          // Accept this match only if the uid also matches
          if (this.uid == matches[1]) {
            this.data[tmp[i].id] = { path: path, value: value };
            rtn = matches[1];
          } else {
            this.patterns.push(tmp[i]);
          }
        } else {
          this.patterns.push(tmp[i]);
        }
      }
      return rtn;
    }

    /** Check if this pattern is complete */

  }, {
    key: "complete",
    value: function complete() {
      return this.patterns.length == 0;
    }
  }]);

  return Pattern;
})();

/** Collection of patterns */

var PatternGroup = exports.PatternGroup = (function () {

  /**
   * Create a new instance, with a factory like:
   * { foo: /(.*)\.foo$/, bar: .... }
   */

  function PatternGroup(factory) {
    _classCallCheck(this, PatternGroup);

    this.factory = factory;
    this.patterns = {};
  }

  /** Process a new value */

  _createClass(PatternGroup, [{
    key: "process",
    value: function process(path, value) {
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

  }, {
    key: "new_pattern",
    value: function new_pattern() {
      var rtn = new Pattern();
      for (var key in this.factory) {
        rtn.pattern(key, this.factory[key]);
      }
      return rtn;
    }
  }]);

  return PatternGroup;
})();