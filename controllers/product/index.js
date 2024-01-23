const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Product = require("../../models/Product");
const { generate } = require("../../utils/barcode");

exports.getAll = async (req, res, next) => {
	const { category, subcategory, isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Product list fetched successfully",
			...(await Product.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["name", "description", "category.name", "subcategory.name"],
								true
							),
						],
					}),
					...fieldsQuery({
						isActive,
						category,
						subcategory,
					}),
				},
				{
					...req.pagination,
					select:
						"name price category subcategory createdBy updatedBy createdAt updatedAt",
					populate: [
						{
							path: "category",
							select: "name",
						},
						{
							path: "subcategory",
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
						{
							path: "totalEnteredItems",
						},
						{
							path: "totalItems",
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
	const { name, description, category, subcategory, price, barcode } = req.body;

	try {
		// Store Admin to DB
		const product = await Product.create({
			name,
			description,
			category,
			subcategory,
			price,
			barcode: barcode || (await generate()),
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${product.name}' is created as a product successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { product_id } = req.params;

	if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
		return next(new ErrorResponse("Please provide valid product id", 400));

	const { name, description, category, subcategory, price, barcode } = req.body;

	try {
		// Update product to DB
		const product = await Product.findByIdAndUpdate(product_id, {
			name,
			description,
			category,
			subcategory,
			price,
			barcode,
			...req.updatedBy,
		});

		if (product)
			res.status(200).json({
				success: true,
				message: "Product informations are updated successfully",
				// data: product,
			});
		else return next(new ErrorResponse("Product not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.activeInactive = async (req, res, next) => {
	// Get Values
	const { product_id } = req.params;

	if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
		return next(new ErrorResponse("Please provide valid product id", 400));

	try {
		// Update User to DB
		const user = await Product.findById(product_id);

		if (!user) return next(new ErrorResponse("No product found", 404));

		await user.updateOne({
			isActive: !user.isActive,
			...req.updatedBy,
		});
		await user.save();

		res.status(200).json({
			success: true,
			message: `Product ${
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
	const { product_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!product_id || !mongoose.Types.ObjectId.isValid(product_id))
		return next(new ErrorResponse("Please provide valid product id", 400));

	try {
		const product = await Product.findById(product_id).populate([
			{
				path: "category",
				select: "name",
			},
			{
				path: "subcategory",
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
		]);

		if (!product) return next(new ErrorResponse("No product found", 404));

		res.status(200).json({
			success: true,
			data: product,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
