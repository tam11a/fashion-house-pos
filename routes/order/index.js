const express = require("express");
const { protect } = require("../../middleware/auth");
const {
	create,
	getAll,
	byID,
	addTransaction,
	ItemsByID,
} = require("../../controllers/order");
const { query } = require("../../middleware/query");
const router = express.Router();

// Create API
/**
 * @swagger
 * /api/order:
 *  post:
 *    tags: [Order]
 *    summary: Create new Order
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(protect, create);

module.exports = router;

// Get All API
/**
 * @swagger
 * /api/order:
 *  get:
 *    tags: [Order]
 *    summary: Get All Order List
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *      - in: query
 *        name: status
 *        type: string
 *        enum:
 *          - Pending
 *          - Confirmed
 *          - Shipped
 *          - Delivered
 *          - Canceled
 *          - Returned
 *      - in: query
 *        name: branch
 *        type: string
 *      - in: query
 *        name: customer
 *        type: string
 *      - in: query
 *        name: salesman
 *        type: string
 *      - in: query
 *        name: type
 *        type: string
 *      - in: query
 *        name: hasDue
 *        type: string
 *      - in: query
 *        name: mfs
 *        type: string
 *      - in: query
 *        name: fromDate
 *        type: date
 *      - in: query
 *        name: toDate
 *        type: date
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/").get(protect, query, getAll);

// Get Order API
/**
 * @swagger
 * /api/order/orderlines/{id}:
 *  get:
 *    tags: [Order]
 *    summary: Get Items
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/orderlines/:order_id").get(ItemsByID);

// Get Order API
/**
 * @swagger
 * /api/order/{id}:
 *  get:
 *    tags: [Order]
 *    summary: Get Order
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:order_id").get(byID);

// Get Order API
/**
 * @swagger
 * /api/order/{id}/transaction:
 *  patch:
 *    tags: [Order]
 *    summary: Add transaction in Order
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Order Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transaction'
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:order_id/transaction").patch(protect, addTransaction);
