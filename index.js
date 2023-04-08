const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors.js");
const swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./swagger.json");
const { category } = require('./models/category.model');

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_DB_CONFIG.DB, {
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

app.get("/hello-world",(req , res) => {
    res.json({
        hi:"hello world123",
        des:"des"
    });
})

app.use(express.json());
app.use("/uploads",express.static("uploads"));
app.use('/api', require('./routes/app.routes'));
app.use(errors.errorHadler);
app.use("/api-docs", swaggerUi.serve , swaggerUi.setup(swaggerDocument));

app.listen(process.env.port || 4000, function () {
    console.log('Ready to go!!');
});

const cron = require('node-cron');
const axios = require('axios');
const { response } = require('express');

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

const ProductPrice =  mongoose.model("ProductPrice", productPriceSchema);

const fruits = ["P13002","P13004","P13006","P13008","P13010","P13012","P13014","P13016","P13018","P13020","P13021","P13023","P13025","P13027","P13029","P13031","P13032","P13034","P13036","P13037","P13038","P13040","P13041","P13042","P13043","P13044","P13045","P13046","P13083","P13085","P13086","P13087","P13089","P13090","P13091","P14001","P14002","P14003","P14004","P14005","P14006","P14007","P14008"];
let date =  new Date();
let yesterday = new Date(Date);
yesterday.setDate(date.getDate()-1);




mongoose.connect('mongodb://localhost/mydatabase', { userNeUrlParsers: true});

for(let i = 0 ;i < fruits.length;i++){
    cron.schedule('0 0 * * *', async () => {
        try{
            for(let i = 0; i <fruits.length; i++){
            const resp =  await axios.get(
                'https://dataapi.moc.go.th/gis-product-prices?product_id=${fruits[i]}&from_date=${date}&to_date=${yesterday}');
                const { product_id, product_name, category_name, group_name, unit, price_list} = response.data;

                for (const { date, price_min, price_max } of price_list){
                const productprice = new ProductPrice({
                    productId: product_id,
                    productName: product_name,
                    categoryName: category_name,
                    groupName: group_name,
                    unit,
                    date:new Date(date),
                    priceMin: price_min,
                    priceMax: price_max,
                });
                await productprice.save();
            }
            console.log('Date saved True');
            }
            }catch(error){
                console.error('Error saved faile', error);
        }
    });
}