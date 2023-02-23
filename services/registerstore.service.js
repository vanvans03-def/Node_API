const { registerstore } = require("../models/registerstore.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");

async function createStore(params, callback) {
    if(!params.Storename) {
        return callback(
            {
                message: "Store Name required",
            },
            ""
        );
    }

    const registerstoreModel = new registerstore(params);
    registerstoreModel.save()   
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getStore(params, callback) {
    const Storename = params.Storename;
    var condition = {};

    if (Storename) {
        condition["Storename"] = {
            $regex: new RegExp(Storename), $options: "i"
        };
    }

    

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    registerstore
    .find(condition, "Storename StoreImage Banner StoreDescription StoreShortDescription Store_status")
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
    
    registerstore
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
   
    registerstore
    .findByIdAndUpdate(storeId, params, {useFindAndModify: false})
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
    
    registerstore
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

module.exports = {
    createStore,
    getStore,
    getStoreById,
    updateStore,
    deleteStore
}