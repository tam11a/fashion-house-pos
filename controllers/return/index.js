const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const Item = require("../../models/Item");

exports.byID = async (req, res, next) => {
	const { scan_id } = req.params;
	const { cause } = req.body;
	try {
		if (!scan_id)
			return next(new ErrorResponse("Please provide valid item id", 400));
	} catch {
		return next(new ErrorResponse("Please provide valid item id", 400));
	}

	try {
		const FoundItem = await Item.findById(scan_id).populate("orderLine");

		if (!FoundItem)
			return next(new ErrorResponse("No Product Item Found!!", 404));

		if (!FoundItem.orderLine)
			return next(
				new ErrorResponse("Product Item is already in inventory!!", 404)
			);

		FoundItem.return?.push({
			orderLine: FoundItem.orderLine._id,
			order: FoundItem.orderLine.order,
			cause,
			...req.createdBy,
		});

		FoundItem.orderLine = null;

		FoundItem.save();

		res.status(200).json({
			success: true,
			message: "Product Item returned to inventory successfully",
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
