const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
	{
		invoice: {
			type: String,
			unique: [true, "Invoice ID exists, Please try again"],
		},
		branch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Branch",
			required: [true, "Please Provide Branch Id"],
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
			required: [true, "Please Provide Customer Id"],
		},
		type: {
			type: String,
			enum: {
				values: ["online", "offline"],
				message: "{VALUE} is not supported as order type",
			},
			default: "offline",
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
						values: ["COD", "Card", "Cash", "bKash", "Nagad", "Rocket"],
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
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true, id: false }
);

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
 *        - invoice
 *        - branch
 *        - customer
 *        - type
 *        - products
 *        - transactions
 *     properties:
 *       invoice:
 *         type: string
 *       branch:
 *         type: string
 *       customer:
 *         type: string
 *       tailor:
 *         type: string
 *       type:
 *         type: string
 *         enum: [online, offline]
 *       products:
 *         type: array
 *         items:
 *           properties:
 *             id:
 *               type: string
 *             price:
 *               type: number
 *             stitch:
 *               type: object
 *               properties:
 *                 size:
 *                   type: string
 *                 fee:
 *                   type: number
 *       transactions:
 *         type: object
 *         properties:
 *           method:
 *             type: string
 *             enum: [Cash, Card, bKash, Nagad, Rocket, COD]
 *           paid:
 *             type: number
 *       discount:
 *         type: number
 *
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Transaction:
 *     type: object
 *     required:
 *        - amount
 *        - method
 *     properties:
 *       amount:
 *         type: number
 *       method:
 *         type: string
 *         enum: [Cash, Card, bKash, Nagad, Rocket, COD]
 *
 */
