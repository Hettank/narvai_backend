import mongoose from "mongoose";

const ExpenseItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    _id: true,
    timestamps: true
});

export default ExpenseItemSchema;