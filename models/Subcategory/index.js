const mongoose = require("mongoose");

var subcategorySchema = new mongoose.Schema(
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
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: [true, "Please Provide Category Id"],
		},
	},
	{ timestamps: true, id: false }
);

subcategorySchema.set("toObject", { virtuals: true });
subcategorySchema.set("toJSON", { virtuals: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
module.exports = Subcategory;

/**
 * @swagger
 * components:
 *  schemas:
 *   Subcategory:
 *     type: object
 *     required:
 *        - name
 *        - category
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   SubcategoryUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       category:
 *         type: string
 */
