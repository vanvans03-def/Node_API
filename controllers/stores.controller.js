const storeServices = require("../services/stores.service");
const upload = require("../middleware/registerstore.upload");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
                console.log(req.body);
            var model = {
                storeName: req.body.storeName,
                //StoreImage: path != "" ? "/" + path : "",
                storeImage: req.body.storeImage,
                //Banner: path != "" ? "/" + path : "",
                idcardImage:req.body.idcardImage,
                idcardNo:req.body.idcardNo,
                banner: req.body.banner,
                phone: req.body.phone,
                storeDescription: req.body.storeDescription,
                storeShortDescription: req.body.storeShortDescription,
                storeStatus: req.body.storeStatus,
                user: req.body.user,
                province:req.body.province

            }
            console.log(req.body.storeName);
            // check if storename already exists
            storeServices.getStore({ storeName: req.body.storeName }, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                        storeServices.createStore(model, (error, results) => {
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
    });
}


exports.findAll = (req, res, next) => {
    storeServices.getStore({}, (error, results) => {
        if (error) {
            return next(error);
        } else {
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

    storeServices.getStoreById(model, (error, results) => {
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
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                storeName: req.body.storeName,
                //StoreImage: path != "" ? "/" + path : "",
                storeImage: req.body.storeImage,
                //Banner: path != "" ? "/" + path : "",
                banner: req.body.banner,
                idcardImage:req.body.idcardImage,
                idcardNo:req.body.idcardNo,
                phone: req.body.phone,
                storeDescription: req.body.storeDescription,
                storeShortDescription: req.body.storeShortDescription,
                storeStatus: req.body.storeStatus,
                user: req.body.user,
                province:req.body.province,
                storeId:req.body.storeId,
            }

            storeServices.updateStore(model, (error, results) => {
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

    storeServices.deleteStore(model, (error, results) => {
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

exports.getStoreByuserId = async (req, res, next) => {
    try {
      const id = req.params.id
      const message = "Success";
      const data = await storeServices.getStoreByuserId(id, message);
      return res.status(200).json(data);
    } catch (e) {
      next(e);
    }
}
