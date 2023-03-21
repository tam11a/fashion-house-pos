const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
	{
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
			required: [true, "Please Provide Customer Id"],
		},
		coupon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Coupon",
			// required: [true, "Please Provide Coupon Id"], // If Required
			default: null,
		},
		discount: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			required: [true, "Please Provide Price"], // If Required
			default: 0,
		},
		transaction: [
			{
				amount: {
					type: Number,
					default: 0,
				},
				method: {
					type: String,
					required: [true, "Please Provide Payment Method"], // If Required
					enum: {
						values: ["COD", "Card", "Cash", "bKash"],
						message: "{VALUE} is not supported as payment method",
					},
					default: "Cash",
				},
				receivedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Admin",
					required: [true, "Please Provide Receiver Id"],
				},
				receivedAt: {
					type: Date,
					required: [true, "Please Provide Received Time"],
				},
			},
		],
	},
	{ timestamps: true, id: false }
);

// orderSchema.virtual("products", {
//     ref: "OrderLine",
//     localField: "_id",
//     foreignField: "order",
// });

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

/**
 * @swagger
 * components:
 *  schemas:
 *   Order:
 *     type: object
 *     required:
 *        - paymentMethod
 *     properties:
 *       paymentMethod:
 *         type: string
 *         enum: [Cash]
 *
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   OrderCreate:
 *     type: object
 *     properties:
 *
 *
 */
