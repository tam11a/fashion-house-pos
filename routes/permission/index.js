const express = require("express");
const { protect } = require("../../middleware/auth");
const { query } = require("../../middleware/query");
const { getAll, create } = require("../../controllers/permission");
const router = express.Router();

// Get All API
/**
 * @swagger
 * /api/permission:
 *  get:
 *    tags: [Permission]
 *    summary: Get All Permissions
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

// Get Permission API
/**
 * @ swagger
 * /api/permission/{id}:
 *  get:
 *    tags: [Permission]
 *    summary: Get Permission Information
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Permission Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */

// Create API
/**
 * @swagger
 * /api/permission:
 *  post:
 *    tags: [Permission]
 *    summary: Create new Permission
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Permission'
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
