const mongoose = require("mongoose");

var tailorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Provide a Name"], // If Required
			trim: true,
		},
		ownerName: {
			type: String,
			trim: true,
			default: null,
		},
		address: {
			type: String,
			trim: true,
			default: null,
		},
		phone: {
			type: String,
			validate: [/01\d{9}$/, "Invalid Phone Number"],
			required: [true, "Please Provide a Phone Number"],
		},
	},
	{ timestamps: true, id: false }
);

tailorSchema.virtual("totalItems", {
	ref: "Stitch",
	localField: "_id",
	foreignField: "tailor",
	count: true,
});

tailorSchema.set("toObject", { virtuals: true });
tailorSchema.set("toJSON", { virtuals: true });

const Tailor = mongoose.model("Tailor", tailorSchema);
module.exports = Tailor;

/**
 * @swagger
 * components:
 *  schemas:
 *   Tailor:
 *     type: object
 *     required:
 *        - name
 *        - phone
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       ownerName:
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
 *   TailorUpdate:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         unique: true
 *       ownerName:
 *         type: string
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       address:
 *         type: string
 */
