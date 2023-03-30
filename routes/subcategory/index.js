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
} = require("../../controllers/subcategory");

// Get All API
/**
 * @swagger
 * /api/subcategory:
 *  get:
 *    tags: [Subcategory]
 *    summary: Get All Subcategorys
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
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(protect, query, getAll);

// Get Subcategory API
/**
 * @swagger
 * /api/subcategory/{id}:
 *  get:
 *    tags: [Subcategory]
 *    summary: Get Subcategory Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:subcategory_id").get(protect, byID);

// Create API
/**
 * @swagger
 * /api/subcategory:
 *  post:
 *    tags: [Subcategory]
 *    summary: Create new Subcategory
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Subcategory'
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
 * /api/subcategory/{id}:
 *  put:
 *    tags: [Subcategory]
 *    summary: Toggle Subcategory Status
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:subCategory_id").put(protect, activeInactive);

// Update API
/**
 * @swagger
 * /api/subcategory/{id}:
 *  patch:
 *    tags: [Subcategory]
 *    summary: Update Subcategory
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Subcategory Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/SubcategoryUpdate'
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
router.route("/:subcategory_id").patch(protect, update);

module.exports = router;
