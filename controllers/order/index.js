const Order = require("../../models/Order");
const OrderLine = require("../../models/OrderLine");
const Item = require("../../models/Item");
const Stitch = require("../../models/Stitch");

exports.create = async (req, res, next) => {
	// Get Values
	const { invoice, customer, type, discount, products, tailor, paid, method } =
		req.body;

	try {
		// Store Admin to DB

		console.log({
			invoice,
			customer,
			type,
			discount,
			products,
			tailor,
			paid,
			method,
		});

		var total = 0;
		products?.map?.((p) => {
			total += p.price;
		});

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
		});

		products?.map?.(async (p) => {
			const orderLine = await OrderLine.create({
				order: order._id,
				sellPrice: p.price,
			});

			const stitch = await Stitch.create({
				tailor,
				size: p.stitch.size,
				fee: p.stitch.fee,
			});

			const item = await Item.findById(p._id);
			item.orderLine = orderLine._id;
			item.stitch = stitch._id;
			item.save();
		});

		// Send Success Response
		res.status(201).json({
			success: true,
			message: `Sale saved successfully`,
		});

		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
