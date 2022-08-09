const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Secret = require('../models/Secret');
// //how long the token lasts 

module.exports = Router()

  .get('/secrets', authenticate, async (req, res) => {
    res.json({ message: 'hello secrets' });
  })
  
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await Secret.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  });
