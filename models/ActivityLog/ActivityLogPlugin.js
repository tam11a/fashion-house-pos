const ActivityLog = require("./");

function ActivityLogPlugin(schema, options) {
	// create action logs
	schema.post("save", function (_doc, next) {
		var ALog = new ActivityLog({
			collectionType: options.schemaName,
			action: options.createAction || "created",
			loggedBy: this.updatedBy,
			createdAt: Date.now(),
		});
		ALog.save(function (_err, _aLog) {
			return next();
		});
	});

	// update action logs
	schema.post("update", function (_doc, next) {
		var activity = {
			collectionType: options.schemaName,
			action: options.updateAction || "updated",
			createdAt: Date.now(),
		};
		if (this._update.$set && this._update.$set.updatedBy) {
			activity.loggedBy = this._update.$set.updatedBy;
		} else if (this._update.$pushALogl) {
			activity.referenceDocument = this._update.$pushALogl;
		}

		var ALog = new ActivityLog(activity);
		ALog.save(function (_err, _aLog) {
			return next();
		});
	});

	schema.post("findOneAndUpdate", function (doc, next) {
		var refrenceDocument = Object.assign({}, doc);
		var activity = {
			collectionType: options.schemaName,
			referenceDocument: refrenceDocument,
			action: options.updateAction || "updated",
			loggedBy: doc.updatedBy,
			createdAt: Date.now(),
		};
		var ALog = new ActivityLog(activity);
		ALog.save(function (_err, _aLog) {
			return next();
		});
	});

	// create logs for delete action
	schema.post("findOneAndRemove", function (doc, next) {
		var activity = {
			collectionType: options.schemaName,
			referenceDocument: doc,
			action: options.deleteAction || "deleted",
			loggedBy: this.updatedBy,
			createdAt: Date.now(),
		};
		var ALog = new ActivityLog(activity);
		ALog.save(function (_err, _aLog) {
			return next();
		});
	});

	schema.post("remove", function (doc, next) {
		var activity = {
			collectionType: options.schemaName,
			referenceDocument: doc,
			action: options.deleteAction || "deleted",
			loggedBy: this.updatedBy,
			createdAt: Date.now(),
		};
		var ALog = new ActivityLog(activity);
		ALog.save(function (_err, _aLog) {
			return next();
		});
	});
}

module.exports = ActivityLogPlugin;
