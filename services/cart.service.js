const { cart } = require("../models/cart.model");
var async = require("async");

async function addCart(params, callback) {
    if(!params.userId){
        return callback({
            message: "UserId Required"
        });
    }

    cart.findOne({ userId: params.userId}, function(err, cartDB) {
        if(err){
            return callback(err);
        }
        else{
            if(cartDB == null){
                const cartModel = new cart({
                    userId: params.userId,
                    products: params.products
                });

                cartModel
                .save()
                .then ((response) => {
                    return callback(null, response);
                })
                .catch((error) => {
                    return callback(error);
                });
            }
            else if (cartDB.products.length == 0){
                cartDB.products = params.products;
                cartDB.save();
                return callback(null, cartDB);
            }
            else{
                async.eachSeries(params.products, function(product, asyncDone){
                    let itenIndex = cartDB.products.findIndex(p=>p.product == product.product)

                    if(itemIndex === -1) {
                        cartDB.products.push({
                            product: product.product,
                            qty: product.qty
                        });
                        cartDB.save(asyncDone);
                    }
                    else {
                        cartDB.products[itemIndex].qty = cartDB.products[itemIndex].qty +  product.qty;
                        cartDB.save(asyncDone);
                    }
                });
            
                return callback(null, cartDB);
            }
        }
    });
}

async function getCart(params, callback){
    cart.findOne({userId: params.userId})
    .populate({
        path:  "products",
        populate: {
            path: 'product',
            model: 'Product',
            select: 'productName productPrice, ProductSalePrice productImage',
            populate: {
                path: 'category',
                model: 'Category'
            }
        }
    })
}