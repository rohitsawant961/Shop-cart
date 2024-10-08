const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));  // Enable CORS for the front-end

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Product schema and model
const productSchema = new mongoose.Schema({
    productID: String,
    productName: String,
    productPrice: Number,
});

const Product = mongoose.model('Product', productSchema);

// Add to cart route
app.post('/add-to-cart', async (req, res) => {
    try {
        const products = req.body.products;

        // Insert products into the database
        await Product.insertMany(products);

        res.status(200).send('Products added to cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding products to cart');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
