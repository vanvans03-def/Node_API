const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

router.get('/employee', function (req, res, next) {
    Employee.find({})
        .then(function (employees) {
            res.send(employees);
        })
        .catch(next)
});

router.post('/employee', function (req, res, next) {
    Employee.create(req.body)
        .then(function (employee) {
            res.send(employee);
        })
        .catch(next)
});

router.put('/employee/:id', function (req, res, next) {
    Employee.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(function (employee) {
            Employee.findOne({ _id: req.params.id })
                .then(function (employee) {
                    res.send(employee);
                });
        });
});

router.delete('/employee/:id', function (req, res, next) {
    Employee.findOneAndDelete({ _id: req.params.id })
        .then(function (employee) {
            res.send(employee);
        });
});

module.exports = router;