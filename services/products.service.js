const { product } = require("../models/product.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");

async function createProduct(params, callback) {
    if(!params.productName) {
        return callback(
            {
                message: "Product Name required",
            },
            ""
        );
    }

    if(!params.category) {
        return callback(
            {
                message: "Category required",
            },
            ""
        );
    }

    const productModel = new product(params);
    productModel.save()   
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getProducts(params, callback) {
    const productName = params.productName;
    const categoryId = params.categoryId;
    var condition = {};

    if (productName) {
        condition["productName"] = {
            $regex: new RegExp(productName), $options: "i"
        };
    }

    if(categoryId) {
        condition["categoryId"] = categoryId;
    }

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    product
    .find(condition, "productName category productShortDescription productDescription productPrice productSalePrice productImage productSKU productType stockStatus")
    //.populate("category", "categoryName categoryImage")
    .limit(perPage)
    .skip(perPage * page)
    .then((response) => {
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function getProductById(params, callback) {
    const productId = params.productId;
    
    product
    .findById(productId)
    .populate("category", "categoryName categoryImage")
    .then((response) =>{
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function updateProduct(params, callback) {
    const productId = params.productId;
   
    product
    .findByIdAndUpdate(productId, params, {useFindAndModify: false})
    .then((response) => {
        if(!response) callback('Cannot update Product with id ' + productId)
        else callback(null,response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function deleteProduct(params, callback) {
    const productId = params.productId;
    
    product
    .findByIdAndRemove(productId)
    .then((response) => {
        if(!response) {
        callback(`Cannot update Product with id ${productId}`)
        }
        else callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function searchProducts(productName) {
    const match = {
      $or: [
        { productName: new RegExp(productName, "i") },
        { productShortDescription: new RegExp(productName, "i") },
      ],
    };
  
    const pipeline = [
      { $match: match },
      {
        $project: {
          productName: 1,
          category: 1,
          productShortDescription: 1,
          productDescription: 1,
          productPrice: 1,
          productSalePrice: 1,
          productImage: 1,
          productSKU: 1,
          productType: 1,
          stockStatus: 1,
        },
      },
    ];
  
    return product.aggregate(pipeline);
  }

  async function rateProduct(productId, userId, rating) {
    let product = await productModel.findById(productId);
    for (let i = 0; i < product.ratings.length; i++) {
        if (product.ratings[i].userId == userId) {
            product.ratings.splice(i, 1);
            break;
        }
    }

    const ratingSchema = {
        userId: userId,
        rating: rating,
    };

    product.ratings.push(ratingSchema);
    product = await product.save();
    return product;
}

  
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    rateProduct
}


