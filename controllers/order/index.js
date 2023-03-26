const Order = require("../../models/Order");
const OrderLine = require("../../models/OrderLine");
const Item = require("../../models/Item");
const Stitch = require("../../models/Stitch");
const ErrorResponse = require("../../utils/errorResponse");

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

		await products?.map?.(async (p) => {
			const orderLine = await OrderLine.create({
				order: order._id,
				sellPrice: p.price,
				...req.createdBy,
			});

			const stitch = await Stitch.create({
				tailor,
				size: p.stitch?.size,
				fee: p.stitch?.fee,
				...req.createdBy,
			});

			const item = await Item.findById(p.id);
			item.orderLine = orderLine._id;
			item.stitch = stitch._id;
			item.save();
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `Sale saved successfully`,
		});

		// On Error641a4391735ea364935e834c
	} catch (error) {
		// Send Error Response
		return next(error);
	}
};
