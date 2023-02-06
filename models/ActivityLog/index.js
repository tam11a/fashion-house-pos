const mongoose = require("mongoose");

var activityLogSchema = new mongoose.Schema({
	collectionType: {
		type: "String",
	},
	action: {
		type: "String",
	},
	message: {
		type: "String",
	},
	loggedBy: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "loggerModel",
		required: [true, "Please Provide Logger Id"],
	},
	loggerModel: {
		type: String,
		enum: ["Admin"],
		default: "Admin",
	},
	createdAt: {
		type: "Date",
	},
});

ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
