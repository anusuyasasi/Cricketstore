const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"], 
  },
  info: {
    type: String,
    required: [true, "Please Enter product info"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      product_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter Product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // standard-ah "User" nu mathunga (unga User model name poruthu)
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      ratings: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      recommend: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      avatar: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // admin-ai track panna
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Convention-padi model name "Product" nu irukkarathu nallathu
module.exports = mongoose.model("Product", productSchema);