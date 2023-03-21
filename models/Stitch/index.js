const mongoose = require("mongoose");

var stitchSchema = new mongoose.Schema(
	{
		tailor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tailor",
			required: [true, "Please Provide Tailor Id"],
		},
		fee: {
			type: Number,
			trim: true,
			default: 0,
		},
		receivedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			default: null,
		},
		receivedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true, id: false }
);

stitchSchema.set("toObject", { virtuals: true });
stitchSchema.set("toJSON", { virtuals: true });

const Stitch = mongoose.model("Stitch", stitchSchema);
module.exports = Stitch;

/**
 * @swagger
 * components:
 *  schemas:
 *   Stitch:
 *     type: object
 *     required:
 *        - tailor
 *     properties:
 *       tailor:
 *         type: string
 *       fee:
 *         type: number
 *       receivedBy:
 *         type: string
 *       receivedAt:
 *         type: datetime
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   StitchUpdate:
 *     type: object
 *     properties:
 *       tailor:
 *         type: string
 *       fee:
 *         type: number
 *       receivedBy:
 *         type: string
 *       receivedAt:
 *         type: datetime
 */
