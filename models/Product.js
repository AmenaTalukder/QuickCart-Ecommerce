import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "user"
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    offerPrice: {
      type: Number
    },
    image: [
      {
        type: Array,
        of: String,
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
