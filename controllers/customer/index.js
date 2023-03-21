const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Customer = require("../../models/Customer");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Customer list fetched successfully",
			...(await Customer.paginate(
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
	const { name, phone, address, email, gender, dob, bank, bKash } = req.body;

	try {
		// Store Admin to DB
		const customer = await Customer.create({
			name,
			phone,
			address,
			email,
			gender,
			dob,
			bank,
			bKash,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${customer.name}' is created as a customer successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { customer_id } = req.params;

	if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id))
		return next(new ErrorResponse("Please provide valid customer id", 400));

	const { name, phone, address, email, gender, dob, bank, bKash } = req.body;

	try {
		// Update customer to DB
		const customer = await Customer.findByIdAndUpdate(customer_id, {
			name,
			phone,
			address,
			email,
			gender,
			dob,
			bank,
			bKash,
			...req.updatedBy,
		});

		if (customer)
			res.status(200).json({
				success: true,
				message: "Customer informations are updated successfully",
				// data: customer,
			});
		else return next(new ErrorResponse("Customer not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.activeInactive = async (req, res, next) => {
	// Get Values
	const { customer_id } = req.params;

	if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id))
		return next(new ErrorResponse("Please provide valid customer id", 400));

	try {
		// Update User to DB
		const user = await Customer.findById(customer_id);

		if (!user) return next(new ErrorResponse("No customer found", 404));

		await user.updateOne({
			isActive: !user.isActive,
			...req.updatedBy,
		});
		await user.save();

		res.status(200).json({
			success: true,
			message: `Customer ${user.isActive ? "deactivated" : "activated"
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
	const { customer_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id))
		return next(new ErrorResponse("Please provide valid customer id", 400));

	try {
		const customer = await Customer.findById(customer_id).populate([
			{
				path: "createdBy",
				select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "firstName lastName fullName userName",
			},
		]);

		if (!customer) return next(new ErrorResponse("No customer found", 404));

		res.status(200).json({
			success: true,
			data: customer,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
