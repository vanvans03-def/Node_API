const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors.js");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { category } = require("./models/category.model");

mongoose.Promise = global.Promise;

mongoose
  .connect(MONGO_DB_CONFIG.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database Connected");
    },
    (error) => {
      console.log("database can't be connected : " + error);
    }
  );

app.get("/hello-world", (req, res) => {
  res.json({
    hi: "hello world123",
    des: "des",
  });
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/app.routes"));
app.use(errors.errorHadler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.port || 4000, function () {
  console.log("Ready to go!!");
});

const axios = require("axios");
const cron = require("node-cron");
const { response } = require("express");

const productPriceSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  categoryName: String,
  groupName: String,
  unit: String,
  date: Date,
  priceMin: Number,
  priceMax: Number,
});

const ProductPrice = mongoose.model("ProductPrice", productPriceSchema);

const fruits = ["P13002", "P13004", "P13006"];
let date =  new Date();
let yesterday = new Date(date.getTime() - 86400E3);
let yesterday2 = new Date(yesterday - 86400E3);
console.log("Yesterday:", yesterday.toString());
console.log("Yesterday2:", yesterday2.toString());

let yyyy = yesterday.getFullYear();
let mm = String(yesterday.getMonth() + 1).padStart(2, '0');
let dd = String(yesterday.getDate()).padStart(2, '0');

const formattedDate = `${yyyy}-${mm}-${dd}`;
console.log(formattedDate); // outputs "2023-01-21" (for today's date)

 yyyy = yesterday2.getFullYear();
 mm = String(yesterday2.getMonth() + 1).padStart(2, '0');
 dd = String(yesterday2.getDate()).padStart(2, '0');

const formattedDate2 = `${yyyy}-${mm}-${dd}`;
console.log(formattedDate);

cron.schedule("*/1 * * * *", async () => {
  try {
    for (let i = 0; i < fruits.length; i++) {
      const response = await axios.get(
        `https://dataapi.moc.go.th/gis-product-prices?product_id=${fruits[i]}&from_date=${formattedDate2}&to_date=${formattedDate}`
      );
      const {
        product_id,
        product_name,
        category_name,
        group_name,
        unit,
        price_min_avg,
        price_max_avg,
      } = response.data;
      //for (const {date, price_min, price_max} of price_list){
      const productprice = new ProductPrice({
        productId: product_id,
        productName: product_name,
        categoryName: category_name,
        groupName: group_name,
        unit,
        date: formattedDate,
        priceMin: price_min_avg,
        priceMax: price_max_avg,
      });
      await productprice.save();
      //}
      console.log("Date saved True");
    }
  } catch (error) {
    console.error("Error saved faile", error);
  }
});
