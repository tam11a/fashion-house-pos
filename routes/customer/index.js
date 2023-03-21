const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const { getAll, byID, create, update, activeInactive } = require("../../controllers/customer");

// Get All API
/**
 * @swagger
 * /api/customer:
 *  get:
 *    tags: [Customer]
 *    summary: Get All Customers
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
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Get Customer API
/**
 * @swagger
 * /api/customer/{id}:
 *  get:
 *    tags: [Customer]
 *    summary: Get Customer Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:customer_id").get(protect, byID);

// Create API
/**
 * @swagger
 * /api/customer:
 *  post:
 *    tags: [Customer]
 *    summary: Create new Customer
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Customer'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(protect, create);

// Update Status API
/**
 * @swagger
 * /api/customer/{id}:
 *  put:
 *    tags: [Customer]
 *    summary: Toggle Customer Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:customer_id").put(protect, activeInactive);

// Update API
/**
 * @swagger
 * /api/customer/{id}:
 *  patch:
 *    tags: [Customer]
 *    summary: Update Customer
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Customer Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/CustomerUpdate'
 *
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:customer_id").patch(protect, update);

module.exports = router;
