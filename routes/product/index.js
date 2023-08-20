const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const {
	getAll,
	byID,
	create,
	update,
	activeInactive,
	generatemockbarcode,
} = require("../../controllers/product");

// Get All API

/**
 * @swagger
 * /api/product:
 *  get:
 *    tags: [Product]
 *    summary: Get All Products
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
 *        name: category
 *        type: string
 *      - in: query
 *        name: subcategory
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

/**
 * @swagger
 * /api/product/generate-barcode:
 *  get:
 *    tags: [Product]
 *    summary: Generate mock barcode
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/generate-barcode").get(generatemockbarcode);

// Get Product API
/**
 * @swagger
 * /api/product/{id}:
 *  get:
 *    tags: [Product]
 *    summary: Get Product Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id").get(protect, byID);

// Create API
/**
 * @swagger
 * /api/product:
 *  post:
 *    tags: [Product]
 *    summary: Create new Product
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
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
 * /api/product/{id}:
 *  put:
 *    tags: [Product]
 *    summary: Toggle product Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:product_id").put(protect, activeInactive);

// Update API
/**
 * @swagger
 * /api/product/{id}:
 *  patch:
 *    tags: [Product]
 *    summary: Update Product
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Product Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/ProductUpdate'
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
router.route("/:product_id").patch(protect, update);

module.exports = router;
