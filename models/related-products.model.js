const { redirect } = require("express/lib/response");
const mongoose = require("mongoose"); 

const relatedProduct = mongoose.model(
    "RelatedProduct",
    mongoose.Schema(
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            relatedProduct: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        },
        {
            toJson: {
                transform: function(doc, ret){
                    delete ret._id;
                    delete ret._v;
                }
            },
            timestamp: true
        }
    )
);

module.exports = {
    relatedProduct,
}