const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      
    },
    name: {
      type: String,
     
    },
    HSN: {
      type: String,
      
    },
    stock: {
      type: Number,
      
    },
    description: String,
  },
  { timestamps: true }
);


const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
