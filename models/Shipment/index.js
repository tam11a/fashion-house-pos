const mongoose = require("mongoose");

var shipmentSchema = new mongoose.Schema(
	{
		supplier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Supplier",
			default: null,
		},
		weight: {
			type: Number,
			required: [true, "Please Provide Weight"], // If Required
		},
		buyingPrice: {
			type: Number,
			required: [true, "Please Provide Buying Price"], // If Required
		},
		shipmentCost: {
			type: Number,
			required: [true, "Please Provide Shipment Cost"], // If Required
		},
		supplierCommision: {
			type: Number,
			required: [true, "Please Provide Supplier Commision"], // If Required
		},
		sellPrice: {
			type: Number,
			required: [true, "Please Provide Sell Price"], // If Required
		},
		tax: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, id: false }
);

shipmentSchema.set("toObject", { virtuals: true });
shipmentSchema.set("toJSON", { virtuals: true });

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;
