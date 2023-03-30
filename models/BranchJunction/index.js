const mongoose = require("mongoose");

var branchjunctionSchema = new mongoose.Schema(
	{
		branch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Branch",
			default: null,
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			default: null,
		},
	},
	{ timestamps: true }
);

branchjunctionSchema.set("toObject", { virtuals: true });
branchjunctionSchema.set("toJSON", { virtuals: true });

const BranchJunction = mongoose.model(
	"BranchJunction",
	branchjunctionSchema
);
module.exports = BranchJunction;
