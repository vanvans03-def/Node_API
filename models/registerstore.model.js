const mongoose = require("mongoose");
const registerstore = mongoose.model(
    "Registerstore",
        mongoose.Schema(
        {
            Storename: {
                type: String,
                required: true,
                unquie: true,
            },
            StoreImage: {
                type: String
            },
            Banner: { 
                type: String ,
                required: true
            },
            //first_name: { 
                //type: String, 
                //default: "", 
                //required: true 
            //},
            //last_name: { 
                //type: String, 
                //default: "", 
                //required: true 
            //},
            //email: { 
                //type: String, 
               // unique: true, 
                //required: true, 
                //index: true 
            //},
            //phone: { 
                //type: String, 
                //default: "" 
            //},
            //password: { 
                //type: String, 
                //required: true 
            //},
            StoreDescription: { 
                type: String,
                required: true 
            },
            StoreShortDescription: {
                type: String,
                required: true
            },
            Store_status: {
                type: String,
                required: true,
                default: "online"
            }
        },
        {toJSON: {
            transform: function (doc, ret) {
                ret.storeId = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            }
        }
        })
    );

    module.exports = {
        registerstore
    }