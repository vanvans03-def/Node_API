const mongoose = require("mongoose");
const { province } = require("./province_thai.model");
const store = mongoose.model(
    "Store",
    mongoose.Schema(
        {
            storeName: {
                type: String,
                required: true,
                unique: true,
            },
            storeImage: [{
                type: String
            }],
            banner: [{
                type: String
            }],
            idcardImage: [{
                type: String
            }],
            idcardNo:{
                type:String
            },
            phone: {
                type: String,
                default: ""
            },

            storeDescription: {
                type: String,
                required: true
            },
            storeShortDescription: {
                type: String,
               
            },
            storeStatus: {
                type: String,
                required: true,
                default: "0"
            }, user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            province:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "province",
                required: true,
            }
        },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.storeId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                }
            }
        })
);

module.exports = {
    store
}