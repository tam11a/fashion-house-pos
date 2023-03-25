const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Item = require("../../models/Item");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Item list fetched successfully",
			...(await Item.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								[
									"product.name",
									"shipment.supplier.name",
									"shipment.supplier.phone",
									"shipment.supplier.email",
									"shipment.supplier.address",
								],
								true
							),
						],
					}),
					...fieldsQuery({
						isActive,
					}),
				},
				{
					...req.pagination,
					// select: "name address phone",
					populate: [
						{
							path: "shipment",
							select: "supplier",
							populate: [
								{
									path: "supplier",
								},
							],
						},
						{
							path: "product",
							select: "name category subcategory",
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
					],
					customLabels: {
						docs: "data",
						totalDocs: "total",
					},
				}
			)),
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { item_id } = req.params;

	try {
		// mongoose.Types.ObjectId.isValid(id)
		if (!item_id || !mongoose.Types.ObjectId.isValid(item_id))
			return next(new ErrorResponse("Please provide valid item id", 400));

		const item = await Item.findById(item_id).populate([
			{
				path: "shipment",
				select: "supplier",
				populate: [
					{
						path: "supplier",
					},
				],
			},
			{
				path: "product",
				select: "name category subcategory",
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
