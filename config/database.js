const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongoosePaginate = require("mongoose-paginate-v2");
const { mongooseSubqueryPlugin } = require("mongoose-subquery");
const customDefaultFieldsPlugin = require("../plugins/default");
// const mongoose_delete = require("mongoose-delete");

mongoose
	.connect(process.env.MONGO_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB Connected Successfully");
	});

mongoose.set("strictQuery", true);

// mongoose.set("debug", true);

mongoose.plugin(customDefaultFieldsPlugin);
mongoose.plugin(mongoosePaginate);
mongoose.plugin(mongooseSubqueryPlugin);
mongoose.plugin(slug);
// mongoose.plugin(mongoose_delete, { deletedAt: true });

module.exports = mongoose;
