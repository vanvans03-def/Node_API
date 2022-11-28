const mongoose = require("mongoose");
const cart = mongoose.model(
    "Cart",
    mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    require: true,
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]
    }, {
        toJSON: {
            transform: function (model, ret) {
                ret.cartId = ret._id.toString();
                delete ret._id;
                delete ret._v;
            }
        }
    },{
        timestapms: true
    }
    )
);

module.exports = {
    cart
}