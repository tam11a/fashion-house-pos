const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Item = require("../../models/Item");
const Stitch = require("../../models/Stitch");

exports.getAll = async (req, res, next) => {
	const { shipment, branch, product, supplier, tailor, isActive } = req.query;
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
									"_id",
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
						branch,
						product,
						...queryObjectBuilder(tailor, ["stitch.tailor"], false, true),
					}),
					$and: [
						{
							...fieldsQuery({
								shipment,
							}),
						},
						{
							...fieldsQuery({
								...queryObjectBuilder(
									supplier,
									["shipment.supplier"],
									false,
									true
								),
							}),
						},
					],
				},
				{
					...req.pagination,
					// select: "name address phone",
					populate: [
						{
							path: "branch",
							select: "name",
						},
						{
							path: "stitch",
							populate: [
								{
									path: "tailor",
									select: "name",
								},
							],
						},
						{
							path: "shipment",
							select: "supplier createdAt updatedAt",
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
		if (!item_id)
			// || !mongoose.Types.ObjectId.isValid(item_id))
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
				path: "stitch",
				populate: "tailor",
			},
			{
				path: "branch",
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

exports.bulkUpdate = async (req, res, next) => {
	// Get Values
	const { id, branch } = req.body;

	try {
		// mongoose.Types.ObjectId.isValid(id)
		if (!branch || !mongoose.Types.ObjectId.isValid(branch))
			return next(new ErrorResponse("Please provide valid branch id", 400));

		await Item.updateMany(
			{ _id: { $in: id } },
			{ $set: { branch: branch, ...req.updatedBy } }
		);

		res.status(200).json({
			success: true,
			message: `Updated ${id.length} items successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.ReceiveByID = async (req, res, next) => {
	// Get Values
	const { item_id } = req.params;

	try {
		// mongoose.Types.ObjectId.isValid(id)
		if (!item_id)
			// || !mongoose.Types.ObjectId.isValid(item_id))
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
				path: "stitch",
				populate: "tailor",
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

		if (!item.stitch)
			return next(new ErrorResponse("Item is not sent to any tailor yet", 400));

		const stitch = await Stitch.findByIdAndUpdate(item.stitch, {
			receivedBy: req.createdBy.createdBy,
			receivedAt: new Date(),
		});

		if (!stitch) return next(new ErrorResponse("Something went wrong!", 400));

		res.status(200).json({
			success: true,
			message: "Stitched product received successfully",
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
