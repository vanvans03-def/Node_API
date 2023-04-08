const productpriceService = require("../services/productprice.service");

exports.create = (req, res, next) => {
    productUpload(req, res, function (err) {
        if(err){
            next(err);
        }else{
            const path = req.file != undefined ? req.file.path.replace(/\\/g,"/") : " ";
        
            var model = {
                productId: req.body.productId,
                productName: req.body.productName,
                categoryName: req.body.categoryName,
                groupName: req.body.groupName,
                unit:req.body.unit,
                date:req.body.date,
                priceMin: req.body.price_min,
                priceMax: req.body.price_max,

            }
            productpriceService.createProductPrice(model, (error, results) => {
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
                productId: req.query.productId,
                productName: req.query.productName,
                categoryName: req.query.categoryName,
                groupName: req.query.groupName,
                unit:req.query.unit,
                date:req.query.date,
                priceMin: req.query.price_min,
                priceMax: req.query.price_max,
    };

    productpriceService.getProductPrice(model, (error, results) => {
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
    var model = {
        productId: req.params.id,
    };

    productpriceService.getProductPriceById(model, (error, results) => {
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
