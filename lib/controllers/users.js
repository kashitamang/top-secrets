const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
// const User = require('../models/User');
const UserService = require('../services/UserService');
// //how long the token lasts 
// const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
//adds a new user to the users table
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
