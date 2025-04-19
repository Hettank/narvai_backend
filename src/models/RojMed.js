import mongoose, { Schema } from "mongoose";
import ExpenseItemSchema from "./ExpenseItem.js";

const rojmedSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expenseFromBelow: [ExpenseItemSchema], // Use the schema here
    expenseFromAbove: [ExpenseItemSchema], // Use the schema here
    totalBelow: {
        type: Number,
        default: 0
    },
    totalAbove: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

rojmedSchema.index({ userId: 1, date: 1 }, { unique: true });

// Middleware to update totals before saving
rojmedSchema.pre('save', function(next) {
  // Calculate totalBelow
  this.totalBelow = this.expenseFromBelow.reduce((sum, item) => sum + item.price, 0);

  // Calculate totalAbove
  this.totalAbove = this.expenseFromAbove.reduce((sum, item) => sum + item.price, 0);

  // Calculate grandTotal
  this.grandTotal = this.totalBelow + this.totalAbove;

  // Update the updatedAt timestamp
  this.updatedAt = Date.now();

  next();
});

const RojMed = mongoose.model("Rojmed", rojmedSchema)

export default RojMed