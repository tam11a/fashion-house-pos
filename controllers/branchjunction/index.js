const { default: mongoose } = require("mongoose");
const BranchJunction = require("../../models/BranchJunction");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");


exports.getAll = async (req, res, next) => {
    const { branch, employee } = req.query;
    try {
        res.status(200).json({
            success: true,
            message: "Branch list fetched successfully",
            ...(await BranchJunction.paginate(
                {
                    ...(req.search && {
                        $or: [
                            ...queryObjectBuilder(
                                req.search,
                                [],
                                true
                            ),
                        ],
                    }),
                    ...fieldsQuery({
                        branch,
                        admin:employee
                    }),
                },
                {
                    ...req.pagination,
                    // select: "name address phone",
                    populate: "branch admin",
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

exports.deleteBranchJunction = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return next(new ErrorResponse("Please provide valid junction id", 400));

        if (
            await BranchJunction.findOneAndDelete({
                _id: id,
            })
        )
            res.status(200).json({
                success: true,
                message: "Relationship removed successfully.",
            });
        else next(new ErrorResponse("Relationship not found", 404));

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};