const Admin = require("../../models/Admin");
const Branch = require("../../models/Branch");
const Customer = require("../../models/Customer");
const Item = require("../../models/Item");
const Order = require("../../models/Order");
const PettyCash = require("../../models/PettyCash");
const Product = require("../../models/Product");
const ObjectId = require("mongoose").Types.ObjectId;

exports.global = async (req, res, next) => {
	// const totalSales = await Order.aggregate([
	// 	{
	// 		$group: {
	// 			_id: null,
	// 			total: { $sum: "$total" },
	// 		},
	// 	},
	// ]);
	// const totalDiscount = await Order.aggregate([
	// 	{
	// 		$group: {
	// 			_id: null,
	// 			total: { $sum: "$discount" },
	// 		},
	// 	},
	// ]);

	// const totalDue = await Order.aggregate([
	// 	{
	// 		$match: {
	// 			$expr: {
	// 				$gte: [
	// 					{
	// 						$subtract: [
	// 							{ $subtract: ["$total", "$discount"] },
	// 							{
	// 								$sum: "$transaction.amount",
	// 							},
	// 						],
	// 					},
	// 					0,
	// 				],
	// 			},
	// 		},
	// 	},
	// 	{
	// 		$group: {
	// 			_id: null,
	// 			total: {
	// 				$sum: {
	// 					$subtract: [
	// 						{ $subtract: ["$total", "$discount"] },
	// 						{
	// 							$sum: "$transaction.amount",
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	},
	// ]);

	// const totalPaid = await Order.aggregate([
	// 	{
	// 		$group: {
	// 			_id: null,
	// 			total: {
	// 				$sum: {
	// 					$sum: "$transaction.amount",
	// 				},
	// 			},
	// 		},
	// 	},
	// ]);
	try {
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
				// totalSales: totalSales[0].total,
				// totalDue: totalDue[0].total,
				// totalPaid: totalPaid[0].total,
				// totalDiscount: totalDiscount[0].total,
			},
		});
	} catch (error) {
		next(error);
	}
};

exports.range = async (req, res, next) => {
	try {
		const { branch, fromDate, toDate } = req.query;

		const totalSales = await Order.aggregate([
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: { $subtract: ["$total", "$discount"] } },
				},
			},
		]);

		const totalPettyCash = await PettyCash.aggregate([
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: "$amount" },
				},
			},
		]);

		const totalDue = await Order.aggregate([
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
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

		const mfs = ["COD", "Card", "Cash", "bKash", "Nagad", "Rocket"];

		const mfsReport = await Order.aggregate([
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$unwind: "$transaction", // Unwind the transaction array
			},
			{
				$group: {
					_id: "$transaction.method", // Group by payment method
					totalAmount: { $sum: "$transaction.amount" }, // Calculate the total amount for each method
				},
			},
			{
				$project: {
					_id: 0, // Exclude the default _id field
					method: "$_id", // Rename _id to method
					totalAmount: 1, // Include the total amount
				},
			},
		]);

		const top5Salesman = await Order.aggregate([
			{
				$match: {
					salesman: {
						$ne: null,
					},
				},
			},
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: "$salesman", // Group by salesman
					totalSalesQuantity: { $sum: 1 }, // Calculate total sales quantity
					totalSalesAmount: { $sum: "$total" }, // Calculate total sales amount
				},
			},
			{
				$sort: { totalSalesAmount: -1 }, // Sort by total sales amount in descending order
			},
			{
				$limit: 10, // Limit the result to the top 10 salesmen
			},
			// {
			// 	$project: {
			// 		_id: 0,
			// 		salesman: "$_id",
			// 	},
			// },
			{
				$project: {
					_id: 0,
					salesman: "$_id",
					salesmanData: {
						// $arrayElemAt: ["$salesmanData", 0], // Get the name of the salesman
						$cond: {
							if: { $eq: ["$salesmanData", []] },
							then: null,
							else: {
								$concat: [
									{ $arrayElemAt: ["$salesmanData.firstName", 0] },
									" ",
									{ $arrayElemAt: ["$salesmanData.lastName", 0] },
								],
							},
						},
					},
					totalSalesQuantity: 1,
					totalSalesAmount: 1,
				},
			},
			{
				$lookup: {
					from: "admins", // Assuming the employee data is in the "Admin" collection
					localField: "salesman",
					foreignField: "_id",
					as: "salesmanData",
				},
			},
		]);

		const newOrders = await Order.countDocuments({
			...(branch && {
				branch,
			}),
			...((fromDate || toDate) && {
				createdAt: {
					...(fromDate && {
						$gte: fromDate,
					}),
					...(toDate && {
						$lte: toDate,
					}),
				},
			}),
		});

		var typeWisePercentage = await Order.aggregate([
			{
				$match: {
					...(branch && {
						branch: {
							$eq: ObjectId(branch),
						},
					}),
				},
			},
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: "$type", // Group by payment method
					total: { $sum: 1 }, // Calculate the total amount for each method
				},
			},
		]);

		typeWisePercentage?.flatMap((item) => {
			item.percentage = parseFloat(((item.total / newOrders) * 100).toFixed(2));
			return item;
		});

		var branchWisePercentage = await Order.aggregate([
			// {
			// 	$match: {
			// 		...(branch && {
			// 			branch: {
			// 				$eq: ObjectId(branch),
			// 			},
			// 		}),
			// 	},
			// },
			{
				$match: {
					$and: [
						{
							createdAt: {
								...(fromDate && {
									$gte: new Date(fromDate),
								}),
								...(toDate && {
									$lte: new Date(toDate),
								}),
							},
						},
					],
				},
			},
			{
				$group: {
					_id: "$branch", // Group by payment method
					total: { $sum: 1 }, // Calculate the total amount for each method
				},
			},
			{
				$project: {
					_id: 0,
					branch: "$_id",
					branchData: {
						$arrayElemAt: ["$branchData", 0], // Get the name of the salesman
					},
					total: 1,
				},
			},
			{
				$lookup: {
					from: "branches", // Assuming the branch data is in the "branches" collection
					localField: "branch",
					foreignField: "_id",
					as: "branchData",
				},
			},
		]);

		branchWisePercentage?.flatMap((item) => {
			item.percentage = parseFloat(((item.total / newOrders) * 100).toFixed(2));
			return item;
		});

		res.status(200).json({
			success: true,
			message: "Range Report",
			data: {
				newCustomers: await Customer.countDocuments({
					...((fromDate || toDate) && {
						createdAt: {
							...(fromDate && {
								$gte: fromDate,
							}),
							...(toDate && {
								$lte: toDate,
							}),
						},
					}),
				}),
				newOrders,
				totalSales: totalSales?.[0]?.total || 0,
				totalDue: totalDue?.[0]?.total || 0,
				totalPettyCash: totalPettyCash?.[0]?.total || 0,
				MFSReport: mfs.reduce((a, b) => {
					const data = mfsReport.find((item) => item.method === b);
					return {
						...a,
						[b]: data?.totalAmount || 0,
					};
				}, {}),
				topSalesman: top5Salesman,
				typeWisePercentage,
				branchWisePercentage,
			},
		});
	} catch (error) {
		next(error);
	}
};

exports.product = async (req, res, next) => {
	try {
		const branches = await Branch.find();

		var data = {};

		for await (const branch of branches) {
			await Item.countDocuments({
				branch: branch._id,
				product: req.params.id,
				orderLine: {
					$eq: null,
				},
			})
				.then((count) => {
					data[branch.name] = count;
				})
				.catch((err) => {
					next(err);
				});
		}

		const central_inventory = await Item.countDocuments({
			branch: {
				$eq: null,
			},
			product: req.params.id,
			orderLine: {
				$eq: null,
			},
		});

		const total = await Item.countDocuments({
			product: req.params.id,
			orderLine: {
				$eq: null,
			},
		});

		res.status(200).json({
			success: true,
			message: "Product Report",
			data: {
				...data,
				Inventory: central_inventory,
				Total: total,
			},
		});
	} catch (error) {
		next(error);
	}
};
