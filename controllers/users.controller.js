const userService = require("../services/users.service");
const QRCode = require('qrcode')

exports.register = (req, res, next) => {
    userService.register(req.body, (error, results) => {
        if (error) {
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: results
        });
    });
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    userService.login({ email, password }, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        });
    });
}



exports.addToCart = async (req, res, next) => {
    try {

      const userData = req.body;
  
      const user = await userService.addToCart(userData);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };
  
  exports.removeFromCart = async (req, res, next) => {
    try {
      const userData = req.body;
      const user = await userService.removeFromCart(userData);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };


  
exports.saveAddress = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await userService.saveAddress(userData);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

  
exports.placeOrder = async (req, res, next) => {
  try {
    const orderData =req.body
    const order = await userService.placeOrder(orderData);
    res.json(order);
  } catch (e) {
    next(e);
  }
};


exports.myOrder = async (req, res, next) => {
  try {
    const id = req.params.id
  
    const orders = await userService.myOrder(id);
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.merchantOrder = async (req, res, next) => {
  try {
    const id = req.params.id
  
    const orders = await userService.merchantOrder(id);
    res.json(orders);
  } catch (e) {
    next(e);
  }
};


exports.changeStatus = async (req, res, next) => {
  try {
    const data = req.body;
    const orders = await userService.changeStatus(data);
    res.json(orders);
  } catch (e) {
    next(e);
  }
};


exports.analytics = async (req, res, next) => {
  try {
    const data = req.body;
    const orders = await userService.analytics(data);
    res.json(orders);
  } catch (e) {
    next(e);
  }
};


exports.generateQR = async (req, res, next) => {
  try {
    const data = req.body;
    const payload = await userService.generateQR(data); // เรียกใช้ฟังก์ชัน generateQR
    
    const option = {
      color: {
        dark: '#000',
        light: '#fff'
      }
    };

    QRCode.toDataURL(payload, option, (err, url) => {
      if (err) {
        console.log('generate fail');
        return res.status(400).json({
          RespCode: 400,
          RespMessage: 'bad: ' + err
        });
      } else {
        return res.status(200).json({
          RespCode: 200,
          RespMessage: 'good',
          Result: url
        });
      }
    });

  } catch (e) {
    next(e);
  }
};


exports.getUserData = async (req, res, next) => {
  try {
    const id = req.params.id
  
    const users = await userService.getUserData(id);
    return res.status(200).send({
      message: "Success",
      data: users
  });
  } catch (e) {
    next(e);
  }
};
