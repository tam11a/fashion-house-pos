const mongoose = require("mongoose");

var supplierSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please Provide a Name"], // If Required
			trim: true,
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
			unique: [true, "Phone Number is already registered"],
		},
		email: {
			type: String,
			match: [
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				"Invalid Email Address",
			],
			trim: true,
			default: null,
		},
		bank: {
			type: String,
			default: null,
			trim: true,
			select: false,
		},
		bKash: {
			type: String,
			validate: [/^$|01\d{9}$/, "Invalid bKash Number"],
			default: "",
			trim: true,
			select: false,
		},
	},
	{ timestamps: true, id: false }
);

supplierSchema.set("toObject", { virtuals: true });
supplierSchema.set("toJSON", { virtuals: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;

/**
 * @swagger
 * components:
 *  schemas:
 *   Supplier:
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
 *       email:
 *         type: string
 *         pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *         default: example@email.com
 *       bank:
 *         type: string
 *       bKash:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   SupplierUpdate:
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
 *       email:
 *         type: string
 *         pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *         default: example@email.com
 *       bank:
 *         type: string
 *       bKash:
 *         type: string
 */
