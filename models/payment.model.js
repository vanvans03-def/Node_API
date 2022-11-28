const mongoose = require("mongoose");
const cards = mongoose.model(
    "CustomerPayments",
    mongoose.Schema({
        paymentName: {
            type: String,
            required: false
        },
        paymenyNumber: {
            type: String,
            required: true,
            unique: true
        },
        customerId:{
            type:String,
            required:true
        },
        paymentId:{
            type:String,
            required:true
        }
    },{ timestamp : true })
);

module.exports ={
    payments
}