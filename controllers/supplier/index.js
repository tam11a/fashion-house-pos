const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Supplier = require("../../models/Supplier");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Supplier list fetched successfully",
			...(await Supplier.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["name", "phone", "email"],
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
	const { name, phone, address, email, bank, bKash } = req.body;

	try {
		// Store Admin to DB
		const supplier = await Supplier.create({
			name,
			phone,
			address,
			email,
			bank,
			bKash,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${supplier.name}' is created as a supplier successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { supplier_id } = req.params;

	if (!supplier_id || !mongoose.Types.ObjectId.isValid(supplier_id))
		return next(new ErrorResponse("Please provide valid supplier id", 400));

	const { name, phone, address, email, bank, bKash } = req.body;

	try {
		// Update supplier to DB
		const supplier = await Supplier.findByIdAndUpdate(supplier_id, {
			name,
			phone,
			address,
			email,
			bank,
			bKash,
			...req.updatedBy,
		});

		if (supplier)
			res.status(200).json({
				success: true,
				message: "Supplier informations are updated successfully",
				// data: supplier,
			});
		else return next(new ErrorResponse("Supplier not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { supplier_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!supplier_id || !mongoose.Types.ObjectId.isValid(supplier_id))
		return next(new ErrorResponse("Please provide valid supplier id", 400));

	try {
		const supplier = await Supplier.findById(supplier_id).populate([
			{
				path: "createdBy",
				select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "firstName lastName fullName userName",
			},
		]);

		if (!supplier) return next(new ErrorResponse("No supplier found", 404));

		res.status(200).json({
			success: true,
			data: supplier,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
