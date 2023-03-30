const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");
const Shipment = require("../../models/Shipment");
const Item = require("../../models/Item");

exports.getAll = async (req, res, next) => {
	const { supplier, isActive } = req.query;
	try {
		res.status(200).json({
			success: true,
			message: "Shipment list fetched successfully",
			...(await Shipment.paginate(
				{
					...(req.search && {
						$or: [
							...queryObjectBuilder(
								req.search,
								[
									"supplier.name",
									"supplier.phone",
									"supplier.email",
									"supplier.address",
								],
								true
							),
						],
					}),
					...fieldsQuery({
						isActive,
						supplier
					}),
				},
				{
					...req.pagination,
					// select: "name address phone",
					populate: [
						{
							path: "supplier",
							// select: "name address phone email",
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
	const {
		supplier,
		weight,
		buyingPrice,
		shipmentCost,
		supplierCommision,
		sellPrice,
		tax,
		product,
		quantity,
	} = req.body;

	try {
		if (quantity < 1) {
			return next(new ErrorResponse("No shipped quantity found!", 400));
		}
		// Store Admin to DB
		const shipment = await Shipment.create({
			supplier,
			weight,
			buyingPrice,
			shipmentCost,
			supplierCommision,
			sellPrice,
			tax,
			...req.createdBy,
		});

		const items = await Item.insertMany(
			Array.from(Array(quantity), (x) => ({
				product,
				shipment: shipment._id,
				otherCosts: [],
				return: [],
			}))
		);

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `shipment added with ${quantity} products successfully`,
			data: {
				items: items.flatMap((x) => x._id),
			},
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.byID = async (req, res, next) => {
	// Get Values
	const { shipment_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!shipment_id || !mongoose.Types.ObjectId.isValid(shipment_id))
		return next(new ErrorResponse("Please provide valid shipment id", 400));

	try {
		const shipment = await Shipment.findById(shipment_id).populate([
			{
				path: "supplier",
				// select: "name address phone email",
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

		if (!shipment) return next(new ErrorResponse("No shipment found", 404));

		res.status(200).json({
			success: true,
			data: shipment,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
