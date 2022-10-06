const express = require('express');
const router = express.Router();
const Register = require('../models/register');

router.get('/register', function (req, res, next) {
    Register.find({})
        .then(function (registers) {
            res.send(registers);
        })
        .catch(next)
});


router.post('/register', function (req, res, next) {
    Employee.create(req.body)
        .then(function (register) {
            res.send(register);
        })
        .catch(next)
});


module.exports = router;