const express = require('express');
const router = express.Router();

router.get('/employee',function(req,res){
    res.send({type:'GET'});
});

router.post('/employee',function(req,res){
    res.send({type:'POST',
    name: req.body.name,
    });
});

module.exports = router;