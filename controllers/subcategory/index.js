const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Subcategory = require("../../models/Subcategory");

exports.getAll = async (req, res, next) => {
	const { category, isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Subcategory list fetched successfully",
			...(await Subcategory.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(req.search, ["name", "description"], true),
						],
					}),
					...fieldsQuery({
						isActive,
						category,
					}),
				},
				{
					...req.pagination,
					select:
						"name description category createdBy updatedBy createdAt updatedAt",
					populate: [
						{
							path: "category",
							select: "name",
						},
						{
							path: "createdBy",
							select: "firstName lastName fullName userName",
						},
						{
							path: "updatedBy",
							select: "firstName lastName fullName userName",
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

exports.create = async (req, res, next) => {
	// Get Values
	const { name, description, category } = req.body;

	try {
		// Store Admin to DB
		const subcategory = await Subcategory.create({
			name,
			description,
			category,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${subcategory.name}' is created as a subcategory successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { subcategory_id } = req.params;

	if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
		return next(new ErrorResponse("Please provide valid subcategory id", 400));

	const { name, description, category } = req.body;

	try {
		// Update subcategory to DB
		const subcategory = await Subcategory.findByIdAndUpdate(subcategory_id, {
			name,
			description,
			category,
			...req.updatedBy,
		});

		if (subcategory)
			res.status(200).json({
				success: true,
				message: "Subcategory informations are updated successfully",
				// data: subcategory,
			});
		else return next(new ErrorResponse("Subcategory not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.activeInactive = async (req, res, next) => {
	// Get Values
	const { subCategory_id } = req.params;

	if (!subCategory_id || !mongoose.Types.ObjectId.isValid(subCategory_id))
		return next(new ErrorResponse("Please provide valid category id", 400));

	try {
		// Update User to DB
		const user = await Subcategory.findById(subCategory_id);

		if (!user) return next(new ErrorResponse("No subcategory found", 404));

		await user.updateOne({
			isActive: !user.isActive,
			...req.updatedBy,
		});
		await user.save();

		res.status(200).json({
			success: true,
			message: `Subcategory ${
				user.isActive ? "deactivated" : "activated"
			} successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { subcategory_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!subcategory_id || !mongoose.Types.ObjectId.isValid(subcategory_id))
		return next(new ErrorResponse("Please provide valid subcategory id", 400));

	try {
		const subcategory = await Subcategory.findById(subcategory_id).populate([
			{
				path: "category",
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

		if (!subcategory)
			return next(new ErrorResponse("No subcategory found", 404));

		res.status(200).json({
			success: true,
			data: subcategory,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
