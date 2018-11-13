import createError from 'http-errors';
import User from '../model/user';

export default (req, res, next) => {
  let { authorization } = req.headers; // Get key:value pair from authorization header
  if (!authorization) {
    return next(createError(400, 'AUTH ERROR: no authorization header'));
  }

  let encoded = authorization.split('Basic ')[1]; // grab the encoded token off the authorization header
  if (!encoded) {
    return next(createError(401, 'AUTH ERROR: username or password missing'));
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        throw createError(401, 'AUTH ERROR: user not found');
      }

      return user.passwordCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
}
