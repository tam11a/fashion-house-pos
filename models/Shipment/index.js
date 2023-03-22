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

shipmentSchema.virtual("quantity", {
	ref: "Item",
	localField: "_id",
	foreignField: "shipment",
	count: true,
});

shipmentSchema.pre(/^find/, async function () {
	this.populate("quantity");
});

shipmentSchema.set("toObject", { virtuals: true });
shipmentSchema.set("toJSON", { virtuals: true });

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;

/**
 * @swagger
 * components:
 *  schemas:
 *   Shipment:
 *     type: object
 *     required:
 *        - weight
 *        - buyingPrice
 *        - shipmentCost
 *        - supplierCommision
 *        - sellPrice
 *        - product
 *        - quantity
 *     properties:
 *       supplier:
 *         type: string
 *       weight:
 *         type: number
 *       buyingPrice:
 *         type: number
 *       shipmentCost:
 *         type: number
 *       supplierCommision:
 *         type: number
 *       sellPrice:
 *         type: number
 *       tax:
 *         type: number
 *       product:
 *         type: string
 *       quantity:
 *         type: number
 */
