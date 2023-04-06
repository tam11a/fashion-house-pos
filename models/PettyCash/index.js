const mongoose = require("mongoose");

var pettycashSchema = new mongoose.Schema(
	{
		amount: {
			type: Number,
			required: [true, "Please Provide Amount"],
			default: 0,
		},
		reason: {
			type: String,
			trim: true,
			required: [true, "Please Provide Reason"],
			default: null,
		},
		branch: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Branch",
			required: [true, "Please Provide Branch Id"],
		},
	},
	{ timestamps: true, id: false }
);

pettycashSchema.set("toObject", { virtuals: true });
pettycashSchema.set("toJSON", { virtuals: true });

const PettyCash = mongoose.model("PettyCash", pettycashSchema);
module.exports = PettyCash;
