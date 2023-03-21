const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const { getAll, byID, create, update } = require("../../controllers/tailor");

// Get All API
/**
 * @swagger
 * /api/tailor:
 *  get:
 *    tags: [Tailor]
 *    summary: Get All Tailors
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

// Get Tailor API
/**
 * @swagger
 * /api/tailor/{id}:
 *  get:
 *    tags: [Tailor]
 *    summary: Get Tailor Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Tailor Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

router.route("/:tailor_id").get(protect, byID);

// Create API
/**
 * @swagger
 * /api/tailor:
 *  post:
 *    tags: [Tailor]
 *    summary: Create new Tailor
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Tailor'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(protect, create);

// Update API
/**
 * @swagger
 * /api/tailor/{id}:
 *  patch:
 *    tags: [Tailor]
 *    summary: Update Tailor
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Tailor Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/TailorUpdate'
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
router.route("/:tailor_id").patch(protect, update);

module.exports = router;
