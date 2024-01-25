const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);