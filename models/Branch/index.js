const mongoose = require("mongoose");

var branchSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Provide a Name"], // If Required
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			validate: [/01\d{9}$/, "Invalid Phone Number"],
			required: [true, "Please Provide a Phone Number"],
		},
	},
	{ timestamps: true, id: false }
);

branchSchema.set("toObject", { virtuals: true });
branchSchema.set("toJSON", { virtuals: true });

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;

/**
 * @swagger
 * components:
 *  schemas:
 *   Branch:
 *     type: object
 *     required:
 *        - name
 *        - phone
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       address:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   BranchUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       address:
 *         type: string
 */
