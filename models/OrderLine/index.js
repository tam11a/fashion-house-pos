const mongoose = require("mongoose");

var orderlineSchema = new mongoose.Schema({
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: [true, "Please Provide Order Id"],
	},
	sellPrice: {
		type: Number,
		required: [true, "Please Provide Product Sell Price"], // If Required
		default: 0,
	},
	discount: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Discount",
		default: null,
	},
});

// orderlineSchema.virtual("review", {
// 	ref: "Review",
// 	localField: "_id",
// 	foreignField: "orderline",
// 	justOne: true,
// });

orderlineSchema.set("toObject", { virtuals: true });
orderlineSchema.set("toJSON", { virtuals: true });

const OrderLine = mongoose.model("OrderLine", orderlineSchema);
module.exports = OrderLine;
