const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Tailor = require("../../models/Tailor");

exports.getAll = async (req, res, next) => {
    const { isActive } = req.query;
    try {
        res.status(200).json({
            success: true,
            message: "Tailor list fetched successfully",
            ...(await Tailor.paginate(
                {
                    ...(req.search && {
                        $or: [
                            ...queryObjectBuilder(
                                req.search,
                                ["name", "ownerName", "address", "phone"],
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
                    // select: "name ownerName address phone",
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
    const { name, ownerName, address, phone } = req.body;

    try {
        // Store Admin to DB
        const tailor = await Tailor.create({
            name,
            ownerName,
            address,
            phone,
            ...req.createdBy,
        });

        // Send Success Response
        res.status(201).json({
            success: true,
            message: `'${tailor.name}' is created as a tailor successfully`,
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.update = async (req, res, next) => {
    // Get Values
    const { tailor_id } = req.params;

    if (!tailor_id || !mongoose.Types.ObjectId.isValid(tailor_id))
        return next(new ErrorResponse("Please provide valid tailor id", 400));

    const { name, ownerName, address, phone } = req.body;

    try {
        // Update tailor to DB
        const tailor = await Tailor.findByIdAndUpdate(tailor_id, {
            name,
            ownerName,
            address,
            phone,
            ...req.updatedBy,
        });

        if (tailor)
            res.status(200).json({
                success: true,
                message: "Tailor information's are updated successfully",
                // data: tailor,
            });
        else return next(new ErrorResponse("Tailor not found", 404));

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.byID = async (req, res, next) => {
    // Get Values
    const { tailor_id } = req.params;

    // mongoose.Types.ObjectId.isValid(id)
    if (!tailor_id || !mongoose.Types.ObjectId.isValid(tailor_id))
        return next(new ErrorResponse("Please provide valid tailor id", 400));

    try {
        const tailor = await Tailor.findById(tailor_id).populate([
            {
                path: "createdBy",
                select: "firstName lastName fullName userName",
            },
            {
                path: "updatedBy",
                select: "firstName lastName fullName userName",
            },
        ]);

        if (!tailor) return next(new ErrorResponse("No tailor found", 404));

        res.status(200).json({
            success: true,
            data: tailor,
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};
