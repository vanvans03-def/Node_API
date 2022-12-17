const sliderService = require("../services/sliders.service");
const upload = require("../middleware/slider.upload");

exports.create = (req, res, next)=> {
    upload(req, res, function(err){
        if(err) {
            next(err);
        }
        else{
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model ={
                sliderName: req.body.sliderName,
                sliderDescription: req.body.sliderDescription,
                sliderImage: path != "" ? "/" + path : ""
            };

            sliderService.createSlider(model, (error, result)=> {
                if (error) {
                    return next(error);
                }
                return res.status(200).send({
                    message: "Success",
                    data: result
                });
            });
        }
    })
};

exports.findAll = (req, res, next) => {
    var model ={
        sliderName: req.query.sliderName,
        pageSize: req.query.pageSize, 
        page: req.query.page
    };

    sliderService.getSliders(model, (error, result) => {
        if (error) {    
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
};

exports.findOne = (req, res, next) => {
    var model ={
        sliderId: req.params.id,
    };

    sliderService.getSliderByID(model, (error, result) => {
        if (error) {    
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
};

exports.update = (req, res, next)=> {
    upload(req, res, function (err){
        if (err) {
            next(err);
        }
        else{
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model ={
                sliderId: req.params.id,
                sliderName: req.body.sliderName,
                sliderDescription: req.body.sliderDescription,
                sliderImage: path != "" ? "/" + path : ""
            };

            sliderService.updateSlider(model, (error, result)=> {
                if (error) {
                    return next(error);
                }
                return res.status(200).send({
                    message: "Success",
                    data: result
                });
            });
        }
    })
};

exports.delete = (req, res, next) => {
    var model ={
        sliderId: req.params.id,
    };

    sliderService.deleteSlider(model, (error, result) => {
        if (error) {    
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: result
        });
    });
};
