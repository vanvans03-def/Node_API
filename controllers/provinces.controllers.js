const provinceService = require('../services/province.service');

exports.findAll = (req, res, next) => {
  const model = {
    ProvinceThai: req.query.ProvinceThai,
    pageSize: req.query.pageSize,
    page: req.query.page,
  };

  provinceService.getProvince(model, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).send({
      message: 'Success',
      data: results,
    });
  });
};


exports.getProvinceNearMe = async (req, res, next) => {
  try {
    const data = req.body;
  
    const provinces = await provinceService.getProvinceNearMe(data);
    res.json(provinces);
  } catch (e) {
    next(e);
  }
}
