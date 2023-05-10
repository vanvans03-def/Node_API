const mongoose = require("mongoose");
const store = mongoose.model(
    "Store",
    mongoose.Schema(
        {
            Storename: {
                type: String,
                required: true,
                unique: true,
            },
            StoreImage: {
                type: String
            },
            Banner: {
                type: String
            },
            phone: {
                type: String,
                default: ""
            },

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
                default: "0"
            }, user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
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