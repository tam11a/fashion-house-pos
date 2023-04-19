const ErrorResponse = require("../../utils/errorResponse");
const Item = require("../../models/Item");

exports.byID = async (req, res, next) => {
	const { scan_id } = req.params;
	const { branch_id } = req.query;

	try {
		if (!scan_id)
			return next(new ErrorResponse("Please provide valid item id", 400));
	} catch {
		return next(new ErrorResponse("Please provide valid item id", 400));
	}

	try {
		if (!branch_id)
			return next(new ErrorResponse("Please provide valid branch id", 400));
	} catch {
		return next(new ErrorResponse("Please provide valid branch id", 400));
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

		if (!item.branch)
			return next(new ErrorResponse("Product is not in any branch", 400));

		if (item.branch.toString() !== branch_id)
			return next(new ErrorResponse("Product is in different branch", 400));

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
