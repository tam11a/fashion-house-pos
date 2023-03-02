const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Category = require("../../models/Category");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Category list fetched successfully",
			...(await Category.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(req.search, ["name", "description"], true),
						],
					}),
					...fieldsQuery({
						isActive,
					}),
				},
				{
					...req.pagination,
					// select: "name address phone",
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
	const { name, description } = req.body;

	try {
		// Store Admin to DB
		const category = await Category.create({
			name,
			description,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${category.name}' is created as a category successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { category_id } = req.params;

	if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
		return next(new ErrorResponse("Please provide valid category id", 400));

	const { name, description } = req.body;

	try {
		// Update category to DB
		const category = await Category.findByIdAndUpdate(category_id, {
			name,
			description,
			...req.updatedBy,
		});

		if (category)
			res.status(200).json({
				success: true,
				message: "Category informations are updated successfully",
				// data: category,
			});
		else return next(new ErrorResponse("Category not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { category_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!category_id || !mongoose.Types.ObjectId.isValid(category_id))
		return next(new ErrorResponse("Please provide valid category id", 400));

	try {
		const category = await Category.findById(category_id).populate([
			{
				path: "createdBy",
				select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "firstName lastName fullName userName",
			},
		]);

		if (!category) return next(new ErrorResponse("No category found", 404));

		res.status(200).json({
			success: true,
			data: category,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
