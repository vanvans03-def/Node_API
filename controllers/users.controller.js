const userService = require("../services/users.service");

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