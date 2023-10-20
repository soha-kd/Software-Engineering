const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "لطفا نام محصول را اضافه کنید"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "لطفا دسته بندی محصول را وارد کنید"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "لطفا تعداد محصول را وارد کنید"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "لطفا قیمت محصول را وارد کنید"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "لطفا توضیحات را وارد کنید"],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;