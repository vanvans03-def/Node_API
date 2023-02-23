const registerstoreServices = require("../services/registerstore.service");
const upload = require("../middleware/registerstore.upload");

exports.create = (req, res, next) => {
    upload(req, res, function (err){
        if (err) {
            next(err);
        }
        else {
            const path = 
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                Storename: req.body.Storename,
                StoreImage: path != "" ? "/" + path : "",
                //StoreImage: req.body.StoreImage,
                //Banner: path != "" ? "/" + path : "",
                Banner: req.body.Banner,                
                StoreDescription: req.body.StoreDescription,
                StoreShortDescription: req.body.StoreShortDescription,
                Store_status: req.body.Store_status
            }    
            
            registerstoreServices.createStore(model, (error, results) => {
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
        Storename: req.body.Storename,
        StoreImage: path != "" ? "/" + path : "",
        //StoreImage: req.body.StoreImage,
        Banner: req.body.Banner,
        //Banner: req.body.Banner,                
        StoreDescription: req.body.StoreDescription,
        StoreShortDescription: req.body.StoreShortDescription,
        Store_status: req.body.Store_status
    };

    registerstoreServices.getStore(model, (error, results) => {
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
        storeId: req.params.id,
    };

    registerstoreServices.getStoreById(model, (error, results) => {
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


 exports.update = (req, res, next) => {
    upload(req, res, function (err){
        if (err) {
            next(err);
        }
        else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            
            var model = {
                Storename: req.body.Storename,
                StoreImage: path != "" ? "/" + path : "",
                //StoreImage: req.body.StoreImage,
                //anner: path != "" ? "/" + path : "",
                Banner: req.body.Banner,                
                StoreDescription: req.body.StoreDescription,
                StoreShortDescription: req.body.StoreShortDescription,
                Store_status: req.body.Store_status
            }    
            
            registerstoreServices.updateStore(model, (error, results) => {
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
        storeId: req.params.id,
    };

    registerstoreServices.deleteStore(model, (error, results) => {
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