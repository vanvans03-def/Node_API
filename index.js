const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
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
      console.log("Database can't be connected: " + error);
    }
  );

app.get("/hello-world", (req, res) => {
  res.json({
    hi: "hello world123",
    des: "des",
  });
});

app.use(express.json());


var clients = {};
const { chatModel } = require('./models/chat.model');
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });

  socket.on("message", async (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    if (clients[targetId]) {
      // ส่งข้อความให้ผู้ใช้งานอีกฝั่งที่เข้าร่วมห้องแชท
      clients[targetId].emit("message", msg);

      // บันทึกประวัติแชทลงในฐานข้อมูล
      const chat = new chatModel({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message
      });
    
      await chat.save();
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/app.routes"));
app.use(errors.errorHadler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const apiPort = 4000;
const socketIOPort = 5000;

server.listen(apiPort, "0.0.0.0", () => {
  console.log(`API service running on port ${apiPort}`);
});

io.listen(socketIOPort, () => {
  console.log(`Socket.IO service running on port ${socketIOPort}`);
});



const fruits = ["P13001", "P13002", "P13003", "P13004", "P13005", "P13006", "P13007", "P13008", "P13009", "P13010", "P13011", "P13012", "P13013", "P13014", "P13015", "P13016", "P13017", "P13018", "P13019", "P13020", "P13021", "P13022", "P13023", "P13024", "P13025", "P13026", "P13027", "P13028", "P13029", "P13030", "P13031", "P13032", "P13033", "P13034", "P13035", "P13036", "P13037", "P13038", "P13039", "P13040", "P13041", "P13042", "P13043", "P13044", "P13045", "P13046", "P13047", "P13048", "P13049", "P13050", "P13051", "P13052", "P13053", "P13054", "P13055", "P13056", "P13057", "P13058", "P13059", "P13060", "P13061", "P13062", "P13063", "P13064", "P13065", "P13066", "P13067", "P13068", "P13069", "P13070", "P13071", "P13072", "P13073", "P13074", "P13075", "P13076", "P13077", "P13078", "P13079", "P13080", "P13081", "P13082", "P13083", "P13084", "P13085", "P13086", "P13087", "P13088", "P13089", "P13090", "P13091", "P13092", "P14001", "P14002", "P14003", "P14004", "P14005", "P14006", "P14007", "P14008", "P14009", "P14010", "P14011", "P14012", "P14013", "P14014", "P14015", "P14016", "P14017", "P14018", "P14019", "P14020", "P14021", "P14022", "P14023", "P14024", "P14025", "P14026", "P14027", "P14028", "P14029", "P14030", "P14031", "P14032", "P14033", "P14034", "P14035", "P14036", "P14037", "P14038", "P14039", "P14040", "P14041", "P14042", "P14043", "P14044", "P14045", "P14046", "P15001", "P15002", "P15003", "P15004", "P15005", "P15006", "P15007", "P15008", "P15009", "P15010", "P15011", "P15012", "P15013", "P15014", "P15015", "P15016", "P15017", "P15018", "P15019", "P15020", "P15021", "P15022", "P15023", "P15024", "P15025", "P15026", "P15027", "P15028", "P15029", "P15030", "P15031", "P15032", "P15033", "P15034", "P15035", "P15036", "P15037", "P15038", "P15039", "P15040", "P15041", "P15042", "P15043", "P15044", "P16001", "P16002", "P16003", "P16004", "P16005", "P16006", "P16007", "P16008", "P16009", "P16010", "P16011", "P16012", "P16013", "P16014", "P16015", "P16016", "P16017", "P16018", "P16019", "P16020", "P16021", "P16022", "P16023", "P16024", "P16025", "P16026", "P16027", "P16028", "R11001", "R11002", "R11003", "R11004", "R11005", "R11006", "R11007", "R11008", "R11009", "R11010", "R11011", "R11012", "R11013", "R11014", "R11015", "R11016", "R11017", "R11018", "R11019", "R11020", "R11021", "R11022", "R11023", "R11024", "R11025", "R11026", "R11027", "R11028", "R11029", "R11030", "R11031", "R11032", "R11033", "R11034", "R11035", "R11036", "R11037", "R11038", "R11039", "R11040", "R11041", "R11042", "R11043", "R11044", "R11045", "R11046", "R11047", "R11048", "R11049", "R11050", "R11051", "R11052", "R11053", "R11054", "R12001", "R12002", "R12003", "R12004", "R12005", "R12006", "R12007", "R12008", "R12009", "R12010", "R13001", "R13002", "R13003", "R13004", "R13005", "R13006", "R13007", "R13008", "R13009", "R13010", "W13001", "W13002", "W13003", "W13004", "W13005", "W13006", "W13007", "W13008", "W13009", "W13010", "W13011", "W13012", "W13013", "W13014", "W13015", "W13016", "W13017", "W13018", "W13019", "W13020", "W13021", "W13022", "W13023", "W13024", "W13025", "W13026", "W13027", "W13028", "W13029", "W13030", "W13031", "W14001", "W14002", "W14003", "W14004", "W14005", "W14006", "W14007", "W14008", "W14009", "W14010", "W14011", "W14012", "W14013", "W14014", "W14015", "W14016", "W14017", "W14018", "W14019", "W14020", "W14021", "W14022", "W14023", "W14024", "W14025", "W14026", "W14027", "W14028", "W14029", "W14030", "W14031", "W14032", "W14033", "W14034", "W14035", "W14036", "W15001", "W15002", "W15003", "W15004", "W15005", "W15006", "W15007", "W15008", "W15009", "W15010", "W15011", "W15012", "W15013", "W15014", "W15015", "W15016", "W15017", "W15018", "W15019", "W15020", "W15021", "W15022", "W15023", "W15024", "W15025", "W15026", "W15027", "W15028", "W15029", "W15030", "W15031", "W15032", "W15033", "W15034", "W15035", "W15036", "W15037", "W15038", "W15039", "W15040", "W15041", "W15042", "W15043", "W15044", "W15045", "W15046", "W16001", "W16002", "W16003", "W16004", "W16005", "W16006", "W16007", "W16008", "W16009", "W16010", "W16011", "W16012", "W16013", "W16014", "W16015", "W16016", "W16017", "W16018", "W16019", "W16020", "W16021", "W16022", "W16023", "W16024", "W16025", "W16026", "W16027", "W16028", "W16029", "W16030", "W16031", "W16032", "W16033", "W16034", "W16035", "W16036", "W16037", "W16038", "W16039", "W16040", "W18001", "W18002", "W18003", "W18004", "W18005", "W18006", "W18007", "W18008", "W18009", "W18010", "W18011", "W18012", "W18013", "W18014", "W18015", "W18016", "W18017", "W18018", "W18019", "W18020", "W18021", "W18022", "W18023", "W18024", "W18025", "W18026", "W18027", "W18028", "W18029", "W18030", "W18031", "W18032", "W18033", "W18034", "W18035", "W18036", "W18037", "W18038", "W18039", "W18040", "W18041", "W18042", "W18043", "W18044", "W18045", "W18046", "W18047", "W18048", "W18049", "W18050", "W18051", "W18052", "W18053", "W18054", "W18055", "W18056", "W18057", "W18058", "W18059", "W18060", "W18061", "W18062", "W18063", "W18064", "W18065", "W18066", "W18067", "W18068", "W18069", "W18070", "W18071", "W18072", "W18073", "W18074", "W18075", "W18076", "W18077", "W18078", "W18079", "W18080", "W18081", "W18082", "W18083", "W18084", "W18085", "W18086", "W18087", "W18088", "W18089", "W18090", "W18091", "W18092", "W18093", "W18094", "W18095", "W18096", "W18097", "W18098", "W18099", "W18100", "W18101", "W18102", "W18103", "W18104", "W18105"];
const axios = require('axios');
const { ProductPrice } = require('./models/productprice.model');

let currentDate = new Date();
let yesterday = new Date(currentDate);
yesterday.setDate(yesterday.getDate() - 1);

let formattedyesterday = yesterday.toISOString().split('T')[0];
console.log(formattedyesterday);

async function fetchDataAndSaveAll() {
  try {
    for (let i = 0; i < fruits.length; i++) {
      try {
        const response = await axios.get(
          `https://dataapi.moc.go.th/gis-product-prices?product_id=${fruits[i]}&from_date=${formattedyesterday}&to_date=${formattedyesterday}`
        );

        const { product_id, product_name, category_name, group_name, unit, price_list } = response.data;

        if (Array.isArray(price_list)) {
          for (const { date, price_min, price_max } of price_list) {
            const productprice = new ProductPrice({
              productId: product_id,
              productName: product_name,
              categoryName: category_name,
              groupName: group_name,
              unit,
              date: new Date(date),
              priceMin: price_min,
              priceMax: price_max,
            });
            await productprice.save();
          }
          console.log('Data saved successfully');
        } else {
          console.error('Invalid price_list data:', price_list);
        }
      } catch (error) {
        console.error('Error saving data', error);
      }
    }
  } catch (error) {
    console.error('Error saving data', error);
  }
}

async function checkApiAvailability() {
  try {
    const response = await axios.get(
      `https://dataapi.moc.go.th/gis-product-prices?product_id=${fruits[0]}&from_date=${formattedyesterday}&to_date=${formattedyesterday}`
    );

    if (response.status === 200) {
      console.log('API is available');
      return true;
    }
  } catch (error) {
    console.error('API is not available', error);
  }
  return false;
}
// รอให้ fetchDataAndSaveAll() เสร็จสิ้นก่อนที่จะลบข้อมูล
async function runCronJob() {
  try {
    const isApiAvailable = await checkApiAvailability();

    if (isApiAvailable) {
      await fetchDataAndSaveAll();
      console.log('Data fetching and saving complete');
    
    } else {
      console.error('Cannot fetch data. API is not available');
    }
  } catch (error) {
    console.error('Error fetching and saving data', error);
  }
}

// เรียกใช้งานฟังก์ชัน runCronJob()
runCronJob();
