const ErrorResponse = require("../../utils/errorResponse");
const Item = require("../../models/Item");

const scan_populate = [
	{
		path: "shipment",
		populate: [
			{
				path: "supplier",
			},
		],
	},
	{
		path: "stitch",
		populate: [
			{
				path: "tailor",
				select: "name address",
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
];

exports.byID = async (req, res, next) => {
	const { scan_id } = req.params;
	const { branch_id, is_product } = req.query;
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

	var item;

	try {
		if (
			!is_product ||
			is_product === "false" ||
			is_product === false ||
			is_product === "0" ||
			is_product === 0 ||
			is_product === "null" ||
			is_product === null ||
			is_product === "undefined" ||
			is_product === undefined ||
			is_product === "False"
		)
			item = await Item.findOne({
				_id: scan_id,
			}).populate(scan_populate);
		else
			item = await Item.findOne({
				product: scan_id,
				orderLine: null,
				branch: branch_id,
			}).populate(scan_populate);

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
