const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Branch = require("../../models/Branch");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Branch list fetched successfully",
			...(await Branch.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["name", "address", "phone"],
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
	const { name, address, phone } = req.body;

	try {
		// Store Admin to DB
		const branch = await Branch.create({
			name,
			address,
			phone,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${branch.name}' is created as a branch successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { branch_id } = req.params;

	if (!branch_id || !mongoose.Types.ObjectId.isValid(branch_id))
		return next(new ErrorResponse("Please provide valid branch id", 400));

	const { name, address, phone } = req.body;

	try {
		// Update branch to DB
		const branch = await Branch.findByIdAndUpdate(branch_id, {
			name,
			address,
			phone,
			...req.updatedBy,
		});

		if (branch)
			res.status(200).json({
				success: true,
				message: "Branch informations are updated successfully",
				// data: branch,
			});
		else return next(new ErrorResponse("Branch not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.activeInactive = async (req, res, next) => {
	// Get Values
	const { branch_id } = req.params;

	if (!branch_id || !mongoose.Types.ObjectId.isValid(branch_id))
		return next(new ErrorResponse("Please provide valid branch id", 400));

	try {
		// Update User to DB
		const user = await Branch.findById(branch_id);

		if (!user) return next(new ErrorResponse("No branch found", 404));

		await user.updateOne({
			isActive: !user.isActive,
			...req.updatedBy,
		});
		await user.save();

		res.status(200).json({
			success: true,
			message: `Branch ${
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
	const { branch_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!branch_id || !mongoose.Types.ObjectId.isValid(branch_id))
		return next(new ErrorResponse("Please provide valid branch id", 400));

	try {
		const branch = await Branch.findById(branch_id).populate([
			{
				path: "createdBy",
				select: "firstName lastName fullName userName",
			},
			{
				path: "updatedBy",
				select: "firstName lastName fullName userName",
			},
		]);

		if (!branch) return next(new ErrorResponse("No branch found", 404));

		res.status(200).json({
			success: true,
			data: branch,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
