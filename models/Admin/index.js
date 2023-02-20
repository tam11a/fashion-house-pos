const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticator, totp } = require("otplib");
const base32 = require("base32");
// const ActivityLogPlugin = require("../ActivityLog/ActivityLogPlugin");

var adminSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			maxLength: 11,
			unique: [true, "The Username is already taken"], // One Account with One Username
			required: [true, "Please Provide an Username"], // If Required
			trim: true,
		},
		firstName: {
			type: String,
			maxLength: 32,
			required: [true, "Please Provide First Name"],
			trim: true,
		},
		lastName: {
			type: String,
			maxLength: 32,
			required: [true, "Please Provide Last Name"],
			trim: true,
		},
		phone: {
			type: String,
			validate: [/01\d{9}$/, "Invalid Phone Number"],
			required: [true, "Please Provide a Phone Number"],
			unique: [true, "Phone Number is already registered"],
		},
		email: {
			type: String,
			required: [true, "Please Provide an Email Address"],
			unique: [true, "Email is already resigtered"], // One Account with One Email
			match: [
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				"Invalid Email Address",
			],
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
			minlength: [6, "Password must have atleast 6 Characters"],
			select: false,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
			default: null,
			select: false,
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
		hireDate: {
			type: Date,
			default: null,
			select: false,
		},
		workHour: {
			type: Number,
			default: 0,
			select: false,
		},
		salary: {
			type: Number,
			default: 0,
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
		verificationKey: { type: String, select: false, trim: true },
		isVerified: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true, id: false, creatorDetails: false }
);

adminSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	this.verificationKey = authenticator.generateSecret();
	next();
});

adminSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

adminSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id, admin: false }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

adminSchema.methods.getTOTP = async function () {
	totp.options = {
		algorithm: "sha1",
		encoding: "ascii",
		digits: 6,
		epoch: Date.now(),
		step: 300,
		window: 300,
	};
	return totp.generate(this.verificationKey);
};

adminSchema.methods.verifyTOTP = async function (otp) {
	totp.options = {
		algorithm: "sha1",
		encoding: "ascii",
		digits: 6,
		epoch: Date.now(),
		step: 300,
		window: 300,
	};
	return totp.check(otp, this.verificationKey);
};

adminSchema.methods.getBase32ID = async function () {
	return base32.encode(this._id.toString());
};

adminSchema.methods.updatePassword = async function (password) {
	this.password = password;
	await this.save();
};

adminSchema.methods.verifyUser = async function () {
	this.isVerified = true;
	await this.save();
};

adminSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// adminSchema.pre(/^find/, async function () {
// 	this.populate("fullName");
// });

adminSchema.set("toObject", { virtuals: true });
adminSchema.set("toJSON", { virtuals: true });

// adminSchema.plugin(ActivityLogPlugin, {
// 	schemaName: "Admin",
// });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

/**
 * @swagger
 * components:
 *  schemas:
 *   Admin:
 *     type: object
 *     required:
 *        - userName
 *        - firstName
 *        - lastName
 *        - gender
 *        - phone
 *        - email
 *        - password
 *     properties:
 *       userName:
 *         type: string
 *         unique: true
 *         maxLength: 11
 *       firstName:
 *         type: string
 *         maxLength: 32
 *       lastName:
 *         type: string
 *         maxLength: 32
 *       gender:
 *         type: string
 *         enum: [male, female, others]
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       email:
 *         type: string
 *         unique: true
 *         pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *         default: example@email.com
 *       password:
 *         type: string
 *         minLength: 6
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   AdminUpdate:
 *     type: object
 *     properties:
 *       userName:
 *         type: string
 *         unique: true
 *         maxLength: 11
 *       firstName:
 *         type: string
 *         maxLength: 32
 *       lastName:
 *         type: string
 *         maxLength: 32
 *       gender:
 *         type: string
 *         enum: [male, female, others]
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       email:
 *         type: string
 *         unique: true
 *         pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *         default: example@email.com
 *       dob:
 *         type: string
 *         format: date
 *       hireDate:
 *         type: string
 *         format: date
 *       workHour:
 *         type: string
 *       bank:
 *         type: string
 *       bKash:
 *         type: string
 */
