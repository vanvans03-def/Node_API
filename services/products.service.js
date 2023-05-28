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
    if(!params.storeId) {
      return callback(
          {
              message: "StoreId required",
          },
          ""
      );
  }

    const productModel = new product(params);
    productModel.save()   
        .then(async (response) => {
          const createdProduct = await product.findById(response._id).select('-relatedProduct -__v');
          return callback(null, createdProduct);
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
    .find({}).select( '-__v -relatedProduct')
   
    .then((response) => {
     
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}


async function getProductById(params, callback) {
  const productId = params.productId;
  try {
      const productData = await product.findById(productId)
          //.populate('category', 'categoryId')
          .select('-__v -relatedProduct')
          .lean();
      if (!productData) {
          return callback({ message: "Product not found" });
      }
    
     
      return callback(null, productData);
  } catch (error) {
      return callback(error);
  }
}




async function updateProduct(params, callback) {
    const productId = params.productId;
   
    product
    .findByIdAndUpdate(productId, params, {new: true, useFindAndModify: false})
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
          storeId:1,
          ratings:1,

        },
      },
    ];
  
    return product.aggregate(pipeline);
  }

  
  async function rateProduct(productId, userId, rating) {
    try {
      let product = await product.findById(productId);
     
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }else{
    
      for (let i = 0; i < product.ratings.length; i++) {
        if (product.ratings[i].userId == userId) {
          product.ratings.splice(i, 1);
          break;
        }
      }}
    
      const ratingSchema = {
        userId,
        rating,
      };
    
      product.ratings.push(ratingSchema);
      product = await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }
  
  async function getProductsByStoreId(id, message) {
    try {      
      let products = await product.find({ storeId: id })
      //.populate('category', 'categoryId')
      .select('-__v -relatedProduct');
      return { message: message, data: products };
    } catch (e) {
      throw new Error(e.message);
    }
  }
  
  
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    rateProduct,
    getProductsByStoreId
}


