const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: [true, "Please Provide Product Id"],
		},
		// supplier: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Supplier",
		// 	// required: [true, "Please Provide Supplier Id"],
		// 	default: null,
		// },
		shipment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shipment",
			required: [true, "Please Provide Shipment Id"],
			default: null,
		},
		branch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Branch",
			// required: [true, "Please Provide Branch Id"],
			default: null,
		},
		orderLine: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "OrderLine",
			// required: [true, "Please Provide Oderline Id"],
			default: null,
		},
		stitch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Stitch",
			// required: [true, "Please Provide Stitch Id"],
			default: null,
		},
		otherCosts: [
			{
				amount: {
					type: Number,
					default: 0
				},
				reason: {
					type: String,
					default: null
				},
				createdBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Admin",
					default: null,
					select: false,
				},
				createdAt: {
					type: Date,
					default: null,
				},
			}
		]
	},
	{ timestamps: true, id: false }
);

itemSchema.set("toObject", { virtuals: true });
itemSchema.set("toJSON", { virtuals: true });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;

/**
 * @swagger
 * components:
 *  schemas:
 *   Item:
 *     type: object
 *     required:
 *        - product
 *     properties:
 *       product:
 *         type: string
 *         description: product id
 *       shipment:
 *         type: string
 *         description: product id
 *       branch:
 *         type: string
 *       orderLine:
 *         type: string
 *       stitch:
 *         type: string
 *       otherCosts:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   ItemUpdate:
 *     type: object
 *     properties:
 *       product:
 *         type: string
 *         description: product id
 *       shipment:
 *         type: string
 *       branch:
 *         type: string
 *       orderLine:
 *         type: string
 *       stitch:
 *         type: string
 *       otherCosts:
 *         type: string
 */


// product:
//  *         type: string
//  *         description: product id
//  *       shipment:
//  *         type: string
//  *         description: shipment id
//  *       branch:
//  *         type: string
//  *         description: branch id
//  *       orderLine:
//  *         type: string
//  *         description: orderLine id
//  *       stitch:
//  *         type: string
//  *         description: stitch id
//  *       otherCosts:
//  *         type: string
//  *         description: otherCosts id
