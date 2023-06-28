const { province } = require('../models/province_thai.model');
const { MONGO_DB_CONFIG } = require("../config/app.config");

async function getProvince(params, callback) {

  try {
    const provinces = await province.find({})

    return callback(null, provinces);
  } catch (error) {
    return callback(error);
  }
}

async function getProvinceNearMe(data) {
  try {
    const { provinceThai, type } = data;

    check = type;
    let provinces = await province.find({ "ProvinceThai": provinceThai });
    if (provinces.length > 0) {
      var targetValue = provinces[0]["กรุงเทพปริมณฑลต่างจังหวัด"];
      if(check == "nearMe"){
        targetValue = provinces[0]["ภูมิภาคอย่างเป็นทางการ"]; 
        provinces = await province.find({ "ภูมิภาคอย่างเป็นทางการ": targetValue });
      }else if(check == "OnlyBKK"){
         provinces = await province.find({ "ProvinceThai": "กรุงเทพมหานคร" });
      }else if(check == "perimeter"){
        provinces = await province.find({ "กรุงเทพปริมณฑลต่างจังหวัด": "กรุงเทพมหานครและปริมณฑล" });
      }else if(check == "All"){
        provinces = await province.find({})
      }
    
    }

    return provinces;
  } catch (error) {
    throw new Error(error.message);
  }
}






module.exports = {
  getProvince,
  getProvinceNearMe
};
