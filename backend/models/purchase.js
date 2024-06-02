const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    QuantityPurchased: {
      type: Number,
    },
    PurchaseDate: {
      type: String,
    },
    TotalPurchaseAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("purchase", PurchaseSchema);
module.exports = Purchase;
