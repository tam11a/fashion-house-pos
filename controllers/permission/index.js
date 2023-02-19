const Permission = require("../../models/Permission");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");

exports.getAll = async (req, res, next) => {
	const { isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Permission list fetched successfully",
			...(await Permission.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								["keyword", "description"],
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
					select: "keyword description createdAt updatedAt createdBy updatedBy",
					sort: req.pagination.sort || "keyword",
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
	const { keyword, description } = req.body;

	try {
		// Store Admin to DB
		const permission = await Permission.create({
			keyword,
			description,
			...req.createdBy,
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `'${permission.keyword}' is created as a permission successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
