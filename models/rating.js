const { default: mongoose } = require("mongoose")
const ratingSchema = mongoose.Schema({
    userId: {
        type: String,
        require:true
    },
    rating:{
        type:Number,
        require:true
    },
    
});

module.exports = ratingSchema;