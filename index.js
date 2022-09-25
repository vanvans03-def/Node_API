const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://teera:Lover2ne1!@cluster0.tbdz2u3.mongodb.net/?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

app.use(express.json());

//app.get('/api',(req,res) => res.send('API Working !!'));
app.use('/api',require('./routes/api'));

app.use(function(err,req,res,next){
    res.status(422).send({error: err.message});
})

app.listen(process.env.port || 4000, function() {
    console.log('Now Listening for Requests');
});