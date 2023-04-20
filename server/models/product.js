const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review : String,
    sentiment : String
});

const productSchema = new mongoose.Schema({
    productID : String,
    reviews : [reviewSchema]
});

const Product = mongoose.model("Product" , productSchema);

module.exports = Product;