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

            var model = {
                storeName: req.body.Storename,
                //StoreImage: path != "" ? "/" + path : "",
                storeImage: req.body.StoreImage,
                //Banner: path != "" ? "/" + path : "",
                banner: req.body.Banner,
                phone: req.body.phone,
                storeDescription: req.body.StoreDescription,
                storeShortDescription: req.body.StoreShortDescription,
                storeStatus: req.body.Store_status,
                user: req.body.user,

            }

            // check if storename already exists
            storeServices.getStore({ Storename: req.body.Storename }, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    if (results.length > 0) {
                        // storename already exists
                        return res.status(400).send({
                            message: "Storename already exists"
                        });
                    } else {
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
                storeName: req.body.Storename,
                //StoreImage: path != "" ? "/" + path : "",
                storeImage: req.body.StoreImage,
                //Banner: path != "" ? "/" + path : "",
                banner: req.body.Banner,
                phone: req.body.phone,
                storeDescription: req.body.StoreDescription,
                storeShortDescription: req.body.StoreShortDescription,
                storeStatus: req.body.Store_status,
                user: req.body.user,
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