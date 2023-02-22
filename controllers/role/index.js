const { default: mongoose } = require("mongoose");
const Role = require("../../models/Role");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Role list fetched successfully",
			...(await Role.paginate(
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
					populate: [
						{
							path: "permissions",
							select: "keyword description isActive -createdBy -updatedBy",
						},
					],
					select:
						"name description permissions createdAt updatedAt createdBy updatedBy",
					// sort: req.pagination.sort,
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
	const { name, description, permissions } = req.body;

	try {
		// Store Admin to DB
		const role = await Role.create({
			name,
			description,
			permissions,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${role.name}' is created as a role successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.update = async (req, res, next) => {
	// Get Values
	const { role_id } = req.params;

	if (!role_id || !mongoose.Types.ObjectId.isValid(role_id))
		return next(new ErrorResponse("Please provide valid role id", 400));

	const { name, description, permissions } = req.body;

	try {
		// Update role to DB
		const role = await Role.findByIdAndUpdate(role_id, {
			name,
			description,
			permissions,
			...req.updatedBy,
		});

		if (role)
			res.status(200).json({
				success: true,
				message: "Role informations are updated successfully",
				// data: role,
			});
		else return next(new ErrorResponse("Role not found", 404));

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { role_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!role_id || !mongoose.Types.ObjectId.isValid(role_id))
		return next(new ErrorResponse("Please provide valid role id", 400));

	try {
		const user = await Role.findById(role_id).populate([
			{
				path: "permissions",
				select: "keyword description isActive -createdBy -updatedBy",
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

		if (!user) return next(new ErrorResponse("No role found", 404));

		res.status(200).json({
			success: true,
			data: user,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
