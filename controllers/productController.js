const { use } = require('../routes/route');
const productModel = require('../model/product')

exports.createProduct = async (req, res) => {
    const { title, description, price, stock } = req.body;
    const imagePath = req.file ? req.file.path : '';

    try {
        if (req.auth.role === 'admin') {
            const productData = await productModel.create({
                title,
                description,
                price,
                stock,
                images: imagePath,
            });

            res.status(200).json({ message: "Product save successful", product: productData });
        } else {
            res.status(404).json({ message: "Only admin save the product", product: [] });
        }

    } catch (error) {
        console.error("Product creation error:", error);
        res.status(500).json({ error: "Product not created, server error" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params._id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        if (req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can update products" });
        }

        const imagePath = req.file ? req.file.path : undefined;

        const updatedData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
        };

        if (imagePath) {
            updatedData.images = imagePath;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params._id,
            updatedData,
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        if (req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can delete products" });
        }

        const deletedProduct = await productModel.findByIdAndDelete(req.params._id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};