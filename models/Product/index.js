const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Provide a Name"], // If Required
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: null,
		},
		price: {
			type: Number,
			default: 0,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "Please Provide Category Id"],
		},
		subcategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subcategory",
			required: [true, "Please Provide Subcategory Id"],
		},
	},
	{ timestamps: true, id: false }
);

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     required:
 *        - name
 *        - category
 *        - subcategory
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 *       subcategory:
 *         type: string
 *       price:
 *         type: number
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 *       subcategory:
 *         type: string
 *       price:
 *         type: number
 */
