const { province} = require('../models/province_thai.model');
const { MONGO_DB_CONFIG } = require("../config/app.config");

async function getProvince(params, callback) {

    try {
      const provinces = await province.find({})
      
      
      return callback(null, provinces);
    } catch (error) {
      return callback(error);
    }
  }
  

module.exports = { getProvince };
