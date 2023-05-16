const mongoose = require('mongoose');
const province = mongoose.model(
  "Province",mongoose.Schema({
  ProvinceID: Number,
  ProvinceThai: String,
  ProvinceEng: String,
  'ภูมิภาคอย่างเป็นทางการ': String,
  'ภูมิภาคแบบสี่ภูมิภาค': String,
  'ภูมิภาคท่องเที่ยวแห่งประเทศไทย': String,
  'กรุงเทพปริมณฑลต่างจังหวัด': String,
  'พื้นที่ ตรกม': Number,
  'ประชากรรวม62': Number,
  'ประชากรชาย62': Number,
  'ประชากรหญิง62': Number
})
);



module.exports ={province}