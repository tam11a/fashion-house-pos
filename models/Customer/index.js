const mongoose = require("mongoose");

var customerSchema = new mongoose.Schema(
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
		gender: {
			type: String,
			enum: ["male", "female", "others"],
			required: [true, "Please provide gender"],
			trim: true,
		},
		dob: {
			type: Date,
			default: null,
			select: false,
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

customerSchema.set("toObject", { virtuals: true });
customerSchema.set("toJSON", { virtuals: true });

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;

/**
 * @swagger
 * components:
 *  schemas:
 *   Customer:
 *     type: object
 *     required:
 *        - name
 *        - phone
 *        - gender
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
 *       gender:
 *         type: string
 *         enum: [male, female, others]
 *       dob:
 *         type: string
 *         format: date
 *       bank:
 *         type: string
 *       bKash:
 *         type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   CustomerUpdate:
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
 *       gender:
 *         type: string
 *         enum: [male, female, others]
 *       dob:
 *         type: string
 *         format: date
 *       bank:
 *         type: string
 *       bKash:
 *         type: string
 */
