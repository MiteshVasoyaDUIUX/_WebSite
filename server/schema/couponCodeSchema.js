const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  couponcode: {
    type: String,
  },
  discount: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("couponcode", couponCodeSchema);
