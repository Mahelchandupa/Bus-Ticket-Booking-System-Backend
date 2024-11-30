const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  transactionReference: {
    type: String,
    unique: true,
  },
  metadata: {
    type: Map,
    of: String,
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
