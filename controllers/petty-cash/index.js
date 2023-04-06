const PettyCash = require("../../models/PettyCash");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");

exports.getAll = async (req, res, next) => {
	const { branch, createdBy, startDate, endDate } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Petty Cash list fetched successfully",
			...(await PettyCash.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["branch.name", "createdBy.firstName", "createdBy.lastName"],
								true
							),
						],
					}),
					...fieldsQuery({
						branch,
						createdBy,
					}),
					...(startDate && endDate
						? {
								createdAt: {
									$gte: new Date(startDate),
									$lte: new Date(endDate),
								},
						  }
						: {}),
				},
				{
					...req.pagination,
					select: "name amount reason createdBy createdAt",
					populate: [
						{
							path: "branch",
							select: "name -createdBy -updatedBy",
						},
						{
							path: "createdBy",
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
	const { branch } = req.params;
	const { amount, reason } = req.query;

	try {
		// Store Admin to DB
		const ptcash = await PettyCash.create({
			branch,
			amount,
			reason,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `${amount}tk added successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
