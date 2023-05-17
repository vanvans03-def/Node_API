const { store } = require("../models/store.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");
const { param } = require("../routes/app.routes");
const { user } = require("../models/user.model");

const mongoose = require("mongoose");


async function createStore(params, callback) {

    if (!params.storeName) {
      return callback({
        message: "Store Name required",
      }, "");
    }
    if (!params.province) {
      return callback({
        message: "Province is required",
      }, "");
    }
  
    const userModel = await user.findById(params.user);
  
    if (userModel.type !== "merchant") {
      return callback({
        message: 'Error Only "merchant" can create store',
      });
    }
  
    const existingStore = await store.findOne({ user: params.user });
  
    if (existingStore) {
      return callback({
        message: "Error User already has a store",
      });
    }
  
    const storeModel = new store(params);
  
    storeModel.save()
      .then((response) => {
        return callback(null, response);
      })
      .catch((error) => {
        return callback(error);
      });
  }
  

async function getStore(params, callback) {
    const Storename = params.storeName;
    var condition = {};

    if (Storename) {
        condition["Storename"] = {
            $regex: new RegExp(Storename), $options: "i"
        };
    }

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    store
    .find(condition, "storeName storeImage banner phone storeDescription storeShortDescription storeStatus user province")
    .limit(perPage)
    .skip(perPage * page)
    .then((response) => {
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function getStoreById(params, callback) {
    const storeId = params.storeId;
    
    store
    .findById(storeId)
    .then((response) =>{
        return callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function updateStore(params, callback) {
    const storeId = params.storeId;
   
    store
    .findByIdAndUpdate(storeId, params, {new: true, useFindAndModify: false})
    .then((response) => {
        if(!response) callback('Cannot update Store with id ' + storeId)
        else callback(null,response);
    })
    .catch((error) => {
        return callback(error);
    });
}



async function deleteStore(params, callback) {
    const storeId = params.storeId;
    
    store
    .findByIdAndRemove(storeId)
    .then((response) => {
        if(!response) {
        callback(`Cannot update Store with id ${storeId}`)
        }
        else callback(null, response);
    })
    .catch((error) => {
        return callback(error);
    });
}

async function getStoreByuserId(id, message) {
  try {      

    const userId = mongoose.Types.ObjectId(id)
    let stores = await store.find({ user: userId })
      .select('-__v ')
    if (stores.length === 0) {
      return { message: 'Store not found', data: null };
    }
    return { message: message, data: stores };
  } catch (e) {
    return { message: 'Store not found', data: null };
  }
}


  

module.exports = {
    createStore,
    getStore,
    getStoreById,
    updateStore,
    deleteStore,
    getStoreByuserId
}