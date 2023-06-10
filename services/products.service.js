const { product } = require("../models/product.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const { ProductPrice } = require('../models/productprice.model');
const { sortBy } = require("async");
const { store } = require('../models/store.model');
async function createProduct(params, callback) {
  if (!params.productName) {
    return callback(
      {
        message: "Product Name required",
      },
      ""
    );
  }

  if (!params.category) {
    return callback(
      {
        message: "Category required",
      },
      ""
    );
  }
  if (!params.storeId) {
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

  if (categoryId) {
    condition["categoryId"] = categoryId;
  }

  let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
  let page = (Math.abs(params.page) || 1) - 1;

  product
    .find(condition)
    .select('-__v -relatedProduct')
    .then((response) => {
      // Calculate avgRating for each product
      response.forEach((product) => {
        var avgRating = 0;
        var totalRating = 0;
        if (product.ratings && product.ratings.length > 0) { // แก้ไขตรงนี้
          for (var i = 0; i < product.ratings.length; i++) { // แก้ไขตรงนี้
            totalRating += product.ratings[i].rating; // แก้ไขตรงนี้
          }
          avgRating = totalRating / product.ratings.length; // แก้ไขตรงนี้
        }
        product.avgRating = avgRating; // แก้ไขตรงนี้
      });


      // Sort the products based on avgRating in descending order
      response.sort((a, b) => b.avgRating - a.avgRating);

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
    .findByIdAndUpdate(productId, params, { new: true, useFindAndModify: false })
    .then((response) => {
      if (!response) callback('Cannot update Product with id ' + productId)
      else callback(null, response);
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
      if (!response) {
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
        storeId: 1,
        ratings: 1,

      },
    },
  ];

  return product.aggregate(pipeline);
}

async function rateProduct(data) {
  try {
    const { productId, userId, rating } = data;
    console.log(productId);

    let productModel = await product.findById(productId);
    console.log(productModel)

    if (!productModel) {
      throw new Error(`Product with ID ${productId} not found`);
    } else {
      for (let i = 0; i < productModel.ratings.length; i++) {
        if (productModel.ratings[i].userId == userId) {
          productModel.ratings.splice(i, 1);
          break;
        }
      }
    }

    const ratingSchema = {
      userId,
      rating,
    };

    productModel.ratings.push(ratingSchema);
    productModel = await productModel.save();
    return productModel;
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




async function getDealOfDay() {
  try {
    let products = await product.find({}).select('-__v -relatedProduct');
    const productprices = await ProductPrice.find({}).select('-__v');

    products.sort((a, b) => {
      const discountA = calculateDiscount(a);
      const discountB = calculateDiscount(b);
      return discountB - discountA;
    });

    function calculateDiscount(product) {
      let discount = 0;
      let maxDiscount = -Infinity; // ใช้ค่าเริ่มต้นเป็น Infinity สำหรับการหาค่าสูงสุด

      for (let i = 0; i < productprices.length; i++) {
        if (product.productSalePrice == productprices[i].productId) {
          const maxPrice = productprices[i].priceMax;
          const currentDiscount = maxPrice - product.productPrice;
          // console.log(product.productName+" "+" ราคาลด  "+currentDiscount)
          // อัพเดทค่าสูงสุดถ้าพบส่วนลดที่มากกว่า
          maxDiscount = Math.max(maxDiscount, currentDiscount);

          break;
        }
      }

      return maxDiscount;
    }

    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function filterProduct(data) {
  try {
    const { minPrice,
      maxPrice,
      sortByPriceLow,
      sortByPriceHigh,
      province,
      productName } = data;
    let query = {};

    if (minPrice || maxPrice) {
      query.productPrice = {};
      if (minPrice) {
        query.productPrice.$gte = minPrice;
      }
      if (maxPrice) {
        query.productPrice.$lte = maxPrice;
      }
    }

    let productModel;

    if (province !== "") {
      const storeModel = await store.find({ province: province });
      const storeIds = storeModel.map((store) => store._id);

      if (productName.trim() !== "") {
        // ค้นหาสินค้าด้วยชื่อในที่ต้องการ
        const searchResults = await searchProducts(productName);
        const productIds = searchResults.map((product) => product._id);
        // ค้นหาสินค้าที่ตรงกับชื่อในที่ต้องการและร้านค้าที่ตรงกับจังหวัดที่ระบุ
        productModel = await product
          .find({ _id: { $in: productIds }, storeId: { $in: storeIds }, ...query })
          .select('-__v -relatedProduct');
      } else {
        // ค้นหาสินค้าที่ตรงกับร้านค้าที่ตรงกับจังหวัดที่ระบุ
        productModel = await product
          .find({ storeId: { $in: storeIds }, ...query })
          .select('-__v -relatedProduct');
      }
    } else {
      if (productName.trim() !== "") {
        // ค้นหาสินค้าด้วยชื่อในที่ต้องการ
        const searchResults = await searchProducts(productName);
        const productIds = searchResults.map((product) => product._id);
        // ค้นหาสินค้าที่ตรงกับชื่อในที่ต้องการ
        productModel = await product
          .find({ _id: { $in: productIds }, ...query })
          .select('-__v -relatedProduct');
      } else {
        // ค้นหาสินค้าทั้งหมด
        productModel = await product.find(query).select('-__v -relatedProduct');
      }
    }

    if (sortByPriceLow) {
      productModel = productModel.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortByPriceHigh) {
      productModel = productModel.sort((a, b) => b.productPrice - a.productPrice);
    }

    return productModel;
  } catch (error) {
    throw new Error(error.message);
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
  getProductsByStoreId,
  getDealOfDay,
  filterProduct
}


