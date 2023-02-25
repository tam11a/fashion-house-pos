const mongoose = require("mongoose");

var roleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: [true, "The Name is already taken"], // One Account with One Username
			required: [true, "Please Provide a Name"], // If Required
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, "Please Provide a Description"], // If Required
		},
		permissions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Permission",
			},
		],
	},
	{ timestamps: true, id: false }
);

roleSchema.set("toObject", { virtuals: true });
roleSchema.set("toJSON", { virtuals: true });

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

/**
 * @swagger
 * components:
 *  schemas:
 *   Role:
 *     type: object
 *     required:
 *        - name
 *        - description
 *        - permissions
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       description:
 *         type: string
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   RoleUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       description:
 *         type: string
 *       permissions:
 *         type: array
 *         items:
 *           type: string
 */
