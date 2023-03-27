const mongoose = require("mongoose");
const { product } = require("./product.model");
const user = mongoose.model(
    "User",
    mongoose.Schema(
        {
            fullName: {
                type: String,
                required: true,

            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            }
            , phoneNumber:{
                 type:String,
                 default: "",
                 /*required:true,
                 unique:true*/
             },
             address:{
                 type:String,
                 default: "",
             },type:{
                type:String,
                default: "user",
                
             },cart:[{
                product: product,
                quantity:{
                    type:Number,
                    require:true,
                },
                
            }],
        },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.userId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                    delete ret.password;
                }
            }
        }, {
        timestamp: true
    })
);
module.exports = {
    user
}