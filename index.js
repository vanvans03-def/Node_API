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