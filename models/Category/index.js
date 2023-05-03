const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema(
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
	},
	{ timestamps: true, id: false }
);

categorySchema.virtual("totalSubcategories", {
	ref: "Subcategory",
	localField: "_id",
	foreignField: "category",
	count: true,
});

categorySchema.virtual("totalProducts", {
	ref: "Product",
	localField: "_id",
	foreignField: "category",
	count: true,
});

categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

/**
 * @swagger
 * components:
 *  schemas:
 *   Category:
 *     type: object
 *     required:
 *        - name
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   CategoryUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 */
