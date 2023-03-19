const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: [true, "Please Provide Product Id"],
		},
		supplier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Supplier",
			// required: [true, "Please Provide Supplier Id"],
			default: null,
		},
		branch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Branch",
			// required: [true, "Please Provide Branch Id"],
			default: null,
		},
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
 *   ItemUpdate:
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
