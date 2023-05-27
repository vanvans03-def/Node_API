const productServices = require("../services/products.service");
const upload = require("../middleware/product.upload");
const { authenticationToken } = require('../middleware/auth');

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                productName: req.body.productName,
                category: req.body.category,
                productShortDescription: req.body.productShortDescription,
                productDescription: req.body.productDescription,
                productPrice: req.body.productPrice,
                productSalePrice: req.body.productSalePrice,
                productSKU: req.body.productSKU,
                productType: req.body.productType,
                stockStatus: req.body.stockStatus,
                productImage: req.body.productImage,
                storeId:req.body.storeId
            }

            productServices.createProduct(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "Success",
                        data: results
                    });
                }
            });
        }
    });
}

exports.findAll = (req, res, next) => {
    var model = {
        productName: req.query.productName,
        categoryId: req.query.categoryId,
        pageSize: req.query.pageSize,
        page: req.query.page
    };

    productServices.getProducts(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }
    });
}


exports.findOne = (req, res, next) => {
    const model = {
        productId: req.params.id,
    };

    productServices.getProductById(model, (error, result) => {
        if (error) {
            return next(error);
        } else {
            const response = {
                message: "Success",
                data: result
            };
            return res.status(200).send(response);
        }
    });
};



exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                productId: req.params.id,
                productName: req.body.productName,
                category: req.body.category,
                productShortDescription: req.body.productShortDescription,
                productDescription: req.body.productDescription,
                productPrice: req.body.productPrice,
                productSalePrice: req.body.productSalePrice,
                productSKU: req.body.productSKU,
                productType: req.body.productType,
                stockStatus: req.body.stockStatus,
                // productImage: path != "" ? "/" + path : ""
                productImage: req.body.productImage,
                storeId:req.body.storeId
            }

            productServices.updateProduct(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "Success",
                        data: results
                    });
                }
            });
        }
    });
}


exports.delete = (req, res, next) => {
    var model = {
        productId: req.params.id,
    };

    productServices.deleteProduct(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "Success",
                data: results
            });
        }
    });
}

exports.searchProduct = async (req, res, next) => {
    try {
        const keyword = req.query;
        const products = await productServices.searchProducts(keyword);

        return res.status(200).send({
            message: "Success",
            data: products,
        });
    } catch (error) {
        return next(error);
    }
};
exports.rateProduct = (req, res, next) => {
    const { productId, rating } = req.body;
    const userId = req.user._id;
  
    productServices.rateProduct(productId, userId, rating)
      .then((product) => {
        res.status(200).send({
          message: "Rating updated successfully",
          data: product,
        });
      })
      .catch((error) => {
        next(error);
      });
  };


  exports.getProductByStoreId = async (req, res, next) => {
    try {
      const id = req.params.storeId
      const message = "Success";
      const products = await productServices.getProductsByStoreId(id, message);
      return res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  };
  
  