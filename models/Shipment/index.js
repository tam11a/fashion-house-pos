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
		weightCost: {
			type: Number,
			required: [true, "Please Provide Shipment Cost"], // If Required
		},
		buyingPrice: {
			type: Number,
			required: [true, "Please Provide Buying Price"], // If Required
		},
		buyingDiscount: {
			type: Number,
			default: 0,
		},
		supplierCommision: {
			type: Number,
			required: [true, "Please Provide Supplier Commision"], // If Required
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
 *        - product
 *        - quantity
 *        - weight
 *        - weightCost
 *        - buyingPrice
 *        - supplierCommision
 *     properties:
 *       supplier:
 *         type: string
 *       product:
 *         type: string
 *       quantity:
 *         type: number
 *       weight:
 *         type: number
 *       weightCost:
 *         type: number
 *       buyingPrice:
 *         type: number
 *       buyingDiscount:
 *         type: number
 *       supplierCommision:
 *         type: number
 *       stitch:
 *         type: object
 *         required:
 *           - fee
 *           - size
 *         properties:
 *           fee:
 *             type: number
 *           size:
 *             type: string
 */
