const mongoose = require("mongoose");

var permissionSchema = new mongoose.Schema(
	{
		keyword: {
			type: String,
			unique: [true, "The Keyword is already taken"], // One Account with One Username
			required: [true, "Please Provide a Keyword"], // If Required
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, "Please Provide a Description"], // If Required
		},
	},
	{ timestamps: true, id: false }
);

permissionSchema.set("toObject", { virtuals: true });
permissionSchema.set("toJSON", { virtuals: true });

const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;

/**
 * @swagger
 * components:
 *  schemas:
 *   Permission:
 *     type: object
 *     required:
 *        - keyword
 *        - description
 *     properties:
 *       keyword:
 *         type: string
 *         unique: true
 *       description:
 *         type: string
 */
