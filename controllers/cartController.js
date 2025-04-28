const cartModel = require('../model/cartItem')


exports.addOrUpdateCartItem = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.auth.userId;
  
      const existingItem = await cartModel.findOne({ userId, productId });
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        return res.status(200).json({ message: "Cart item updated", item: existingItem });
      }

    const data = { userId, productId,quantity}
    const newItem = await cartModel.create(data);


      res.status(201).json({ message: "Cart item added", item: newItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to add/update cart item" });
    }
  };


exports.getCart = async (req, res) => {
    try {
      const userId = req.auth.userId;
      const items = await cartModel.find({ userId }).populate("productId");
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const userId = req.auth.userId;
  
      await cartModel.findOneAndDelete({ _id: itemId, userId });
      res.status(200).json({ message: "Cart item deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cart item" });
    }
};

exports.clearCart = async (req, res) => {
    try {
      const userId = req.auth.userId;
      await cartModel.deleteMany({ userId });
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  };
  