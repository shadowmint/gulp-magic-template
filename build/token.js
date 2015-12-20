"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A single file token.
 * If the UID is set on this token, it is bound into a token group
 * under that UID. If the UID is null, this is a 'global' token that
 * all token groups are passed.
 */

var Token = exports.Token = (function () {

  /** Create a new instance */

  function Token(path, value, uid, id) {
    _classCallCheck(this, Token);

    this.path = path;
    this.value = value;
    this.uid = uid ? uid : null;
    this.id = id ? id : null;
  }

  /**
   * Process this token with a regex and return true if it matched.
   * If possible, extract a uid for this token from the path.
   * @param id The id to claim on success.
   * @param regex The regex to match with.
   */

  _createClass(Token, [{
    key: "match",
    value: function match(id, regex) {
      var match = false;
      var matches = this.path.match(regex);
      if (matches) {
        this.id = id;
        if (matches.length > 1) {
          this.uid = matches[1];
        }
        match = true;
      }
      return match;
    }

    /** Create a clone of this token to own */

  }, {
    key: "clone",
    value: function clone() {
      return new Token(this.path, this.value, this.uid, this.id);
    }
  }]);

  return Token;
})();