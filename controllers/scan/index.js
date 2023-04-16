const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const Item = require("../../models/Item");

exports.byID = async (req, res, next) => {
	const { scan_id } = req.params;
	try {
		if (!scan_id || !mongoose.Types.ObjectId(scan_id))
			return next(new ErrorResponse("Please provide valid item id", 400));
	} catch {
		return next(new ErrorResponse("Please provide valid item id", 400));
	}

	try {
		const item = await Item.findById(scan_id).populate([
			{
				path: "shipment",
				populate: [
					{
						path: "supplier",
					},
				],
			},
			{
				path: "product",
				populate: [
					{
						path: "category",
						select: "name",
					},
					{
						path: "subcategory",
						select: "name",
					},
				],
			},
			{
				path: "createdBy",
				select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "firstName lastName fullName userName",
			},
		]);

		if (!item) return next(new ErrorResponse("No item found", 404));

		if (!!item.orderLine)
			return next(new ErrorResponse("Item already sold", 404));

		res.status(200).json({
			success: true,
			data: item,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
