const orderModel = require('../model/order');
const cartModel = require('../model/cartItem');
const productModel = require('../model/product');


exports.placeOrder = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const cartItems = await cartModel.find({ userId });
        const orderItems = [];

        let total = 0;

        for (const item of cartItems) {
            const product = await productModel.findById(item.productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            });
        }

        const newOrder = await orderModel.create({
            userId,
            items: orderItems,
            total,
            status: "pending",
            createdAt: new Date(),
        });

       await cartModel.deleteMany({ userId });
       
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};



exports.getAllOrdersAdmin = async (req, res) => {
    try {
      const orders = await orderModel.find().populate('items.productId');
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  };



  exports.getUserOrders = async (req, res) => {
    try {
      const userId = req.auth.userId;
      const orders = await orderModel.find({ userId }).populate('items.productId');
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user.' });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  };
  

  exports.getUserOrderById = async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.auth.userId;
  
      const order = await orderModel.findOne({ _id: orderId, userId }).populate('items.productId');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  };
  
  
  exports.updateOrderStatus = async (req, res) => {
    try {
      const orderId = req.params._id;
      const { status } = req.body;
  
      const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  };