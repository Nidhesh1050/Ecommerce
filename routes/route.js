var express = require("express");
var router = express.Router();
const storeController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")

require("dotenv").config();
const authenticateToken = require('../utils/helperFunction')
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });


// User controller
router.post("/register", storeController.register);
router.post("/login", storeController.login);
router.get("/profile", storeController.profile);


// Product controller
router.post("/products", authenticateToken, upload.single("images"), productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/:_id", productController.getProductById);
router.put("/products/:_id", authenticateToken, upload.single("images"), productController.updateProduct);
router.delete("/products/:_id", authenticateToken, productController.deleteProduct);


// Cart Controller
router.get("/cart", authenticateToken, cartController.getCart);
router.post("/cart", authenticateToken, cartController.addOrUpdateCartItem);
router.delete("/cart/:itemId", authenticateToken, cartController.removeCartItem);
router.delete("/cart", authenticateToken, cartController.clearCart);

// Order Controller
router.post("/orders", authenticateToken, orderController.placeOrder);
router.get('/orders', authenticateToken, orderController.getUserOrders);
router.get('/orders/:id', authenticateToken, orderController.getUserOrderById);
router.get('/admin/orders', authenticateToken, orderController.getAllOrdersAdmin);
router.put('/admin/orders/:_id', authenticateToken, orderController.updateOrderStatus);



module.exports = router;