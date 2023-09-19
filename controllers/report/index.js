const Admin = require("../../models/Admin");
const Branch = require("../../models/Branch");
const Customer = require("../../models/Customer");
const Item = require("../../models/Item");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

exports.global = async (req, res, next) => {
	const totalSales = await Order.aggregate([
		{
			$group: {
				_id: null,
				total: { $sum: "$total" },
			},
		},
	]);
	const totalDiscount = await Order.aggregate([
		{
			$group: {
				_id: null,
				total: { $sum: "$discount" },
			},
		},
	]);

	const totalDue = await Order.aggregate([
		{
			$match: {
				$expr: {
					$gte: [
						{
							$subtract: [
								{ $subtract: ["$total", "$discount"] },
								{
									$sum: "$transaction.amount",
								},
							],
						},
						0,
					],
				},
			},
		},
		{
			$group: {
				_id: null,
				total: {
					$sum: {
						$subtract: [
							{ $subtract: ["$total", "$discount"] },
							{
								$sum: "$transaction.amount",
							},
						],
					},
				},
			},
		},
	]);

	const totalPaid = await Order.aggregate([
		{
			$group: {
				_id: null,
				total: {
					$sum: {
						$sum: "$transaction.amount",
					},
				},
			},
		},
	]);

	res.status(200).json({
		success: true,
		message: "Global Report",
		data: {
			totalBranches: await Branch.countDocuments(),
			totalEmployees: await Admin.countDocuments(),
			totalCustomers: await Customer.countDocuments(),
			totalProducts: await Product.countDocuments(),
			totalOrders: await Order.countDocuments(),
			totalAvailableItems: await Item.countDocuments({
				orderLine: { $eq: null },
			}),
			totalItems: await Item.countDocuments(),
			totalSales: totalSales[0].total,
			totalDue: totalDue[0].total,
			totalPaid: totalPaid[0].total,
			totalDiscount: totalDiscount[0].total,
		},
	});
};
