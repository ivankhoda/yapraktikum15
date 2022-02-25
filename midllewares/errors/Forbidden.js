// eslint-disable-next-line max-classes-per-file

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
