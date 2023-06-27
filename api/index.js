// /api/index.js
const { createServer } = require('http');
const { api } = require('../index.js');

module.exports = (req, res) => {
  api(req, res);
};
