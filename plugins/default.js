const mongoose = require("mongoose");

const defaultFields = {
	isActive: {
		type: Boolean,
		required: true,
		default: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin",
		default: null,
		select: false,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin",
		default: null,
		select: false,
	},
};

const customDefaultFieldsPlugin = (schema) => {
	schema.add(defaultFields);
	schema.pre(/^find/, async function () {
		if (schema.options.creatorDetails === false) return;
		this.populate([
			{
				path: "createdBy",
				select: "userName",
				// select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "userName",
			},
		]);
	});
};

module.exports = customDefaultFieldsPlugin;
