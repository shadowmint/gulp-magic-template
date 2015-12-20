/**
 * A single file token.
 * If the UID is set on this token, it is bound into a token group
 * under that UID. If the UID is null, this is a 'global' token that
 * all token groups are passed.
 */
export class Token {

  /** Create a new instance */
  constructor(path, value, uid, id) {
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
  match(id, regex) {
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
  clone() {
    return new Token(this.path, this.value, this.uid, this.id);
  }
}
