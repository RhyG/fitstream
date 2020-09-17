/**
 * Extracts bearer token from headers.
 * @param req
 */
const extractToken = (req) => {
  return req.headers.authorization.split(" ")[1];
};

module.exports = { extractToken };
