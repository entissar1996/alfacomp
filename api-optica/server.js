const express = require("express");
const cors = require("cors");
const Calculator=require('./services/calculator');
const productController=require('./controllers/productController');
const app = express();

app.use(cors());

app.use("/product",productController);
//app.use("/users",userController);
//app.use("/order",orderController);


app.listen(80, function () {
  console.log("web server listening on port 80");
});
