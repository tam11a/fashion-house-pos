const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const {
	getAll,
	byID,
	bulkUpdate,
	ReceiveByID,
} = require("../../controllers/item");

// Get All API
/**
 * @swagger
 * /api/item:
 *  get:
 *    tags: [Item]
 *    summary: Get All Items
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
 *        name: sort
 *        type: string
 *      - in: query
 *        name: isActive
 *        type: string
 *      - in: query
 *        name: supplier
 *        type: string
 *      - in: query
 *        name: tailor
 *        type: string
 *      - in: query
 *        name: shipment
 *        type: string
 *      - in: query
 *        name: branch
 *        type: string
 *      - in: query
 *        name: product
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Get Item API
/**
 * @swagger
 * /api/item/{id}:
 *  get:
 *    tags: [Item]
 *    summary: Get Item Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Item Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:item_id").get(protect, byID);

// Bulk Update API
/**
 * @swagger
 * /api/item:
 *  put:
 *    tags: [Item]
 *    summary: Bulk update item
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ItemUpdate'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").put(protect, bulkUpdate);

/**
 * @swagger
 * /api/item/{id}:
 *  put:
 *    tags: [Item]
 *    summary: Receive Item from Tailor
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Item Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:item_id").put(protect, ReceiveByID);

module.exports = router;
