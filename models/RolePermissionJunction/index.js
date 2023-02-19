const mongoose = require("mongoose");

var rolepermissionSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: [true, "The Name is already taken"], // One Account with One Username
		required: [true, "Please Provide a Keyword"], // If Required
		trim: true,
	},
	description: {
		type: String,
		trim: true,
		required: [true, "Please Provide a Description"], // If Required
	},
});

rolepermissionSchema.set("toObject", { virtuals: true });
rolepermissionSchema.set("toJSON", { virtuals: true });

const RolePermissionJunction = mongoose.model(
	"RolePermission",
	rolepermissionSchema
);
module.exports = RolePermissionJunction;

/**
 * @swagger
 * components:
 *  schemas:
 *   RolePermissionJunction:
 *     type: object
 *     required:
 *        - name
 *        - description
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       description:
 *         type: string
 */
