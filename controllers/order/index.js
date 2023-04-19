const Order = require("../../models/Order");
const OrderLine = require("../../models/OrderLine");
const Item = require("../../models/Item");
const Stitch = require("../../models/Stitch");
const ErrorResponse = require("../../utils/errorResponse");
const { fieldsQuery, queryObjectBuilder } = require("../../utils/fieldsQuery");
const { default: mongoose } = require("mongoose");

exports.create = async (req, res, next) => {
	// Get Values
	const { invoice, customer, type, discount, products, tailor, paid, method } =
		req.body;

	try {
		// Store Admin to DB

		var hasStitch = false;
		var total = 0;
		products?.map?.((p) => {
			total += p.price + (p.stitch?.fee || 0);
			if (!hasStitch) hasStitch = !!p.stitch;
		});

		if (hasStitch && !tailor)
			return next(new ErrorResponse("Please provide tailor information", 400));

		const order = await Order.create({
			invoice,
			customer,
			type,
			discount,
			total,
			transaction: [
				{
					amount: paid,
					method,
					receivedBy: req.createdBy.createdBy,
				},
			],
			...req.createdBy,
		});

		await Promise.all(
			products?.map?.(async (p) => {
				const orderLine = await OrderLine.create({
					order: order._id,
					sellPrice: p.price,
					...req.createdBy,
				});

				var stitch;

				if (p.stitch)
					stitch = await Stitch.create({
						tailor,
						size: p.stitch?.size,
						fee: p.stitch?.fee,
						...req.createdBy,
					});

				await Item.findOneAndUpdate(
					{
						_id: p.id,
					},
					{
						orderLine: orderLine._id,
						stitch: stitch?._id,
					}
				);
			})
		);

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `Sale saved successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		return next(error);
	}
};

exports.getAll = async (req, res, next) => {
	const { customer } = req.query;

	try {
		res.status(200).json({
			success: true,
			message: "Order list fetched successfully",
			...(await Order.paginate(
				{
					...(req.search && {
						$or: [...queryObjectBuilder(req.search, [], true)],
					}),
					...fieldsQuery({
						customer,
					}),
				},
				{
					...req.pagination,
					populate: [
						{
							path: "customer",
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

exports.byID = async (req, res, next) => {
	// Get Values
	const { order_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
		return next(new ErrorResponse("Please provide valid order id", 400));

	try {
		const order = await Order.findById(order_id).populate([
			{
				path: "customer",
			},
		]);

		if (!order) return next(new ErrorResponse("No order found", 404));

		res.status(200).json({
			success: true,
			data: order,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.ItemsByID = async (req, res, next) => {
	// Get Values
	const { order_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
		return next(new ErrorResponse("Please provide valid order id", 400));

	try {
		const order = await Item.paginate(
			{
				...queryObjectBuilder(order_id, ["orderLine.order"], false, true),
				// ...fieldsQuery({
				// 	"orderLine.order": order_id,
				// }),
			},
			{
				populate: [
					{
						path: "product",
					},
					{
						path: "shipment",
					},
					{
						path: "branch",
					},
					{
						path: "orderLine",
					},
				],
			}
		);

		// if (!order.length) return next(new ErrorResponse("No order found", 404));

		res.status(200).json({
			success: true,
			data: order,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};

exports.addTransaction = async (req, res, next) => {
	// Get Values
	const { method, amount } = req.body;
	const { order_id } = req.params;

	// mongoose.Types.ObjectId.isValid(id)
	if (!order_id || !mongoose.Types.ObjectId.isValid(order_id))
		return next(new ErrorResponse("Please provide valid order id", 400));

	try {
		const order = await Order.findById(order_id).populate([
			{
				path: "customer",
			},
		]);

		if (!order) return next(new ErrorResponse("No order found", 404));

		order.transaction = [
			...order.transaction,
			{
				amount,
				method,
				receivedBy: req.createdBy.createdBy,
			},
		];
		order.save();

		res.status(200).json({
			success: true,
			message: "Added transaction successfully",
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
