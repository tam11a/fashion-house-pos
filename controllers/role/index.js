const Role = require("../../models/Role");
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
